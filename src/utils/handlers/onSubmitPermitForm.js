// src/utils/handlers/onSubmitPermitForm.js
import { createPermitEntry } from "@/utils/supabase/createPermit";
import { initiatePaystackPayment } from "./paystackHandler";

export const onSubmitPermitForm = async (formData, authState) => {
  try {
    console.log("------------------------------------");
    console.log("Received formData:", formData);
    console.log("Received authState:", authState);

    if (!authState?.isAuthenticated || !authState.user?.id) {
      console.log("Authentication failed. authState:", authState);
      return {
        success: false,
        error: "Authentication required",
        requiresAuth: true,
      };
    }

    console.log("Attempting to create a new permit entry...");
    const permitResult = await createPermitEntry(formData);

    console.log("Permit creation result:", permitResult);

    if (!permitResult.success) {
      return permitResult;
    } // Generate the reference here after a successful permit entry

    const paymentReference = `permit_${permitResult.data.id}_${Date.now()}`; // Payment handling (using auth-state email if needed)

    const paymentData = {
      email: authState.user.email || formData.email,
      amount: formData.amount,
      reference: paymentReference,
      metadata: {
        permit_id: permitResult.data.id,
        user_id: authState.user.id,
        permit_type: formData.permit_type,
      },
    };

    console.log("Initiating payment with data:", paymentData);
    const paymentResult = await initiatePaystackPayment(paymentData);

    console.log("Paystack payment initiation result:", paymentResult);

    if (!paymentResult.success) {
      return paymentResult;
    }

    return {
      success: true,
      data: {
        ...permitResult.data,
        payment_url: paymentResult.authorization_url,
      },
    };
  } catch (error) {
    console.error("Submission error caught in onSubmitPermitForm:", error);
    return {
      success: false,
      error: error.message,
      requiresAuth: error.message.includes("auth"),
    };
  }
};
