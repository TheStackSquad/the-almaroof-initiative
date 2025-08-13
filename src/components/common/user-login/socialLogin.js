// src/components/common/user-login/SocialLogin.js

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/common/toastAlert/toast";

const SocialLogin = ({ redirectUrl }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    showToast("Connecting to Google...", "info");

    try {
      // TODO: Implement Google OAuth logic here
      // This will be implemented when we create the backend routes

      // Placeholder for Google OAuth flow
      console.log("Initiating Google OAuth with redirect URL:", redirectUrl);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For now, show a message that this will be implemented
      showToast(
        "Google Sign-In will be implemented with backend routes",
        "info"
      );
    } catch (error) {
      console.error("Google sign-in error:", error);
      showToast("Google sign-in failed. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Google Sign-In Button */}
      <button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-sm hover:shadow-md flex items-center justify-center space-x-3 group`}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
        ) : (
          <>
            {/* Google Icon */}
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span className="font-medium font-roboto text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
              Continue with Google
            </span>
          </>
        )}
      </button>

      {/* Additional Social Providers (Future) */}
      {/* You can add more social login buttons here */}

      {/* Info Text */}
      <p className="text-xs text-center text-gray-500 dark:text-gray-400 font-roboto">
        Quick and secure access with your Google account
      </p>
    </div>
  );
};

export default SocialLogin;
