// src/components/common/authLoader.js
import React from "react";

/**
 * A reusable component to display loading or authentication-required messages.
 * @param {{message: string, type: 'loading' | 'unauthenticated'}} props
 */
export default function AuthLoader({ message, type = "loading" }) {
  const isDark =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        {type === "loading" ? (
          <div className="relative mb-8">
            <div className="w-20 h-20 mx-auto">
              <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
              <div
                className="absolute inset-2 border-2 border-transparent border-t-cyan-500 rounded-full animate-spin animate-reverse"
                style={{ animationDuration: "1.5s" }}
              ></div>
            </div>
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
