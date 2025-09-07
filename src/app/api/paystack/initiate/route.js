// src/app/api/paystack/initiate/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";
import { PERMIT_STATUS } from "@/components/common/permitStatus";

const isDevelopment = process.env.NODE_ENV === "development";

export async function POST(req) {
  try {
    // FIX 1: Extract permit_id from root level (not from metadata)
    const { reference, permit_id } = await req.json();

    if (isDevelopment) {
      console.log("--- /api/paystack/initiate: POST request received ---");
      console.log("Received parameters:", {
        reference,
        permit_id,
      });
    }

    // FIX 2: Validate required fields including permit_id
    if (!permit_id) {
      if (isDevelopment) {
        console.log("❌ Validation failed: Missing permit_id.");
      }
      return NextResponse.json(
        { error: "Missing required field: permit_id" },
        { status: 400 }
      );
    }

    // Step 1: Fetch the permit from database
    const { data: permit, error: permitError } = await supabaseAdmin
      .from("permits")
      .select("*")
      .eq("id", permit_id)
      .single();

    if (permitError || !permit) {
      console.error("❌ Database error fetching permit:", permitError);
      return NextResponse.json(
        { error: "Permit not found or invalid" },
        { status: 404 }
      );
    }

    // FIX 3: Validate permit is in pending_payment state (not unpaid)
    if (permit.status !== PERMIT_STATUS.PENDING_PAYMENT) {
      if (isDevelopment) {
        console.log(
          `❌ Permit status is '${permit.status}', not '${PERMIT_STATUS.PENDING_PAYMENT}'.`
        );
      }
      return NextResponse.json(
        { error: "This permit has already been processed or expired" },
        { status: 400 }
      );
    }

    // FIX 4: Validate payment attempts
    if (permit.payment_attempts >= 3) {
      if (isDevelopment) {
        console.log(
          `❌ Maximum payment attempts (3) reached for permit ${permit_id}`
        );
      }
      return NextResponse.json(
        { error: "Maximum payment attempts reached. Please contact support." },
        { status: 400 }
      );
    }

    // FIX 5: Validate expiration
    if (new Date(permit.expires_at) < new Date()) {
      if (isDevelopment) {
        console.log(`❌ Permit ${permit_id} has expired`);
      }
      return NextResponse.json(
        {
          error: "Payment window has expired. Please create a new application.",
        },
        { status: 400 }
      );
    }

    // Step 2: Get Paystack secret key
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      console.error("❌ Server error: PAYSTACK_SECRET_KEY not configured.");
      return NextResponse.json(
        { error: "Payment service configuration error" },
        { status: 500 }
      );
    }

    // FIX 6: Amount is already in kobo, no conversion needed
    const amountInKobo = Number(permit.amount);
    const paymentReference = reference || permit.reference;

    if (isDevelopment) {
      console.log("💰 Amount for Paystack:", {
        amount_in_kobo: amountInKobo,
        formatted_display: `₦${(amountInKobo / 100).toFixed(2)}`,
      });
    }

    const paymentData = {
      email: permit.email,
      amount: amountInKobo, // Already in correct kobo format
      reference: paymentReference,
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/community/online-services/business-permit/verify?reference=${paymentReference}`,
      metadata: {
        permit_id: permit.id,
        user_id: permit.user_id,
        permit_type: permit.permit_type,
        cancel_action: `${process.env.NEXT_PUBLIC_SITE_URL}/community/online-services/business-permit`,
      },
    };

    if (isDevelopment) {
      console.log(
        "Initiating Paystack transaction with validated data:",
        paymentData
      );
    }

    // FIX 7: Update permit status to payment_processing BEFORE initiating payment
    const { error: updateError } = await supabaseAdmin
      .from("permits")
      .update({
        status: PERMIT_STATUS.PAYMENT_PROCESSING,
        payment_attempts: permit.payment_attempts + 1,
        last_payment_attempt: new Date().toISOString(),
        paystack_reference: paymentReference,
        updated_at: new Date().toISOString(),
      })
      .eq("id", permit_id);

    if (updateError) {
      console.error("❌ Failed to update permit status:", updateError);
      return NextResponse.json(
        { error: "Failed to prepare permit for payment" },
        { status: 500 }
      );
    }

    // Step 3: Initialize transaction with Paystack
    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      }
    );

    const paystackResponse = await response.json();

    // Step 4: Handle Paystack API response
    if (!response.ok) {
      console.error("🚨 Paystack API error:", paystackResponse);

      // Revert status to pending_payment on Paystack failure
      await supabaseAdmin
        .from("permits")
        .update({
          status: PERMIT_STATUS.PENDING_PAYMENT,
          updated_at: new Date().toISOString(),
        })
        .eq("id", permit_id);

      return NextResponse.json(
        { error: paystackResponse.message || "Payment initialization failed" },
        { status: response.status }
      );
    }

    if (isDevelopment) {
      console.log("✅ Paystack transaction initialized successfully.");
      console.log("--- /api/paystack/initiate: request completed ---");
    }

    // Step 5: Return success response to client
    return NextResponse.json({
      authorization_url: paystackResponse.data.authorization_url,
      access_code: paystackResponse.data.access_code,
      reference: paystackResponse.data.reference,
      permit_id: permit.id,
      status: PERMIT_STATUS.PAYMENT_PROCESSING,
    });
  } catch (error) {
    console.error("🚨 Unexpected error in /api/paystack/initiate:", error);
    return NextResponse.json(
      { error: "Internal server error during payment initialization" },
      { status: 500 }
    );
  }
}
