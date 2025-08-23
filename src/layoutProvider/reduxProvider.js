// src/components/providers/reduxProvider.js
"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { useState, useEffect, Component } from "react";
import store, { persistor } from "@/redux/store/store";
import { AuthInitializer } from "@/layoutProvider/authInitializer";

// Loading component for PersistGate with consistent styling
const PersistLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        Initializing application...
      </p>
    </div>
  </div>
);

// Enhanced error boundary for Redux errors with better error handling
class ReduxErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state to show error UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Redux Provider Error:", error, errorInfo);

    // Send error to monitoring service if available
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
          <div className="text-center p-8 max-w-md">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              Application Error
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Sorry, something went wrong with the application state. Please
              refresh the page to continue.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors w-full"
              >
                Reload Page
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors w-full"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main Redux Provider component with proper SSR handling
export default function ReduxProvider({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure we're on the client side before enabling persistence to prevent hydration mismatch
    setIsClient(true);
  }, []);

  // During SSR, render without PersistGate to avoid hydration issues and localStorage errors
  if (!isClient) {
    return (
      <Provider store={store}>
        <ReduxErrorBoundary>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-600 text-sm">Loading...</p>
            </div>
          </div>
        </ReduxErrorBoundary>
      </Provider>
    );
  }

  // Client-side rendering with full persistence and proper error boundaries
  return (
    <Provider store={store}>
      <PersistGate
        loading={<PersistLoading />}
        persistor={persistor}
        onBeforeLift={() => {
          // Log rehydration start for debugging
          console.log("🔄 Redux store rehydrating...");
        }}
      >
        <AuthInitializer>
          <ReduxErrorBoundary>{children}</ReduxErrorBoundary>
        </AuthInitializer>
      </PersistGate>
    </Provider>
  );
}
