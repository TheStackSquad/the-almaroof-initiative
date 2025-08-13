// src/components/common/VerificationModal.js

"use client";

import React, { useState, useEffect } from "react";
// Import utility functions
import { validatePasscode } from "../../utils/validate/validateAuth";
import {
  verifyTempPasscode,
  sendPasscodeToContact,
} from "../../utils/auth/passcode";
import { createUserSession } from "../../utils/auth/authCore";

// Import the new sub-components
import VerificationCodeInput from "./verification/verificationCodeInput";
import VerificationButtons from "./verificationButtons";
import VerificationContactDisplay from "./verificationContactDisplay";
import AuthErrorDisplay from "./login/authErrorDisplay"; // Reusing the existing error component

export default function VerificationModal({
  recoveryData,
  userData,
  onSuccess,
  onResend,
}) {
  const [passcode, setPasscode] = useState(["", "", "", "", "", ""]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Start resend cooldown on mount or when recoveryData changes
  useEffect(() => {
    setResendCooldown(60); // 60 seconds cooldown
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [recoveryData]);

  const handleVerify = async (fullPasscode) => {
    // If called from a sub-component, it might pass the passcode directly
    const codeToVerify = fullPasscode || passcode.join("");

    const validation = validatePasscode(codeToVerify);
    if (!validation.isValid) {
      setErrors({ passcode: validation.error });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const result = verifyTempPasscode(codeToVerify);

      if (result.success) {
        // Create user session
        const sessionData = {
          username: userData?.username || recoveryData?.username,
          contact: recoveryData?.contact,
          method: recoveryData?.method,
          isVerified: true,
          loginTime: new Date().toISOString(),
          recoveryMethod: recoveryData?.method,
        };

        const session = createUserSession(sessionData);
        onSuccess(session);
      } else {
        setErrors({ passcode: result.error });
        // Clear passcode on error
        setPasscode(["", "", "", "", "", ""]);
      }
    } catch (error) {
      setErrors({ general: "Verification failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setResendLoading(true);
    setErrors({});

    try {
      const result = await sendPasscodeToContact(
        recoveryData.contact,
        recoveryData.method
      );

      if (result.success) {
        // Reset and start cooldown
        setResendCooldown(60);
        setPasscode(["", "", "", "", "", ""]);

        // Update recovery data with new passcode info
        onResend({
          ...recoveryData,
          message: result.message,
          devPasscode: result.passcode, // Only for development
        });
      } else {
        setErrors({
          general: result.message || "Failed to resend code. Please try again.",
        });
      }
    } catch (error) {
      setErrors({
        general: "Failed to resend verification code. Please try again.",
      });
    } finally {
      setResendLoading(false);
    }
  };

  const passcodeCompleted = passcode.every((digit) => digit !== "");

  return (
    <div className="space-y-6">
      {/* Contact Info Display */}
      <VerificationContactDisplay recoveryData={recoveryData} />

      {/* Development Passcode Display */}
      {process.env.NODE_ENV === "development" && recoveryData?.devPasscode && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p
              className="text-sm text-yellow-800 dark:text-yellow-200"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              <strong>Dev Mode:</strong> Your verification code is{" "}
              <span className="font-mono font-bold">
                {recoveryData.devPasscode}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Passcode Input Grid */}
      <VerificationCodeInput
        passcode={passcode}
        setPasscode={setPasscode}
        onVerify={handleVerify}
        disabled={loading || resendLoading}
        error={errors.passcode}
      />

      {/* Verify Button & Resend Button */}
      <VerificationButtons
        onVerify={() => handleVerify()}
        onResend={handleResend}
        loading={loading}
        resendLoading={resendLoading}
        resendCooldown={resendCooldown}
        passcodeCompleted={passcodeCompleted}
      />

      {/* General Error */}
      {errors.general && <AuthErrorDisplay message={errors.general} />}
    </div>
  );
}
