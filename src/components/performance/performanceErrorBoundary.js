// components/performance/PerformanceErrorBoundary.jsx
"use client";
import React from "react";
import { track } from "@vercel/analytics";

class PerformanceErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Track performance-related errors
    track("performance_error", {
      error: error.message,
      stack: error.stack?.substring(0, 500), // Limit stack trace length
      componentStack: errorInfo.componentStack?.substring(0, 500),
      timestamp: Date.now(),
      url: typeof window !== "undefined" ? window.location.href : "",
    });

    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              We&apos;ve been notified and are working to fix the issue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default PerformanceErrorBoundary;
