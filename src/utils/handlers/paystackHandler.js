// src/utils/handlers/paystackHandler.js
export const initiatePaystackPayment = async (paymentData) => {
  const isDevelopment = process.env.NODE_ENV === "development";

  try {
    if (isDevelopment) {
      console.log(
        "initiatePaystackPayment called with paymentData:",
        paymentData
      );
    }

    // ✅ EXTRACT permit_id from the paymentData object
    const permit_id = paymentData.permit_id;
    const reference = paymentData.reference;

    if (!permit_id) {
      console.error("❌ Missing permit_id in payment data");
      return {
        success: false,
        error: "Missing permit ID for payment initialization",
      };
    }

    const response = await fetch("/api/paystack/initiate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        permit_id,
        reference,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (isDevelopment) {
        console.error("API Error from /api/paystack/initiate:", data.error);
      }
      return {
        success: false,
        error: data.error || "Payment initialization failed",
      };
    }

    if (isDevelopment) {
      console.log(
        "Payment initiated successfully. Authorization URL received."
      );
    }

    return {
      success: true,
      authorization_url: data.authorization_url,
      reference: data.reference,
    };
  } catch (error) {
    console.error("Paystack initialization network error:", error);
    return {
      success: false,
      error: "Failed to initialize payment due to a network error",
    };
  }
};
