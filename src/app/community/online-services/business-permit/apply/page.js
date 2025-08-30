// src/app/community/online-services/business-permit/apply/page.js
"use client";

import React from "react";
import { useAuth } from "@/utils/auth/useAuth";
import PermitForm from "@/components/forms/permitForm";
import AuthLoader from "@/components/common/authLoader";
import { LogoutDropdownItem } from "@/components/common/buttons/logoutButton";

export default function BusinessPermitApplyPage() {
  // Step 1: Replace useAuthRedirect with the more robust useAuth hook
  const { isLoading, isSecurelyAuthenticated, user, requireAuth } = useAuth();

  // Step 2: Use requireAuth to handle the redirect logic declaratively
  const authStatus = requireAuth({
    redirectTo: "/community/online-services/protected-route",
    returnUrl: true,
  });

  // Step 3: Handle the loading state while the authentication check is in progress
  if (isLoading) {
    return <AuthLoader message="Verifying Access" type="loading" />;
  }

  // Step 4: If the user is not securely authenticated, display an unauthenticated message
  // Note: The requireAuth hook handles the actual redirection, so this component only needs to manage its UI state
  if (!isSecurelyAuthenticated) {
    return (
      <AuthLoader message="Authentication Required" type="unauthenticated" />
    );
  }

  // Step 5: If securely authenticated, render the main page content
  return (
    <main className="min-h-screen py-10 px-4 sm:px-8 bg-gray-50 dark:bg-gray-900 font-roboto">
      <div className="max-w-7xl mx-auto space-y-8 lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Left Side: Page Title, User Info, and Help Sections */}
        <div className="lg:col-span-1 space-y-6">
          {/* Page Title & Description */}
          <div className="text-left mt-10 mb-10">
            <LogoutDropdownItem />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-montserrat text-gray-900 dark:text-gray-100 mb-2 leading-tight">
              Apply for Business Permit
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">
              Complete your application below.
            </p>
            <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
          </div>

          {/* Welcome/User Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-blue-500 dark:border-cyan-500 transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-grow min-w-0">
                <h2 className="text-lg sm:text-xl font-semibold font-montserrat text-gray-900 dark:text-gray-100 truncate">
                  Welcome, {user?.username || user?.email || "User"}!
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  You&apos;re signed in and ready to get started.
                </p>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border-l-4 border-blue-500 dark:border-blue-800 p-4 sm:p-6 shadow-md transition-all duration-300">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium font-montserrat text-blue-900 dark:text-blue-100 mb-1 text-sm sm:text-base">
                  Need Help?
                </h4>
                <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200 mb-3 sm:mb-4 leading-relaxed">
                  If you have questions about your application, our support team
                  is here to help.
                </p>
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:gap-2">
                  <a
                    href="#"
                    className="inline-flex items-center justify-center text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition-colors py-2 px-3 sm:py-0 sm:px-0 rounded-md bg-blue-100 dark:bg-blue-800/30 sm:bg-transparent"
                  >
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span className="truncate">Call Support</span>
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center justify-center text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition-colors py-2 px-3 sm:py-0 sm:px-0 rounded-md bg-blue-100 dark:bg-blue-800/30 sm:bg-transparent"
                  >
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span className="truncate">Live Chat</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Main Application Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-4 sm:px-6 py-3 sm:py-4 text-left rounded-t-xl">
              <h3 className="text-lg sm:text-xl font-semibold font-montserrat text-white leading-tight">
                Business Permit Application
              </h3>
              <p className="text-blue-100 text-xs sm:text-sm mt-1 font-roboto leading-relaxed">
                Please fill out all required fields accurately.
              </p>
            </div>
            <div className="pt-6 sm:pt-8">
              <PermitForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
