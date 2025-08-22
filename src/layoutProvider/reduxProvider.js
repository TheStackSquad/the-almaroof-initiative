// src/components/providers/ReduxProvider.js
"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { useState, useEffect, Component } from "react";
import store, { persistor } from "@/redux/store/store";

// Loading component for PersistGate
const PersistLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        Loading application...
      </p>
    </div>
  </div>
);

// Error boundary for Redux errors
class ReduxErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Redux Provider Error:", error, errorInfo);

    // Optionally send error to monitoring service
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "exception", {
        description: `Redux Error: ${error.message}`,
        fatal: false,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 dark:bg-red-900/10">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              Application Error
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Sorry, something went wrong. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main Redux Provider component
export default function ReduxProvider({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure we're on the client side before enabling persistence
    setIsClient(true);
  }, []);

  // During SSR, render without PersistGate to avoid hydration issues
  if (!isClient) {
    return (
      <Provider store={store}>
        <ReduxErrorBoundary>{children}</ReduxErrorBoundary>
      </Provider>
    );
  }

  // Client-side rendering with full persistence
  return (
    <Provider store={store}>
      <PersistGate
        loading={<PersistLoading />}
        persistor={persistor}
        onBeforeLift={() => {
          // Optional: Perform any actions before rehydration
          console.log("Redux store rehydrating...");
        }}
      >
        <ReduxErrorBoundary>{children}</ReduxErrorBoundary>
      </PersistGate>
    </Provider>
  );
}
