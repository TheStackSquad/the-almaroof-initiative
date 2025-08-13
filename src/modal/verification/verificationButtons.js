// src/components/common/verification/VerificationButtons.js

import React from "react";

export default function VerificationButtons({
  onVerify,
  onResend,
  loading,
  resendLoading,
  resendCooldown,
  passcodeCompleted,
}) {
  return (
    <>
      <button
        onClick={onVerify}
        disabled={loading || !passcodeCompleted}
        className={`w-full relative overflow-hidden group bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 hover:from-green-700 hover:to-emerald-700 dark:hover:from-green-600 dark:hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
          loading ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        <span className="relative z-10 flex items-center justify-center">
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Verifying...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Verify Code
            </>
          )}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </button>

      {/* Resend Section */}
      <div className="text-center space-y-4">
        <p
          className="text-sm text-gray-600 dark:text-gray-400"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          Didn&apos;t receive the code?
        </p>

        <button
          onClick={onResend}
          disabled={resendLoading || resendCooldown > 0}
          className={`text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
            resendCooldown > 0 ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          {resendLoading
            ? "Sending..."
            : resendCooldown > 0
            ? `Resend in ${resendCooldown}s`
            : "Resend Code"}
        </button>
      </div>
    </>
  );
}
