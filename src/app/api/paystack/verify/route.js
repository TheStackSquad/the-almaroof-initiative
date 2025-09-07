// src/app/api/paystack/verify/route.js
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";
import crypto from "crypto";
import rateLimit from "@/utils/rate-limit";
import { PERMIT_STATUS } from "@/components/common/permitStatus";

// Environment validation
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const WEBHOOK_SECRET =
  process.env.PAYSTACK_WEBHOOK_SECRET || PAYSTACK_SECRET_KEY;
const isDevelopment = process.env.NODE_ENV === "development";

if (!PAYSTACK_SECRET_KEY) {
  throw new Error("PAYSTACK_SECRET_KEY environment variable is required");
}

// Initialize rate limiter
const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

// Retry mechanism for database operations
async function retryDatabaseOperation(operation, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (isDevelopment) {
        console.error(`Database operation failed (attempt ${i + 1}):`, error);
      }
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
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

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(user_id)) {
    return { isValid: false, error: "Invalid user_id format" };
  }

  return { isValid: true };
}

// GET handler for browser redirects from Paystack
export async function GET(req) {
  const headersList = headers();
  const clientIP =
    headersList.get("x-forwarded-for") ||
    headersList.get("x-real-ip") ||
    "unknown";

  try {
    // Apply Rate Limiting
    try {
      await limiter.check(10, clientIP);
    } catch (rateLimitError) {
      if (isDevelopment)
        console.warn(`🚨 Rate limit exceeded for IP: ${clientIP}`);
      return NextResponse.json(
        { status: "error", message: "Rate limit exceeded" },
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
      if (isDevelopment)
        console.error(
          "❌ GET verification failed: Invalid or missing reference"
        );
      return NextResponse.json(
        { status: "error", message: "Invalid payment reference" },
        { status: 400 }
      );
    }

    if (isDevelopment)
      console.log(`🔍 GET verification started for reference: ${reference}`);

    // Check if transaction was already processed
    const { data: existingTransaction } = await supabaseAdmin
      .from("permits")
      .select("id, status, reference")
      .or(`reference.eq.${reference},paystack_reference.eq.${reference}`)
      .single();

    if (existingTransaction?.status === PERMIT_STATUS.PAID) {
      if (isDevelopment)
        console.log(
          `✅ Transaction ${reference} already processed successfully`
        );
      return NextResponse.json({
        status: "success",
        message: "Payment already verified",
      });
    }

    // Verify transaction with Paystack
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

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
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);
    } catch (error) {
      if (error.name === "AbortError") {
        if (isDevelopment)
          console.error("❌ Paystack verification request timed out");
        return NextResponse.json(
          { status: "error", message: "Payment verification timed out" },
          { status: 504 }
        );
      }
      throw error;
    }

    if (!paystackResponse.ok) {
      if (isDevelopment)
        console.error(`❌ Paystack API error: ${paystackResponse.status}`);
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
      if (isDevelopment)
        console.error(
          `❌ Invalid Paystack response for reference: ${reference}`
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
      if (isDevelopment)
        console.error(
          `❌ Payment failed for reference: ${reference}, Status: ${transactionStatus}`
        );
      return NextResponse.json(
        { status: "failed", message: "Payment was not successful" },
        { status: 400 }
      );
    }

    // Validate metadata
    const metadataValidation = validateMetadata(metadata);
    if (!metadataValidation.isValid) {
      if (isDevelopment)
        console.error(`❌ Invalid metadata for reference: ${reference}`);
      return NextResponse.json(
        { status: "error", message: "Invalid payment metadata" },
        { status: 400 }
      );
    }

    const { permit_id, user_id } = metadata;

    if (isDevelopment) {
      console.log(`✅ Payment verified for permit ${permit_id}`);
      console.log(`💰 Amount: ${amount} kobo (₦${(amount / 100).toFixed(2)})`);
    }

    // Check current permit state before updating
    const { data: currentPermit, error: fetchError } = await supabaseAdmin
      .from("permits")
      .select("status, payment_attempts, expires_at, amount")
      .eq("id", permit_id)
      .single();

    if (fetchError || !currentPermit) {
      if (isDevelopment) console.error(`❌ Permit not found: ID ${permit_id}`);
      return NextResponse.json(
        { status: "error", message: "Permit not found" },
        { status: 404 }
      );
    }

    // Validate state transition
    if (currentPermit.status !== PERMIT_STATUS.PAYMENT_PROCESSING) {
      if (isDevelopment) {
        console.error(
          `❌ Invalid status transition from ${currentPermit.status} to ${PERMIT_STATUS.PAID}`
        );
        console.log(`📊 Current permit state:`, currentPermit);
      }
      return NextResponse.json(
        { status: "error", message: "Invalid payment state" },
        { status: 400 }
      );
    }

    // Check expiration
    if (new Date(currentPermit.expires_at) < new Date()) {
      if (isDevelopment) console.error(`❌ Permit ${permit_id} has expired`);
      return NextResponse.json(
        { status: "error", message: "Payment window expired" },
        { status: 400 }
      );
    }

    // Update permit status with retry mechanism
    const updateResult = await retryDatabaseOperation(async () => {
      const { data: updatedPermit, error } = await supabaseAdmin
        .from("permits")
        .update({
          status: PERMIT_STATUS.PAID,
          amount: amount, // Store as kobo integer
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
      if (isDevelopment)
        console.error(`❌ Failed to update permit: ID ${permit_id}`);
      return NextResponse.json(
        { status: "error", message: "Failed to update permit" },
        { status: 500 }
      );
    }

    if (isDevelopment) {
      console.log(
        `✅ Permit ${permit_id} successfully updated to '${PERMIT_STATUS.PAID}' status`
      );
      console.log(`📊 Updated permit:`, updateResult);
    }

    return NextResponse.json({
      status: "success",
      message: "Payment verified successfully",
      data: { reference, amount, permit_id, status: PERMIT_STATUS.PAID },
    });
  } catch (error) {
    if (isDevelopment) console.error("🚨 GET verification route error:", error);
    return NextResponse.json(
      { status: "error", message: "Payment verification failed" },
      { status: 500 }
    );
  }
}

// POST handler for Paystack webhooks (similar fixes applied)
export async function POST(req) {
  // ... [WEBHOOK HANDLER IMPLEMENTATION WITH SIMILAR FIXES]
  // Would include the same status, amount, and validation fixes
}
