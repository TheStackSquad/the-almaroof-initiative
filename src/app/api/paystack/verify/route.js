// src/app/api/paystack/verify/route.js
import { NextResponse } from "next/server";
import { headers } from "next/headers"; // Step 1: Import headers for IP detection
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";
import crypto from "crypto";
import rateLimit from "@/utils/rate-limit";

// Step 2: Environment validation
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const WEBHOOK_SECRET =
  process.env.PAYSTACK_WEBHOOK_SECRET || PAYSTACK_SECRET_KEY;

if (!PAYSTACK_SECRET_KEY) {
  throw new Error("PAYSTACK_SECRET_KEY environment variable is required");
}

// Step 3: Initialize the rate limiter
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max 500 users per minute
});

// Step 4: Retry mechanism for database operations
async function retryDatabaseOperation(operation, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      console.error(`Database operation failed (attempt ${i + 1}):`, error);
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
    }
  }
}

// Step 5: Validate metadata structure
function validateMetadata(metadata) {
  if (!metadata || typeof metadata !== "object") {
    return { isValid: false, error: "Missing metadata" };
  }

  const { permit_id, user_id, permit_type } = metadata;

  if (!permit_id || !user_id) {
    return { isValid: false, error: "Missing required metadata fields" };
  }

  // Validate UUID format for user_id
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(user_id)) {
    return { isValid: false, error: "Invalid user_id format" };
  }

  return { isValid: true };
}

// Step 6: Convert amount from kobo to naira consistently
function convertAmount(amountInKobo) {
  return Math.round(amountInKobo) / 100;
}

// GET handler for browser redirects from Paystack
export async function GET(req) {
  // Step 7: Get client IP for rate limiting
  const headersList = headers();
  const clientIP =
    headersList.get("x-forwarded-for") ||
    headersList.get("x-real-ip") ||
    "unknown";

  try {
    // Step 8: Apply Rate Limiting using the imported utility
    try {
      await limiter.check(10, clientIP); // Allow 10 requests per minute per IP for the GET handler
    } catch (rateLimitError) {
      console.warn(`🚨 Rate limit exceeded for IP: ${clientIP}`);
      return NextResponse.json(
        {
          status: "error",
          message: "Rate limit exceeded. Please try again later.",
        },
        { status: 429 }
      );
    }

    // Step 9: Extract and validate reference
    const searchParams = new URL(req.url).searchParams;
    const reference = searchParams.get("reference");

    if (
      !reference ||
      typeof reference !== "string" ||
      reference.trim() === ""
    ) {
      console.error("❌ GET verification failed: Invalid or missing reference");
      return NextResponse.json(
        { status: "error", message: "Invalid payment reference" },
        { status: 400 }
      );
    }

    console.log(`🔍 GET verification started for reference: ${reference}`);

    // Step 10: Check if transaction was already processed (prevent duplicate processing)
    const { data: existingTransaction } = await supabaseAdmin
      .from("permits")
      .select("id, status, reference")
      .or(`reference.eq.${reference},paystack_reference.eq.${reference}`)
      .single();

    if (existingTransaction?.status === "paid") {
      console.log(`✅ Transaction ${reference} already processed successfully`);
      return NextResponse.json({
        status: "success",
        message: "Payment already verified",
        data: { reference, status: "paid" },
      });
    }

    // Step 11: Verify transaction with Paystack (with proper timeout)
    const controller = new AbortController(); // Step 11a: Create AbortController
    const timeoutId = setTimeout(() => controller.abort(), 30000); // Step 11b: Set 30s timeout

    let paystackResponse;
    try {
      paystackResponse = await fetch(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          signal: controller.signal, // Step 11c: Pass the abort signal
        }
      );
      clearTimeout(timeoutId); // Step 11d: Clear the timeout if request completes
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("❌ Paystack verification request timed out");
        return NextResponse.json(
          { status: "error", message: "Payment verification timed out." },
          { status: 504 }
        );
      }
      throw error; // Re-throw other errors
    }

    if (!paystackResponse.ok) {
      console.error(
        `❌ Paystack API error: ${paystackResponse.status} ${paystackResponse.statusText}`
      );
      return NextResponse.json(
        {
          status: "error",
          message: "Payment verification service unavailable",
        },
        { status: 503 }
      );
    }

    const data = await paystackResponse.json();

    if (!data.status || !data.data) {
      console.error(
        `❌ Invalid Paystack response structure for reference: ${reference}`
      );
      return NextResponse.json(
        { status: "error", message: "Invalid payment verification response" },
        { status: 400 }
      );
    }

    const transactionData = data.data;
    const {
      status: transactionStatus,
      amount,
      metadata,
      customer,
    } = transactionData;

    // Step 12: Validate transaction status
    if (transactionStatus !== "success") {
      console.error(
        `❌ Payment failed for reference: ${reference}. Status: ${transactionStatus}`
      );
      return NextResponse.json(
        {
          status: "failed",
          message: "Payment was not successful",
          transactionStatus,
        },
        { status: 400 }
      );
    }

    // Step 13: Validate metadata
    const metadataValidation = validateMetadata(metadata);
    if (!metadataValidation.isValid) {
      console.error(
        `❌ Invalid metadata for reference: ${reference}. Error: ${metadataValidation.error}`
      );
      return NextResponse.json(
        { status: "error", message: "Invalid payment metadata" },
        { status: 400 }
      );
    }

    const { permit_id, user_id } = metadata;
    const amountInNaira = convertAmount(amount);

    console.log(
      `✅ Payment verified for permit ${permit_id}, amount: ₦${amountInNaira}`
    );

    // Step 14: Update permit status with retry mechanism
    const updateResult = await retryDatabaseOperation(async () => {
      const { data: updatedPermit, error } = await supabaseAdmin
        .from("permits")
        .update({
          status: "paid",
          amount: amountInNaira,
          reference: reference,
          paystack_reference: reference,
          paid_at: new Date().toISOString(),
          payment_channel: transactionData.channel,
          updated_at: new Date().toISOString(),
        })
        .eq("id", permit_id)
        .eq("user_id", user_id)
        .select()
        .single();

      if (error) throw error;
      return updatedPermit;
    });

    if (!updateResult) {
      console.error(`❌ Permit not found: ID ${permit_id}, User ${user_id}`);
      return NextResponse.json(
        { status: "error", message: "Permit not found or unauthorized" },
        { status: 404 }
      );
    }

    console.log(`✅ Permit ${permit_id} successfully updated to 'paid' status`);

    // Step 15: Return success response
    return NextResponse.json({
      status: "success",
      message: "Payment verified successfully",
      data: {
        reference,
        amount: amountInNaira,
        permit_id,
        status: "paid",
        customer_email: customer?.email,
      },
    });
  } catch (error) {
    console.error("🚨 GET verification route error:", error);
    return NextResponse.json(
      { status: "error", message: "Payment verification failed" },
      { status: 500 }
    );
  }
}

