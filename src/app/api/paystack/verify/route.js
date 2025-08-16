// src/app/api/paystack/verify/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/supaClient";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { error: "Payment reference is required" },
        { status: 400 }
      );
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;

    // Verify transaction with Paystack
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.status) {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    const { status, amount, customer, metadata } = data.data;

    if (status === "success") {
      // Update permit status in database
      const { error: updateError } = await supabase
        .from("permits")
        .update({
          status: "paid",
          payment_reference: reference,
          updated_at: new Date().toISOString(),
        })
        .eq("reference", reference);

      if (updateError) {
        console.error("Error updating permit status:", updateError);
        return NextResponse.json(
          { error: "Failed to update payment status" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        status: "success",
        message: "Payment verified successfully",
        data: {
          reference,
          amount: amount / 100, // Convert back to naira
          email: customer.email,
        },
      });
    }

    return NextResponse.json(
      { error: "Payment was not successful" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Internal server error during verification" },
      { status: 500 }
    );
  }
}
