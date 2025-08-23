// src/errorBoundary/globalErrorBoundary.js
"use client";

import React from "react";
import { logErrorToServer } from "@/errorBoundary/errorLogger";

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  //Step 1: Global error catching - catches any unhandled errors in the entire app
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  //Step 1: Enhanced error logging for production debugging
  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to server for production monitoring
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      url: typeof window !== "undefined" ? window.location.href : "unknown",
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
      timestamp: new Date().toISOString(),
      errorBoundary: "GlobalErrorBoundary",
    };

    logErrorToServer(errorDetails);

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Global Error Boundary caught an error:", error, errorInfo);
    }
  }

  //Step 1: User-friendly error UI instead of blank page
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We&apos;re sorry for the inconvenience. The error has been logged and
              our team will look into it.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Refresh Page
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Go to Homepage
              </button>
            </div>

            {/* Show error details in development */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mt-6 text-left">
                <details className="text-sm">
                  <summary className="cursor-pointer font-medium text-red-600">
                    Error Details (Development)
                  </summary>
                  <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-red-800 dark:text-red-200 font-mono text-xs overflow-auto">
                    <p>
                      <strong>Message:</strong> {this.state.error.message}
                    </p>
                    <p>
                      <strong>Stack:</strong>
                    </p>
                    <pre>{this.state.error.stack}</pre>
                  </div>
                </details>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
export default GlobalErrorBoundary;