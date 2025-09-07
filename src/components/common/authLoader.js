// src/components/common/authLoader.js
import React from "react";
import LoadingSpinner from "@/components/common/loadingSpinner";

export default function AuthLoader({ message, type = "loading" }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        {type === "loading" ? (
          // Use the LoadingSpinner component here
          <div className="relative mb-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="w-16 h-16 mx-auto mb-4 text-yellow-500">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {message}
        </h2>
        {type === "unauthenticated" && (
          <p className="text-gray-600 dark:text-gray-400 font-roboto mb-4">
            Redirecting to sign in...
          </p>
        )}
      </div>
    </div>
  );
}
