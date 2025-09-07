//src/redux/axiosConfig/axios.js
import axios from "axios";
import { AUTH_ACTIONS, AUTH_ERRORS } from "../lib/constant";

//The CSRF token value.
export function setCSRFToken(token) {
  if (typeof document !== "undefined") {
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = [
      `csrftoken=${token}`,
      "path=/",
      "SameSite=Strict",
      isProduction ? "Secure" : "",
      isProduction ? "HttpOnly" : "",
      `max-age=${60 * 60 * 24 * 7}`, // 1 week
    ]
      .filter(Boolean)
      .join("; ");

    document.cookie = cookieOptions;
  }
}

//Retrieves the CSRF token from a browser cookie - The CSRF token value, or null if not found.
export function getCSRFToken() {
  const name = "csrftoken";
  if (typeof document === "undefined") {
    return null;
  }
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name));
  if (cookieValue) {
    return cookieValue.split("=")[1];
  }
  return null;
}

// Generates a unique request ID for tracking.
export function generateRequestID() {
  return (
    "req-" +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// Configure axios instance with production-grade settings
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  timeout: 20000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add CSRF token
    const csrfToken = getCSRFToken();
    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    // Add request ID for tracking
    config.headers["X-Request-ID"] = generateRequestID();

    // Add user agent info for security logging
    if (typeof window !== "undefined") {
      config.headers["X-Client-Info"] = JSON.stringify({
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with enhanced error handling
api.interceptors.response.use(
  (response) => {
    // Log successful requests for audit trail
    console.log(
      `Request ${response.config.headers["X-Request-ID"]} completed successfully`
    );
    return response;
  },
  (error) => {
    const requestId = error.config?.headers?.["X-Request-ID"];
    console.error(
      `Request ${requestId} failed:`,
      error.response?.data || error.message
    );

    // Handle specific HTTP status codes
    if (error.response?.status === 401) {
      // Clear any client-side auth state
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");
        window.location.href = "/auth/signin?reason=session_expired";
      }
    } else if (error.response?.status === 403) {
      console.warn("Access forbidden - user may need additional permissions");
    } else if (error.response?.status >= 500) {
      console.error("Server error - may need to retry or contact support");
    }

    return Promise.reject(error);
  }
);


// Handles authentication errors with consistent messaging

export function handleAuthError(error, dispatch) {
  const requestId = error.config?.headers?.["X-Request-ID"];
  console.error(
    `Auth error [${requestId}]:`,
    error.response?.data || error.message
  );

  let errorMessage = AUTH_ERRORS.GENERIC;
  let errorType = AUTH_ACTIONS.AUTH_ERROR;

  if (error.response) {
    // Server responded with error status
    switch (error.response.status) {
      case 400:
        errorMessage =
          error.response.data?.message || AUTH_ERRORS.INVALID_REQUEST;
        break;
      case 401:
        errorMessage = AUTH_ERRORS.INVALID_CREDENTIALS;
        errorType = AUTH_ACTIONS.SIGNOUT_SUCCESS; // Clear auth state
        break;
      case 403:
        errorMessage = AUTH_ERRORS.ACCESS_DENIED;
        break;
      case 404:
        errorMessage = AUTH_ERRORS.ENDPOINT_NOT_FOUND;
        break;
      case 429:
        errorMessage = AUTH_ERRORS.RATE_LIMITED;
        break;
      case 500:
      case 502:
      case 503:
        errorMessage = AUTH_ERRORS.SERVER_ERROR;
        break;
      default:
        errorMessage = error.response.data?.message || AUTH_ERRORS.GENERIC;
    }
  } else if (error.request) {
    // Network error
    errorMessage = AUTH_ERRORS.NETWORK_ERROR;
  } else {
    // Other error
    errorMessage = error.message || AUTH_ERRORS.GENERIC;
  }

  dispatch({
    type: errorType,
    payload: {
      message: errorMessage,
      code: error.response?.status,
      requestId: requestId,
    },
  });

  // For auth errors, clear client-side storage
  if (error.response?.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      sessionStorage.removeItem("session_data");
    }
  }
}
