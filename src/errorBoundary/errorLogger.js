// src/errorBoundary/errorLogger.js

//Step 1: Server-side error logging service for production monitoring
export const logErrorToServer = async (errorDetails) => {
  try {
    // Don't log errors in development to avoid spam
    if (process.env.NODE_ENV === "development") {
      console.log("📝 Error logged (development):", errorDetails);
      return;
    }

    // Send error to your API endpoint
    const response = await fetch("/api/errors/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...errorDetails,
        // Add additional metadata
        environment: process.env.NODE_ENV,
        appVersion: process.env.NEXT_PUBLIC_APP_VERSION || "unknown",
        userId: getUserId(), // Helper to get current user ID if available
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to log error: ${response.status}`);
    }

    console.log("✅ Error logged to server successfully");
  } catch (loggingError) {
    // Fallback: log to console if server logging fails
    console.error("❌ Failed to log error to server:", loggingError);
    console.error("Original error details:", errorDetails);

    // Store in localStorage as backup for later retry
    try {
      const existingErrors = JSON.parse(
        localStorage.getItem("pendingErrors") || "[]"
      );
      existingErrors.push({
        ...errorDetails,
        logAttemptFailed: true,
        logFailureReason: loggingError.message,
      });

      // Keep only last 10 errors to prevent storage bloat
      if (existingErrors.length > 10) {
        existingErrors.splice(0, existingErrors.length - 10);
      }

      localStorage.setItem("pendingErrors", JSON.stringify(existingErrors));
    } catch (storageError) {
      console.error("Failed to store error in localStorage:", storageError);
    }
  }
};

//Step 1: Helper to get current user ID from Redux store or localStorage
const getUserId = () => {
  try {
    // Try to get from Redux store if available
    if (typeof window !== "undefined" && window.__REDUX_STORE__) {
      const state = window.__REDUX_STORE__.getState();
      return state.auth?.user?.id || state.auth?.userId || "anonymous";
    }

    // Try to get from localStorage auth token
    const authData = localStorage.getItem("persist:root");
    if (authData) {
      const parsed = JSON.parse(authData);
      const auth = JSON.parse(parsed.auth || "{}");
      return auth.user?.id || auth.userId || "anonymous";
    }

    return "anonymous";
  } catch (error) {
    return "anonymous";
  }
};

//Step 1: Function to retry pending errors (call this on app startup)
export const retryPendingErrors = async () => {
  try {
    const pendingErrors = JSON.parse(
      localStorage.getItem("pendingErrors") || "[]"
    );

    if (pendingErrors.length === 0) return;

    console.log(`📤 Retrying ${pendingErrors.length} pending error logs...`);

    for (const errorDetail of pendingErrors) {
      try {
        await logErrorToServer({
          ...errorDetail,
          retryAttempt: true,
          retryTimestamp: new Date().toISOString(),
        });
      } catch (retryError) {
        console.error("Failed to retry error log:", retryError);
      }
    }

    // Clear pending errors after retry attempts
    localStorage.removeItem("pendingErrors");
    console.log("✅ Pending errors retry completed");
  } catch (error) {
    console.error("Failed to retry pending errors:", error);
  }
};

//Step 1: Function to manually report errors (for use in catch blocks)
export const reportError = (error, context = {}) => {
  const errorDetails = {
    message: error.message || "Unknown error",
    stack: error.stack || "No stack trace",
    context: JSON.stringify(context),
    url: typeof window !== "undefined" ? window.location.href : "unknown",
    timestamp: new Date().toISOString(),
    errorType: "manual-report",
    errorBoundary: "manual",
  };

  logErrorToServer(errorDetails);
};
