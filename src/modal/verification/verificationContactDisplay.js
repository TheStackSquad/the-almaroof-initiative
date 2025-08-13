// src/components/common/verification/VerificationContactDisplay.js

import React from "react";
import { formatPhoneNumber } from "../../../utils/auth/utils";

export default function VerificationContactDisplay({ recoveryData }) {
  return (
    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
      <div className="flex items-center">
        {recoveryData?.method === "phone" ? (
          <svg
            className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
            />
          </svg>
        )}
        <div>
          <p
            className="text-sm text-indigo-800 dark:text-indigo-200"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            Code sent to{" "}
            <span className="font-semibold">
              {recoveryData?.method === "phone"
                ? formatPhoneNumber(recoveryData.contact)
                : recoveryData?.contact}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
