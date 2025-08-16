// src/utils/handlers/paystackHandler.js
export const initiatePaystackPayment = async ({
  email,
  amount,
  reference,
  metadata = {},
}) => {
  try {
    const response = await fetch("/api/paystack/initiate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount,
        reference,
        metadata,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Payment initialization failed",
      };
    }

    return {
      success: true,
      authorization_url: data.authorization_url,
      reference: reference,
    };
  } catch (error) {
    console.error("Paystack initialization error:", error);
    return {
      success: false,
      error: "Failed to initialize payment",
    };
  }
};
