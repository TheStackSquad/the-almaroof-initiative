// src/app/api/paystack/initiate/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, amount, reference, metadata } = await req.json();

    // Validate required fields
    if (!email || !amount || !reference) {
      return NextResponse.json(
        { error: "Missing required fields: email, amount, or reference" },
        { status: 400 }
      );
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;

    if (!paystackSecret) {
      console.error("PAYSTACK_SECRET_KEY not configured");
      return NextResponse.json(
        { error: "Payment service configuration error" },
        { status: 500 }
      );
    }

    const paymentData = {
      email,
      amount: parseInt(amount), // Ensure amount is integer (kobo)
      reference,
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/community/online-services/business-permit/verify?reference=${reference}`,
      metadata: {
        ...metadata,
        cancel_action: `${process.env.NEXT_PUBLIC_SITE_URL}/community/online-services/business-permit`,
      },
    };

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

    const data = await response.json();

    if (!response.ok) {
      console.error("Paystack API error:", data);
      return NextResponse.json(
        { error: data.message || "Payment initialization failed" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      authorization_url: data.data.authorization_url,
      access_code: data.data.access_code,
      reference: data.data.reference,
    });
  } catch (error) {
    console.error("Payment initialization error:", error);
    return NextResponse.json(
      { error: "Internal server error during payment initialization" },
      { status: 500 }
    );
  }
}
