// src/app/api/paystack/verify/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";
import crypto from "crypto";

// Environment validation
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const WEBHOOK_SECRET =
  process.env.PAYSTACK_WEBHOOK_SECRET || PAYSTACK_SECRET_KEY;

if (!PAYSTACK_SECRET_KEY) {
  throw new Error("PAYSTACK_SECRET_KEY environment variable is required");
}

// Rate limiting store (use Redis in production)
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute

// Rate limiting middleware
function checkRateLimit(identifier) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  // Clean old entries
  for (const [key, value] of requestCounts.entries()) {
    if (value.timestamp < windowStart) {
      requestCounts.delete(key);
    }
  }

  const current = requestCounts.get(identifier) || { count: 0, timestamp: now };

  if (current.timestamp < windowStart) {
    current.count = 1;
    current.timestamp = now;
  } else {
    current.count++;
  }

  requestCounts.set(identifier, current);
  return current.count <= RATE_LIMIT_MAX_REQUESTS;
}

// Retry mechanism for database operations
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

// Validate metadata structure
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

// Convert amount from kobo to naira consistently
function convertAmount(amountInKobo) {
  return Math.round(amountInKobo) / 100;
}

// GET handler for browser redirects from Paystack
export async function GET(req) {
  const clientIP =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown";

  try {
    // Rate limiting
    if (!checkRateLimit(clientIP)) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return NextResponse.json(
        {
          status: "error",
          message: "Rate limit exceeded. Please try again later.",
        },
        { status: 429 }
      );
    }

    // Extract and validate reference
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

    // Check if transaction was already processed (prevent duplicate processing)
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

    // Verify transaction with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 second timeout
      }
    );

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

    // Validate transaction status
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

    // Validate metadata
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

    // Update permit status with retry mechanism
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

    // Return success response
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
  const clientIP =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown";

  try {
    // Rate limiting for webhooks
    if (!checkRateLimit(`webhook_${clientIP}`)) {
      console.warn(`Webhook rate limit exceeded for IP: ${clientIP}`);
      return NextResponse.json(
        { message: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    const rawBody = await req.text();
    const payload = JSON.parse(rawBody);

    // Verify webhook signature
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

    // Process charge.success events
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

      // Check if already processed
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

      // Update permit with webhook data
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

    // Log other webhook events
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
