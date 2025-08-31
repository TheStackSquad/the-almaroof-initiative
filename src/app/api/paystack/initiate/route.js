// src/app/api/paystack/initiate/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin"; // Critical import added

// Step 1: Determine environment for logging
const isDevelopment = process.env.NODE_ENV === "development";

export async function POST(req) {
  try {
    // Step 2: Parse incoming request
    const { permit_id } = await req.json();

    if (isDevelopment) {
      console.log("--- /api/paystack/initiate: POST request received ---");
      console.log("Received permit_id:", permit_id);
    }

    // Step 3: Validate required field
    if (!permit_id) {
      if (isDevelopment) {
        console.log("❌ Validation failed: Missing permit_id.");
      }
      return NextResponse.json(
        { error: "Missing required field: permit_id" },
        { status: 400 }
      );
    }

    // Step 4: Fetch the permit from the database
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

    // Step 5: Validate permit is in an unpaid state
    if (permit.status !== "unpaid") {
      if (isDevelopment) {
        console.log(`❌ Permit status is '${permit.status}', not 'unpaid'.`);
      }
      return NextResponse.json(
        { error: "This permit has already been processed" },
        { status: 400 }
      );
    }

    // Step 6: Get Paystack secret key
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      console.error("❌ Server error: PAYSTACK_SECRET_KEY not configured.");
      return NextResponse.json(
        { error: "Payment service configuration error" },
        { status: 500 }
      );
    }

    // Step 7: Prepare payment data from database values
    const amountInKobo = Math.round(permit.amount * 100); // Convert decimal to kobo
    const paymentReference = permit.reference; // Use server-generated reference

    const paymentData = {
      email: permit.email, // From database
      amount: amountInKobo, // From database
      reference: paymentReference, // From database
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

    // Step 8: Initialize transaction with Paystack
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

    // Step 9: Handle Paystack API response
    if (!response.ok) {
      console.error("🚨 Paystack API error:", paystackResponse);
      return NextResponse.json(
        { error: paystackResponse.message || "Payment initialization failed" },
        { status: response.status }
      );
    }

    if (isDevelopment) {
      console.log("✅ Paystack transaction initialized successfully.");
    }

    // Step 10: Return success response to client
    return NextResponse.json({
      authorization_url: paystackResponse.data.authorization_url,
      access_code: paystackResponse.data.access_code,
      reference: paystackResponse.data.reference,
    });
  } catch (error) {
    // Step 11: Handle unexpected errors
    console.error("🚨 Unexpected error in /api/paystack/initiate:", error);
    return NextResponse.json(
      { error: "Internal server error during payment initialization" },
      { status: 500 }
    );
  }
}