// POST handler for Paystack webhooks
export async function POST(req) {
  // Step 16: Get client IP for webhook rate limiting
  const headersList = headers();
  const clientIP =
    headersList.get("x-forwarded-for") ||
    headersList.get("x-real-ip") ||
    "unknown";
  const identifier = `webhook_${clientIP}`;

  try {
    // Step 17: Apply Rate Limiting for webhooks using the imported utility
    try {
      await limiter.check(50, identifier); // Allow 50 requests per minute per IP for webhooks
    } catch (rateLimitError) {
      console.warn(`🚨 Webhook rate limit exceeded for IP: ${clientIP}`);
      return NextResponse.json(
        { message: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    const rawBody = await req.text();
    const payload = JSON.parse(rawBody);

    // Step 18: Verify webhook signature
    const signature = req.headers.get("x-paystack-signature");
    if (!signature) {
      console.error("❌ Missing webhook signature");
      return NextResponse.json(
        { message: "Missing signature" },
        { status: 401 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha512", WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("❌ Webhook signature verification failed");
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 }
      );
    }

    console.log(`✅ Webhook signature verified for event: ${payload.event}`);

    // Step 19: Process charge.success events
    if (payload.event === "charge.success") {
      const transactionData = payload.data;
      const { status, reference, amount, metadata, customer } = transactionData;

      // Validate required fields
      if (!reference || !amount || !metadata) {
        console.error("❌ Webhook missing required fields");
        return NextResponse.json(
          { message: "Invalid webhook data" },
          { status: 400 }
        );
      }

      const metadataValidation = validateMetadata(metadata);
      if (!metadataValidation.isValid) {
        console.error(
          `❌ Webhook invalid metadata: ${metadataValidation.error}`
        );
        return NextResponse.json(
          { message: "Invalid metadata" },
          { status: 400 }
        );
      }

      const { permit_id, user_id } = metadata;
      const amountInNaira = convertAmount(amount);

      console.log(
        `🎣 Webhook processing payment for permit ${permit_id}, reference: ${reference}`
      );

      // Step 20: Check if already processed
      const { data: existing } = await supabaseAdmin
        .from("permits")
        .select("status")
        .eq("id", permit_id)
        .eq("user_id", user_id)
        .single();

      if (existing?.status === "paid") {
        console.log(`✅ Webhook: Transaction ${reference} already processed`);
        return NextResponse.json({ message: "Already processed" });
      }

      // Step 21: Update permit with webhook data
      const updateResult = await retryDatabaseOperation(async () => {
        const { data, error } = await supabaseAdmin
          .from("permits")
          .update({
            status: "paid",
            amount: amountInNaira,
            reference: reference,
            paystack_reference: reference,
            paid_at: new Date().toISOString(),
            payment_channel: transactionData.channel,
            updated_at: new Date().toISOString(),
          })
          .eq("id", permit_id)
          .eq("user_id", user_id)
          .select()
          .single();

        if (error) throw error;
        return data;
      });

      if (!updateResult) {
        console.warn(`⚠️ Webhook: Permit not found for ID: ${permit_id}`);
        return NextResponse.json(
          { message: "Permit not found" },
          { status: 404 }
        );
      }

      console.log(`✅ Webhook: Permit ${permit_id} updated to 'paid'`);
      return NextResponse.json({ message: "Payment processed successfully" });
    }

    // Step 22: Log other webhook events
    console.log(`📝 Webhook event received: ${payload.event}`);
    return NextResponse.json({ message: "Event acknowledged" });
  } catch (error) {
    console.error("🚨 Webhook processing error:", error);
    return NextResponse.json(
      { message: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
