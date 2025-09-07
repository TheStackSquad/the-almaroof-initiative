// src/utils/handlers/initiatePaystack.js
export const initiatePaystackPayment = async ({
  email,
  amount,
  reference,
  permit_id,
}) => {
  try {
    const response = await fetch("/api/paystack/initiate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, amount, reference, permit_id }),
    });

    if (!response.ok) {
      throw new Error("Failed to initiate payment");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Paystack initiation failed:", err.message);
    throw err;
  }
};