// src/app/api/paystack/initiate/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, amount, reference } = await req.json();

  const paystackSecret = process.env.PAYSTACK_SECRET_KEY;

  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${paystackSecret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount, // amount in kobo (e.g., 2000 NGN => 200000)
      reference,
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/community/online-services/business-permit/next-step`,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data.message }, { status: res.status });
  }

  return NextResponse.json({ authorization_url: data.data.authorization_url });
}
