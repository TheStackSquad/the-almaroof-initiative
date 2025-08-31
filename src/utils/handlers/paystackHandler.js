// src/utils/handlers/paystackHandler.js
export const initiatePaystackPayment = async (permit_id) => {
  const isDevelopment = process.env.NODE_ENV === "development";

  try {
    if (isDevelopment) {
      console.log("initiatePaystackPayment called with permit_id:", permit_id);
    }

    const response = await fetch("/api/paystack/initiate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        permit_id, // Now only sending the permit_id
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
      reference: data.reference, // Use the reference returned by the server
    };
  } catch (error) {
    console.error("Paystack initialization network error:", error);
    return {
      success: false,
      error: "Failed to initialize payment due to a network error",
    };
  }
};
