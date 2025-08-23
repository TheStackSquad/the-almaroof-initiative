// src/errorBoundary/RouteErrorBoundary.js
"use client";

import React from "react";
import { logErrorToServer } from "@/errorBoundary/errorLogger";

class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  //Step 1: Route-level error catching - more specific error handling per route
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  //Step 1: Route-specific error logging with context
  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Enhanced logging with route context
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      route: this.props.routeName || "unknown-route",
      url: typeof window !== "undefined" ? window.location.href : "unknown",
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
      timestamp: new Date().toISOString(),
      errorBoundary: "RouteErrorBoundary",
      routeContext: this.props.context || {},
    };

    logErrorToServer(errorDetails);

    if (process.env.NODE_ENV === "development") {
      console.error(
        `Route Error Boundary (${this.props.routeName}) caught an error:`,
        error,
        errorInfo
      );
    }
  }

  //Step 1: Route-specific fallback UI
  render() {
    if (this.state.hasError) {
      // Allow custom fallback UI from props
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center p-6 m-4">
          <div className="text-center max-w-sm">
            <div className="mb-4">
              <svg
                className="mx-auto h-10 w-10 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {this.props.title || "Page Error"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
              {this.props.message ||
                "This section couldn't load properly. Please try again."}
            </p>
            <div className="space-y-2">
              <button
                onClick={() => this.setState({ hasError: false })}
                className="w-full px-4 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
              >
                Try Again
              </button>
              {this.props.redirectPath && (
                <button
                  onClick={() =>
                    (window.location.href = this.props.redirectPath)
                  }
                  className="w-full px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  {this.props.redirectLabel || "Go Back"}
                </button>
              )}
            </div>

            {/* Development error details */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mt-4 text-left">
                <details className="text-xs">
                  <summary className="cursor-pointer font-medium text-orange-600">
                    Route Error Details
                  </summary>
                  <div className="mt-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-orange-800 dark:text-orange-200 font-mono overflow-auto">
                    <p>
                      <strong>Route:</strong> {this.props.routeName}
                    </p>
                    <p>
                      <strong>Error:</strong> {this.state.error.message}
                    </p>
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

export default RouteErrorBoundary;
