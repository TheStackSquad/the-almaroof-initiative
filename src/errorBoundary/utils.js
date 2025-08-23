// src/errorBoundary/utils.js

import { reportError, retryPendingErrors } from "@/errorBoundary/errorLogger";

//Step 1: Initialize error boundary system on app startup
export const initializeErrorBoundaries = () => {
  // Retry any pending errors from previous sessions
  retryPendingErrors();

  // Global unhandled promise rejection handler
  if (typeof window !== "undefined") {
    window.addEventListener("unhandledrejection", (event) => {
      console.error("Unhandled promise rejection:", event.reason);

      reportError(event.reason || new Error("Unhandled promise rejection"), {
        type: "unhandled-promise-rejection",
        promise: event.promise?.toString() || "unknown",
      });
    });

    // Global error handler for non-React errors
    window.addEventListener("error", (event) => {
      console.error("Global error:", event.error);

      reportError(event.error || new Error(event.message), {
        type: "global-error",
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    console.log("✅ Error boundary system initialized");
  }
};

//Step 1: Hook for manually reporting errors in components
export const useErrorReporter = () => {
  const reportComponentError = (
    error,
    componentName,
    additionalContext = {}
  ) => {
    reportError(error, {
      componentName,
      reportedManually: true,
      ...additionalContext,
    });
  };

  return { reportComponentError };
};

//Step 1: Higher-order component to wrap components with error boundaries
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  const WrappedComponent = (props) => {
    const ComponentErrorBoundary = require("@/errorBoundary/componentErrorBoundary").default;

    return (
      <ComponentErrorBoundary
        componentName={Component.displayName || Component.name}
        {...errorBoundaryProps}
      >
        <Component {...props} />
      </ComponentErrorBoundary>
    );
  };

  WrappedComponent.displayName = `withErrorBoundary(${
    Component.displayName || Component.name
  })`;
  return WrappedComponent;
};

//Step 1: Utility to safely execute async operations with error reporting
export const safeAsync = async (asyncFn, context = {}) => {
  try {
    return await asyncFn();
  } catch (error) {
    reportError(error, {
      type: "safe-async-operation",
      ...context,
    });
    throw error; // Re-throw to allow caller to handle
  }
};

//Step 1: Utility to safely execute sync operations with error reporting
export const safeSync = (syncFn, context = {}) => {
  try {
    return syncFn();
  } catch (error) {
    reportError(error, {
      type: "safe-sync-operation",
      ...context,
    });
    throw error; // Re-throw to allow caller to handle
  }
};
