// src/hooks/usePaymentVerification.js
"use client";

import { useState, useCallback } from "react";
import { showToast } from "@/components/common/toastAlert/toast";

export function usePaymentVerification() {
  const [verificationState, setVerificationState] = useState({
    status: "verifying", // verifying | success | failed | error
    data: null,
    error: null,
    retryCount: 0,
  });

  const verifyPayment = useCallback(
    async (reference, isRetry = false) => {
      // If not a retry, reset the state to 'verifying'
      if (!isRetry) {
        setVerificationState((prev) => ({
          ...prev,
          status: "verifying",
          error: null,
        }));
      }

      try {
        const controller = new AbortController();
        // Set a 30-second timeout for the fetch request.
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch(
          `/api/paystack/verify?reference=${encodeURIComponent(reference)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            signal: controller.signal,
          }
        );

        // Clear the timeout after the fetch call completes.
        clearTimeout(timeoutId);

        const data = await response.json();

        if (response.ok && data.status === "success") {
          setVerificationState({
            status: "success",
            data: data.data,
            error: null,
            retryCount: 0,
          });
          showToast("Payment verified successfully!", "success");
          return { success: true, data: data.data };
        } else {
          const errorMessage = data.message || "Payment verification failed";
          setVerificationState((prev) => ({
            status: "failed",
            data: null,
            error: errorMessage,
            retryCount: prev.retryCount,
          }));
          showToast(errorMessage, "error");
          return { success: false, error: errorMessage };
        }
      } catch (error) {
        const isAbortError = error.name === "AbortError";
        const errorMessage = isAbortError
          ? "Verification timed out. Please try again."
          : "Network error occurred during verification";

        console.error("Verification error:", error);

        setVerificationState((prev) => ({
          status: "error",
          data: null,
          error: errorMessage,
          retryCount: prev.retryCount + (isRetry ? 1 : 0),
        }));

        showToast(errorMessage, "error");
        return { success: false, error: errorMessage };
      }
    },
    [] 
  );

  const retryVerification = async (reference) => {
    const maxRetries = 3;
    const currentRetry = verificationState.retryCount;

    if (currentRetry >= maxRetries) {
      showToast(
        "Maximum retry attempts reached. Please contact support.",
        "error"
      );
      return;
    }

    setVerificationState((prev) => ({
      ...prev,
      retryCount: prev.retryCount + 1,
    }));

    // Add exponential backoff delay
    const delay = Math.min(1000 * Math.pow(2, currentRetry), 5000);
    await new Promise((resolve) => setTimeout(resolve, delay));

    return verifyPayment(reference, true);
  };

  return { verificationState, verifyPayment, retryVerification };
}
