// src/utils/handlers/onSubmitPermitForm.js
import { createPermitEntry } from "./createPermitEntry";
import { initiatePaystackPayment } from "./paystackHandler";

export const onSubmitPermitForm = async (formData, userId) => {
  try {
    if (!userId) {
      return { success: false, error: "User ID is required" };
    }

    if (!formData || typeof formData !== "object") {
      return { success: false, error: "Invalid form data" };
    }

    // Create permit entry
    const permitResult = await createPermitEntry(formData, userId);
    if (!permitResult.success) {
      return { success: false, error: permitResult.error };
    }

    // Initiate payment
    const paymentResult = await initiatePaystackPayment({
      email: formData.email,
      amount: formData.amount,
      reference: permitResult.data.reference,
      metadata: {
        permit_id: permitResult.data.id,
        permit_type: formData.permit_type,
        application_type: formData.application_type,
      },
    });

    if (!paymentResult.success) {
      console.error("Payment initialization failed:", paymentResult.error);
      // Permit created but payment failed - you may want to handle this differently
      return {
        success: true,
        data: permitResult.data,
        warning: "Application submitted but payment initialization failed",
      };
    }

    return {
      success: true,
      data: {
        ...permitResult.data,
        payment_url: paymentResult.authorization_url,
      },
    };
  } catch (error) {
    console.error("Unexpected error in onSubmitPermitForm:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
};
