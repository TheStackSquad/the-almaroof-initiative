// src/utils/handlers/onSubmitPermitForm.js
import { createPermitEntry } from "@/utils/supabase/createPermit";
import { initiatePaystackPayment } from "./paystackHandler";
import { PERMIT_STATUS } from "@/components/common/permitStatus";

const isDevelopment = process.env.NODE_ENV === "development";

// Retry configuration
const MAX_PAYMENT_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

// Idempotency key storage (in-memory for now, consider Redis in production)
const processedIdempotencyKeys = new Set();

/**
 * Industry-standard form submission handler with production resilience
 */
export const onSubmitPermitForm = async (formData, authState) => {
  // Generate unique idempotency key
  const idempotencyKey = `submit_${authState.user.id}_${formData.permit_type}_${
    formData.application_type
  }_${Date.now()}`;

  // Check for duplicate submission
  if (processedIdempotencyKeys.has(idempotencyKey)) {
    if (isDevelopment) {
      console.log("⏭️ Duplicate submission detected, skipping processing");
    }
    return {
      success: false,
      error: "Duplicate submission detected",
      isDuplicate: true,
      retryable: false,
    };
  }

  // Add to processed keys (with timeout for memory cleanup)
  processedIdempotencyKeys.add(idempotencyKey);
  setTimeout(() => processedIdempotencyKeys.delete(idempotencyKey), 30000);

  try {
    if (isDevelopment) {
      console.log("🚀 SUBMISSION STARTED", {
        idempotencyKey,
        formData: {
          ...formData,
          formattedAmount: `${formData.amount} kobo (₦${(
            formData.amount / 100
          ).toFixed(2)})`,
        },
      });
    }

    // Validate authentication
    if (!authState?.isAuthenticated || !authState.user?.id) {
      if (isDevelopment) console.log("❌ Authentication failed");
      return {
        success: false,
        error: "Authentication required",
        requiresAuth: true,
        retryable: false,
      };
    }

    // Create permit entry with idempotency protection
    if (isDevelopment) console.log("📋 Creating permit entry...");
    const permitResult = await createPermitEntry({
      ...formData,
      idempotencyKey, // Pass idempotency key to backend
    });

    if (!permitResult.success) {
      if (isDevelopment)
        console.log("❌ Permit creation failed:", permitResult);

      // Handle duplicate submission from backend
      if (permitResult.isDuplicate) {
        return {
          success: false,
          error: "Application already submitted",
          isDuplicate: true,
          retryable: false,
          existingPermitId: permitResult.existingPermitId,
        };
      }

      return {
        ...permitResult,
        retryable: false, // Permit creation failures are not retryable
      };
    }

    if (isDevelopment) {
      console.log("✅ Permit created successfully:", permitResult.data);
    }

    // Handle different permit statuses from creation
    switch (permitResult.data.status) {
      case PERMIT_STATUS.PAID:
        // Permit already paid (edge case from duplicate submission)
        return {
          success: true,
          data: {
            ...permitResult.data,
            alreadyPaid: true,
            message: "Payment already completed",
          },
        };

      case PERMIT_STATUS.EXPIRED:
        // Permit expired, need to create new one
        return {
          success: false,
          error: "Application expired, please submit again",
          retryable: true,
          shouldCreateNew: true,
        };

      case PERMIT_STATUS.PAYMENT_FAILED:
        // Previous payment failed, can retry
        if (permitResult.data.payment_attempts >= 3) {
          return {
            success: false,
            error: "Maximum payment attempts reached. Please contact support.",
            retryable: false,
            maxAttemptsReached: true,
          };
        }
        break;

      case PERMIT_STATUS.PENDING_PAYMENT:
        // Normal flow, proceed to payment
        break;

      default:
        // Unknown status, don't proceed
        return {
          success: false,
          error: `Unexpected permit status: ${permitResult.data.status}`,
          retryable: false,
        };
    }

    // Prepare payment data with retry logic
    const paymentReference = `permit_${permitResult.data.id}_${Date.now()}`;
    const paymentData = {
      email: authState.user.email || formData.email,
      amount: formData.amount,
      reference: paymentReference,
      permit_id: permitResult.data.id,
      metadata: {
        permit_id: permitResult.data.id,
        user_id: authState.user.id,
        permit_type: formData.permit_type,
      },
    };

    if (isDevelopment) {
      console.log("💳 Initiating payment with data:", {
        ...paymentData,
        amount: `${paymentData.amount} kobo (₦${(
          paymentData.amount / 100
        ).toFixed(2)})`,
      });
    }

    // Initiate payment with retry mechanism
    let paymentResult;
    let attempt = 0;

    while (attempt <= MAX_PAYMENT_RETRIES) {
      try {
        attempt++;
        if (isDevelopment && attempt > 1) {
          console.log(
            `🔄 Payment retry attempt ${attempt}/${MAX_PAYMENT_RETRIES}`
          );
        }

        paymentResult = await initiatePaystackPayment(paymentData);

        if (paymentResult.success) {
          break; // Success, exit retry loop
        }

        // Check if retry is appropriate
        if (attempt >= MAX_PAYMENT_RETRIES || !paymentResult.retryable) {
          if (isDevelopment) {
            console.log(
              "❌ Payment failed after all retry attempts:",
              paymentResult
            );
          }
          break;
        }

        // Wait before retrying
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAY_MS * attempt)
        );
      } catch (retryError) {
        if (attempt >= MAX_PAYMENT_RETRIES) {
          paymentResult = {
            success: false,
            error: retryError.message,
            retryable: false,
          };
          break;
        }
      }
    }

    if (!paymentResult.success) {
      if (isDevelopment) {
        console.log(
          "❌ Payment initiation failed after retries:",
          paymentResult
        );
      }

      // Classify error type for UI handling
      const isNetworkError =
        paymentResult.error?.includes("network") ||
        paymentResult.error?.includes("timeout");
      const isPaymentServiceError =
        paymentResult.error?.includes("Paystack") ||
        paymentResult.error?.includes("payment");

      return {
        ...paymentResult,
        retryable: isNetworkError || isPaymentServiceError,
        errorType: isNetworkError
          ? "network"
          : isPaymentServiceError
          ? "payment_service"
          : "unknown",
      };
    }

    if (isDevelopment) {
      console.log("✅ Payment initiated successfully:", paymentResult);
      console.log("🔗 Authorization URL:", paymentResult.authorization_url);
    }

    return {
      success: true,
      data: {
        ...permitResult.data,
        payment_url: paymentResult.authorization_url,
        status: PERMIT_STATUS.PAYMENT_PROCESSING,
        reference: paymentReference,
      },
      retryable: false,
    };
  } catch (error) {
    if (isDevelopment) {
      console.error("💥 Unexpected submission error:", error);
    }

    // Classify unexpected errors
    const isNetworkError =
      error.message?.includes("network") || error.message?.includes("fetch");
    const isTimeoutError = error.message?.includes("timeout");

    return {
      success: false,
      error: error.message || "An unexpected error occurred",
      retryable: isNetworkError || isTimeoutError,
      isUnexpected: true,
      errorType: isNetworkError
        ? "network"
        : isTimeoutError
        ? "timeout"
        : "unknown",
    };
  } finally {
    // Clean up idempotency key
    processedIdempotencyKeys.delete(idempotencyKey);
  }
};

/**
 * Helper function for retrying failed payments
 */
export const retryPaymentSubmission = async (permitId, formData, authState) => {
  if (isDevelopment) {
    console.log("🔄 Retrying payment for permit:", permitId);
  }

  try {
    const paymentReference = `retry_${permitId}_${Date.now()}`;
    const paymentData = {
      email: authState.user.email || formData.email,
      amount: formData.amount,
      reference: paymentReference,
      permit_id: permitId,
      metadata: {
        permit_id: permitId,
        user_id: authState.user.id,
        permit_type: formData.permit_type,
      },
    };

    const paymentResult = await initiatePaystackPayment(paymentData);

    return {
      ...paymentResult,
      isRetry: true,
      permitId: permitId,
    };
  } catch (error) {
    if (isDevelopment) {
      console.error("💥 Retry payment error:", error);
    }
    return {
      success: false,
      error: error.message,
      isRetry: true,
      retryable: true, // Retries can usually be retried again
    };
  }
};
