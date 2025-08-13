// src/components/community/service-pages/ServicePageWrapper.js

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Spinner } from "@nextui-org/react";

export default function ServicePageWrapper({
  children,
  serviceConfig,
  actionConfig,
  serviceId,
  actionId,
}) {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);

  // Handle authentication requirement
  useEffect(() => {
    if (
      !authState.isLoading &&
      actionConfig?.requiresAuth &&
      !authState.isAuthenticated
    ) {
      const currentPath = `/community/online-services/${serviceId}/${actionId}`;
      const encodedRedirect = encodeURIComponent(currentPath);
      router.push(
        `/community/online-services/protected-route?redirect=${encodedRedirect}`
      );
    }
  }, [
    authState.isLoading,
    authState.isAuthenticated,
    actionConfig?.requiresAuth,
    router,
    serviceId,
    actionId,
  ]);

  // Show loading while checking auth
  if (authState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Don't render if auth is required but user is not authenticated
  if (actionConfig?.requiresAuth && !authState.isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            {/* Breadcrumb */}
            <nav className="flex mb-4" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link
                    href="/community"
                    className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                  >
                    Community
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="text-gray-400 mx-2">/</span>
                    <Link
                      href="/community/online-services"
                      className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                    >
                      Online Services
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="text-gray-400 mx-2">/</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {serviceConfig?.displayName}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>

            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {actionConfig?.title}
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {actionConfig?.description}
                </p>
              </div>

              {/* Back Button */}
              <button
                onClick={() => router.back()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>

      {/* Footer Help Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200">
                Need Help?
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Contact our support team for assistance with this service
              </p>
            </div>
            <div className="flex space-x-4">
              <a
                href="tel:+234-803-123-4567"
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                📞 Call Support
              </a>
              <a
                href="mailto:support@oshodi-isolo.gov.ng"
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                ✉️ Email Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}