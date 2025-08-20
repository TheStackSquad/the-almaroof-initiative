// src/app/api/paystack/verify/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";
import crypto from "crypto";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(req) {
  try {
    const payload = await req.json();

    // 1. Verify the webhook signature
    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(payload))
      .digest("hex");

    if (hash !== req.headers.get("x-paystack-signature")) {
      console.error("❌ Webhook signature verification failed.");
      return NextResponse.json(
        { message: "Signature verification failed." },
        { status: 401 }
      );
    }

    // 2. Process the webhook event
    if (payload.event === "charge.success") {
      const transactionData = payload.data;
      const {
        status,
        reference,
        amount,
        metadata: { permit_id, user_id },
      } = transactionData;

      console.log(
        `✅ Webhook received for transaction reference: ${reference}`
      );
      console.log(
        `Processing payment for permit_id: ${permit_id} with amount: ${amount}`
      );

      // 3. Update the permit status in your database
      const { data, error } = await supabaseAdmin
        .from("permits")
        .update({ status: "pending", amount: amount / 100 })
        .eq("id", permit_id)
        .eq("user_id", user_id) // Add extra check for security
        .select()
        .single();

      if (error) {
        console.error("🚨 Supabase update failed:", error);
        return NextResponse.json(
          { message: "Database update failed." },
          { status: 500 }
        );
      }

      if (!data) {
        console.warn(
          `⚠️ Permit not found or already updated for ID: ${permit_id}`
        );
        return NextResponse.json(
          { message: "Permit not found or updated." },
          { status: 404 }
        );
      }

      console.log(`✅ Permit ID ${permit_id} status updated to 'pending'.`);
      return NextResponse.json({
        message: "Permit status updated successfully.",
      });
    }

    // 4. Handle other events (e.g., failed, abandoned)
    console.log(`⚠️ Received Paystack event: ${payload.event}`);
    return NextResponse.json({ message: "Event received, no action taken." });
  } catch (error) {
    console.error("🚨 Webhook processing error:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
