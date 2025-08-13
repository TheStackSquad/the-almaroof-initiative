// /src/app/community/online-services/business-permit/apply/page.js

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { checkSession } from "@/redux/action/authAction";
import PermitForm from "@/components/forms/permitForm";

export default function BusinessPermitApplyPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);

  // Get auth state from Redux
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  // Check authentication on page load
  useEffect(() => {
    const checkAuth = async () => {
      await dispatch(checkSession());
      setInitialCheckComplete(true);
    };

    checkAuth();
  }, [dispatch]);

  // Redirect if not authenticated after check is complete
  useEffect(() => {
    if (initialCheckComplete && !loading && !isAuthenticated) {
      console.log("❌ User not authenticated, redirecting to login");
      router.push(
        "/community/online-services/protected-route?redirect=" +
          encodeURIComponent(
            "/community/online-services/business-permit/apply/"
          )
      );
    }
  }, [initialCheckComplete, loading, isAuthenticated, router]);

  // Show loading while checking authentication
  if (!initialCheckComplete || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
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
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Verifying Access
          </h2>
          <p className="text-gray-600 dark:text-gray-400 font-roboto">
            Checking your authentication status...
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated and check is complete, don't render the form
  // (redirect will happen via useEffect)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-yellow-500">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 font-roboto mb-4">
            Redirecting to sign in...
          </p>
        </div>
      </div>
    );
  }

  // User is authenticated - show the permit form
  return (
    <main className="min-h-screen py-10 px-4 sm:px-8 md:px-16 lg:px-32 bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto mb-8">
        {/* Welcome Message */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
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
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Welcome, {user?.full_name || user?.email || "User"}!
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You&apos;re signed in and ready to apply for your business permit.
              </p>
            </div>
          </div>
        </div>

        {/* Page Title */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Apply for Business Permit
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            Complete your application below
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
            <h3 className="text-xl font-semibold text-white">
              Business Permit Application
            </h3>
            <p className="text-blue-100 text-sm mt-1">
              Please fill out all required fields accurately
            </p>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <PermitForm />
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="max-w-4xl mx-auto mt-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5"
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
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Need Help?
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                If you have questions about your application, our support team
                is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href="#"
                  className="inline-flex items-center text-sm font-medium text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-1"
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
                  Call Support
                </a>
                <a
                  href="#"
                  className="inline-flex items-center text-sm font-medium text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-1"
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
                  Live Chat
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
