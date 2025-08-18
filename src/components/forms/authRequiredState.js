// src/components/forms/authRequiredState.js
import React, { memo } from "react";

/**
 * A component to display a state requiring user authentication.
 * It shows a stylized message and a button to trigger a sign-in action.
 *
 * @param {object} props - The component props.
 * @param {function} props.onSignIn - Function to call when the sign-in button is clicked.
 * @param {string} props.title - Optional title for the authentication required message.
 * @param {string} props.message - Optional message explaining why sign-in is needed.
 */
const AuthRequiredState = memo(({ onSignIn, title, message }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header Section with Icon and Title */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-white"
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
          </div>

          {/* Title and Subtitle */}
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            {title || "Sign In Required"}
          </h2>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            Authentication needed to continue
          </p>

          {/* Security badges */}
          <div className="flex items-center justify-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
            <div className="flex items-center space-x-1 text-xs text-blue-100/70">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Secure</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-blue-100/70">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 8a6 6 0 01-7.743 5.743L10 14l-4 4-4-4 4-4 .257-.257A6 6 0 1118 8zm-6-2a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Private</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-blue-100/70">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Verified</span>
            </div>
          </div>
        </div>

        {/* Content Section with Message and Buttons */}
        <div className="p-6 sm:p-8 text-center space-y-6">
          <div className="space-y-3">
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
              {message ||
                "You need to be signed in to submit a permit application."}
            </p>

            <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <div className="w-8 h-px bg-gray-300 dark:bg-gray-600"></div>
              <span>Secure Access</span>
              <div className="w-8 h-px bg-gray-300 dark:bg-gray-600"></div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onSignIn}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center justify-center space-x-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                <span>Sign In to Continue</span>
              </span>
            </button>

            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p>Don&apos;t have an account?</p>
              <button
                onClick={() => window.open("/auth/signup", "_self")}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Create one here →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

AuthRequiredState.displayName = "AuthRequiredState";

export default AuthRequiredState;
