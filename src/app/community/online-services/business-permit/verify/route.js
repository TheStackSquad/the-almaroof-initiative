// src/app/community/online-services/business-permit/verify/page.js
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { showToast } from "@/components/common/toastAlert/toast";

export default function PaymentVerification() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState("verifying");
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const reference = searchParams.get("reference");

    if (!reference) {
      setVerificationStatus("error");
      showToast("Invalid payment reference", "error");
      return;
    }

    verifyPayment(reference);
  }, [searchParams]);

  const verifyPayment = async (reference) => {
    try {
      const response = await fetch(
        `/api/paystack/verify?reference=${reference}`
      );
      const data = await response.json();

      if (response.ok && data.status === "success") {
        setVerificationStatus("success");
        setPaymentData(data.data);
        showToast("Payment verified successfully!", "success");
      } else {
        setVerificationStatus("failed");
        showToast(data.error || "Payment verification failed", "error");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationStatus("error");
      showToast("An error occurred during verification", "error");
    }
  };

  const handleContinue = () => {
    router.push("/community/online-services");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        {verificationStatus === "verifying" && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Verifying Payment
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we confirm your payment...
            </p>
          </>
        )}

        {verificationStatus === "success" && (
          <>
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
                Reference: {paymentData?.reference}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Amount: ₦{paymentData?.amount?.toLocaleString()}
              </p>
            </div>
            <button
              onClick={handleContinue}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Continue to Dashboard
            </button>
          </>
        )}

        {(verificationStatus === "failed" ||
          verificationStatus === "error") && (
          <>
            <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              Payment {verificationStatus === "failed" ? "Failed" : "Error"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {verificationStatus === "failed"
                ? "Your payment could not be processed. Please try again."
                : "An error occurred while verifying your payment. Please contact support."}
            </p>
            <button
              onClick={handleContinue}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Back to Services
            </button>
          </>
        )}
      </div>
    </div>
  );
}
