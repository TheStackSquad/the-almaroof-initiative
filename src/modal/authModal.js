// src/components/common/authModal.js

"use client";

import React, { useState, useEffect } from "react";
import LoginForm from "../components/common/login/loginForm";
import RecoveryModal from "./recoveryModal";
import VerificationModal from "./verification/verificationModal";

const MODAL_STATES = {
  LOGIN: "login",
  RECOVERY: "recovery",
  VERIFICATION: "verification",
  SUCCESS: "success",
};

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  intendedDestination = null,
  title = "Authentication Required",
}) {
  const [currentState, setCurrentState] = useState(MODAL_STATES.LOGIN);
  const [userData, setUserData] = useState(null);
  const [recoveryData, setRecoveryData] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentState(MODAL_STATES.LOGIN);
      setUserData(null);
      setRecoveryData(null);
    }
  }, [isOpen]);

  // Handle modal close with animation
  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onClose();
      setIsAnimating(false);
    }, 200);
  };

  // Handle successful authentication
  const handleAuthSuccess = (user) => {
    setUserData(user);
    setCurrentState(MODAL_STATES.SUCCESS);

    // Auto-close and redirect after success animation
    setTimeout(() => {
      onSuccess(user, intendedDestination);
      handleClose();
    }, 1500);
  };

  // Handle transition to recovery flow
  const handleForgotPasscode = (initialData) => {
    setUserData(initialData);
    setCurrentState(MODAL_STATES.RECOVERY);
  };

  // Handle recovery submission
  const handleRecoverySubmit = (data) => {
    setRecoveryData(data);
    setCurrentState(MODAL_STATES.VERIFICATION);
  };

  // Handle verification success
  const handleVerificationSuccess = (user) => {
    handleAuthSuccess(user);
  };

  // Handle back navigation
  const handleBack = () => {
    switch (currentState) {
      case MODAL_STATES.RECOVERY:
        setCurrentState(MODAL_STATES.LOGIN);
        break;
      case MODAL_STATES.VERIFICATION:
        setCurrentState(MODAL_STATES.RECOVERY);
        break;
      default:
        setCurrentState(MODAL_STATES.LOGIN);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative w-full max-w-md transform transition-all duration-300 ${
            isAnimating
              ? "scale-95 opacity-0 translate-y-4"
              : "scale-100 opacity-100 translate-y-0"
          }`}
        >
          {/* Modal Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-indigo-500 dark:to-cyan-500 p-6 text-center">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors duration-200 p-1 rounded-full hover:bg-white/20"
              >
                <svg
                  className="w-6 h-6"
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
              </button>

              {/* Back Button (show only for recovery/verification states) */}
              {(currentState === MODAL_STATES.RECOVERY ||
                currentState === MODAL_STATES.VERIFICATION) && (
                <button
                  onClick={handleBack}
                  className="absolute top-4 left-4 text-white/80 hover:text-white transition-colors duration-200 p-1 rounded-full hover:bg-white/20"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                </button>
              )}

              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                {currentState === MODAL_STATES.SUCCESS ? (
                  <svg
                    className="w-8 h-8 text-white"
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
                ) : currentState === MODAL_STATES.VERIFICATION ? (
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                ) : currentState === MODAL_STATES.RECOVERY ? (
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
              </div>

              {/* Title */}
              <h2
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {currentState === MODAL_STATES.SUCCESS
                  ? "Welcome!"
                  : currentState === MODAL_STATES.VERIFICATION
                  ? "Enter Verification Code"
                  : currentState === MODAL_STATES.RECOVERY
                  ? "Account Recovery"
                  : title}
              </h2>

              {/* Subtitle */}
              <p
                className="text-white/80 mt-2"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {currentState === MODAL_STATES.SUCCESS
                  ? "Authentication successful"
                  : currentState === MODAL_STATES.VERIFICATION
                  ? "Check your phone or email for the code"
                  : currentState === MODAL_STATES.RECOVERY
                  ? "Recover your account access"
                  : "Please sign in to continue"}
              </p>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Render appropriate component based on current state */}
              {currentState === MODAL_STATES.LOGIN && (
                <LoginForm
                  onSuccess={handleAuthSuccess}
                  onForgotPasscode={handleForgotPasscode}
                  intendedDestination={intendedDestination}
                />
              )}

              {currentState === MODAL_STATES.RECOVERY && (
                <RecoveryModal
                  userData={userData}
                  onSubmit={handleRecoverySubmit}
                  onCancel={handleBack}
                />
              )}

              {currentState === MODAL_STATES.VERIFICATION && (
                <VerificationModal
                  recoveryData={recoveryData}
                  userData={userData}
                  onSuccess={handleVerificationSuccess}
                  onResend={handleRecoverySubmit}
                />
              )}

              {currentState === MODAL_STATES.SUCCESS && (
                <div className="text-center py-8">
                  {/* Success Animation */}
                  <div className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>

                  <h3
                    className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    You&apos;re all set!
                  </h3>
                  <p
                    className="text-gray-600 dark:text-gray-400"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    Redirecting you to the service...
                  </p>

                  {/* Loading indicator */}
                  <div className="mt-6">
                    <div className="w-8 h-8 mx-auto border-2 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Progress Indicator */}
            {currentState !== MODAL_STATES.SUCCESS && (
              <div className="px-6 pb-4">
                <div className="flex items-center justify-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                      currentState === MODAL_STATES.LOGIN
                        ? "bg-indigo-600 dark:bg-indigo-400"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                  <div
                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                      currentState === MODAL_STATES.RECOVERY
                        ? "bg-indigo-600 dark:bg-indigo-400"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                  <div
                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                      currentState === MODAL_STATES.VERIFICATION
                        ? "bg-indigo-600 dark:bg-indigo-400"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
