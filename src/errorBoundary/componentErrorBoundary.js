// src/errorBoundary/ComponentErrorBoundary.js
"use client";

import React from "react";
import { logErrorToServer } from "@/errorBoundary/errorLogger";

class ComponentErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, retryCount: 0 };
  }

  //Step 1: Component-level error catching - protects critical components
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  //Step 1: Component-specific error logging with detailed context
  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Detailed component error logging
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      componentName: this.props.componentName || "unknown-component",
      componentProps: this.props.logProps
        ? JSON.stringify(this.props.children?.props || {})
        : "not-logged",
      url: typeof window !== "undefined" ? window.location.href : "unknown",
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
      timestamp: new Date().toISOString(),
      errorBoundary: "ComponentErrorBoundary",
      retryCount: this.state.retryCount,
    };

    logErrorToServer(errorDetails);

    if (process.env.NODE_ENV === "development") {
      console.error(
        `Component Error Boundary (${this.props.componentName}) caught an error:`,
        error,
        errorInfo
      );
    }
  }

  //Step 1: Component retry mechanism with fallback
  handleRetry = () => {
    this.setState((prevState) => ({
      hasError: false,
      error: null,
      retryCount: prevState.retryCount + 1,
    }));
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback from props
      if (this.props.fallback) {
        return typeof this.props.fallback === "function"
          ? this.props.fallback(this.state.error, this.handleRetry)
          : this.props.fallback;
      }

      // Minimal fallback for small components
      if (this.props.minimal) {
        return (
          <div className="inline-flex items-center px-3 py-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-300 rounded-md">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Component Error
            {this.state.retryCount < 3 && (
              <button
                onClick={this.handleRetry}
                className="ml-2 text-xs underline hover:no-underline"
              >
                Retry
              </button>
            )}
          </div>
        );
      }

      // Standard component fallback
      return (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                {this.props.componentName || "Component"} Error
              </h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                {this.props.errorMessage ||
                  "This component encountered an error and couldn't render properly."}
              </p>
              {this.state.retryCount < 3 && (
                <div className="mt-2">
                  <button
                    onClick={this.handleRetry}
                    className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300"
                  >
                    Try again
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Development details */}
          {process.env.NODE_ENV === "development" && this.state.error && (
            <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800">
              <details className="text-xs">
                <summary className="cursor-pointer font-medium text-red-700 dark:text-red-300">
                  Component Error Details
                </summary>
                <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/40 rounded text-red-800 dark:text-red-200 font-mono">
                  <p>
                    <strong>Component:</strong> {this.props.componentName}
                  </p>
                  <p>
                    <strong>Error:</strong> {this.state.error.message}
                  </p>
                  <p>
                    <strong>Retry Count:</strong> {this.state.retryCount}
                  </p>
                </div>
              </details>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ComponentErrorBoundary;
