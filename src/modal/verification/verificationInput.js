// src/components/common/verification/VerificationCodeInput.js

import React, { useRef, useEffect } from "react";

export default function VerificationCodeInput({
  passcode,
  setPasscode,
  onVerify,
  disabled,
  error,
}) {
  const inputRefs = useRef([]);

  // Auto-focus the first input on load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (index, value) => {
    // Only allow digits
    const digit = value.replace(/\D/g, "").slice(-1);

    const newPasscode = [...passcode];
    newPasscode[index] = digit;
    setPasscode(newPasscode);

    // Auto-advance to the next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Automatically trigger verification on the last digit
    if (index === 5 && digit) {
      onVerify(newPasscode.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !passcode[index] && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }

    // Handle paste
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, "").slice(0, 6);
        const newPasscode = [...passcode];

        for (let i = 0; i < digits.length && i < 6; i++) {
          newPasscode[i] = digits[i];
        }

        setPasscode(newPasscode);

        // Focus the appropriate input
        const nextIndex = Math.min(digits.length, 5);
        inputRefs.current[nextIndex]?.focus();

        if (digits.length === 6) {
          onVerify(digits);
        }
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3
        className="text-lg font-semibold text-gray-900 dark:text-white text-center"
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        Enter Verification Code
      </h3>

      <div className="flex justify-center gap-3">
        {passcode.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            disabled={disabled}
            className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-lg transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed ${
              error
                ? "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400"
                : "border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
            }`}
            style={{ fontFamily: "Roboto, monospace" }}
          />
        ))}
      </div>

      {error && (
        <p
          className="text-red-500 dark:text-red-400 text-sm text-center flex items-center justify-center"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
