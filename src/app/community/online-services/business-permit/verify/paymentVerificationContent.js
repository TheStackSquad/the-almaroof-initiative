// src/app/community/online-services/business-permit/verify/paymentVerificationContent.js
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { showToast } from "@/components/common/toastAlert/toast";
import { usePaymentVerification } from "@/utils/hooks/usePaymentVerification";

// This component contains all the client-side logic and UI.
export default function PaymentVerificationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verificationState, verifyPayment, retryVerification } =
    usePaymentVerification();

  const [mounted, setMounted] = useState(false);
  const reference = searchParams.get("reference");

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Start verification when component mounts
  useEffect(() => {
    if (!mounted || !reference) {
      if (mounted && !reference) {
        showToast("Invalid payment reference. Redirecting...", "error");
        setTimeout(() => router.push("/community/online-services"), 3000);
      }
      return;
    }

    // Validate reference format
    if (typeof reference !== "string" || reference.trim() === "") {
      showToast("Invalid payment reference format", "error");
      setTimeout(() => router.push("/community/online-services"), 3000);
      return;
    }

    verifyPayment(reference);
  }, [mounted, reference, router, verifyPayment]);

  const handleRetry = () => {
    if (reference) {
      retryVerification(reference);
    }
  };

  const handleContinue = () => {
    router.push("/community/online-services");
  };

  const handleContactSupport = () => {
    // You can customize this based on your support system
    const supportEmail = "support@yourcompany.com";
    const subject = encodeURIComponent(
      `Payment Verification Issue - Reference: ${reference}`
    );
    const body = encodeURIComponent(
      `Hello,\n\nI'm experiencing issues with payment verification for reference: ${reference}\n\nPlease assist me with this matter.`
    );

    window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
  };

  // Loading state before mounting
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const { status, data, error, retryCount } = verificationState;
  const maxRetries = 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        {/* Verifying State */}
        {status === "verifying" && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Verifying Payment
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Please wait while we confirm your payment...
            </p>
            {retryCount > 0 && (
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Retry attempt {retryCount} of {maxRetries}
              </p>
            )}
          </>
        )}

        {/* Success State */}
        {status === "success" && (
          <>
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">
              Payment Successful!
            </h2>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Reference:</span>{" "}
                {data?.reference}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Amount:</span> ₦
                {data?.amount?.toLocaleString()}
              </p>
              {data?.permit_id && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Permit ID:</span>{" "}
                  {data.permit_id}
                </p>
              )}
            </div>
            <button
              onClick={handleContinue}
              className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none"
            >
              Continue to Dashboard
            </button>
          </>
        )}

        {/* Failed State */}
        {status === "failed" && (
          <>
            <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              Payment Failed
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error ||
                "Your payment could not be processed. Please try again."}
            </p>
            <div className="space-y-3">
              {retryCount < maxRetries && (
                <button
                  onClick={handleRetry}
                  className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none"
                >
                  Retry Verification ({maxRetries - retryCount} attempts left)
                </button>
              )}
              <button
                onClick={handleContinue}
                className="w-full bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none"
              >
                Back to Services
              </button>
            </div>
          </>
        )}

        {/* Error State */}
        {status === "error" && (
          <>
            <div className="w-20 h-20 mx-auto mb-6 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-orange-600 dark:text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">
              Verification Error
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error ||
                "An error occurred while verifying your payment. Please contact support if the issue persists."}
            </p>
            <div className="space-y-3">
              {retryCount < maxRetries && (
                <button
                  onClick={handleRetry}
                  className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none"
                >
                  Try Again ({maxRetries - retryCount} attempts left)
                </button>
              )}
              <button
                onClick={handleContactSupport}
                className="w-full bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none"
              >
                Contact Support
              </button>
              <button
                onClick={handleContinue}
                className="w-full bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none"
              >
                Back to Services
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
