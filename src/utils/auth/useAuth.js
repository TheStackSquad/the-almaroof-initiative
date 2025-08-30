// src/utils/auth/useAuth.js

"use client";

import { useSelector, useDispatch } from "react-redux";
import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { logoutUser, refreshToken } from "@/redux/action/authAction";

// Utility functions for token management
const shouldRefreshToken = (tokenExpiry) => {
  if (!tokenExpiry) return false;
  const timeUntilExpiry = new Date(tokenExpiry).getTime() - Date.now();
  return timeUntilExpiry <= 15 * 60 * 1000; // 15 minutes buffer
};

const isTokenExpired = (tokenExpiry) => {
  if (!tokenExpiry) return false;
  return new Date(tokenExpiry).getTime() <= Date.now();
};

export function useAuth() {
  const dispatch = useDispatch();
  const router = useRouter();

  // Get auth state from Redux - single source of truth
  const authState = useSelector((state) => state.auth);
  const isRehydrated = useSelector(
    (state) => state._persist?.rehydrated ?? false
  );

  const {
    user,
    isAuthenticated,
    isLoading,
    isSessionChecking,
    isRefreshing,
    tokenExpiry,
    error,
    authProvider,
    sessionChecked,
  } = authState;

  // Memoized computed properties for performance
  const computedState = useMemo(() => {
    const expired = tokenExpiry ? isTokenExpired(tokenExpiry) : false;
    const needsRefresh = tokenExpiry ? shouldRefreshToken(tokenExpiry) : false;

    // Calculate time until refresh needed (for UI display)
    const timeUntilRefresh = tokenExpiry
      ? Math.max(
          0,
          new Date(tokenExpiry).getTime() - Date.now() - 15 * 60 * 1000
        )
      : 0;

    // Determine if we're truly ready (no more loading states)
    const isReady =
      isRehydrated && sessionChecked && !isLoading && !isSessionChecking;

    // Enhanced authentication state that accounts for expiry
    const isSecurelyAuthenticated = isAuthenticated && !expired && isReady;

    // Unified loading state
    const loading =
      !isRehydrated || isLoading || isSessionChecking || isRefreshing;

    return {
      expired,
      needsRefresh,
      timeUntilRefresh,
      isReady,
      isSecurelyAuthenticated,
      loading,
    };
  }, [
    tokenExpiry,
    isRehydrated,
    sessionChecked,
    isLoading,
    isSessionChecking,
    isRefreshing,
    isAuthenticated,
  ]);

  // Enhanced error context
  const errorContext = useMemo(() => {
    if (!error && !computedState.expired) return null;

    return {
      type: error?.type || (computedState.expired ? "expired" : "unknown"),
      message:
        error?.message ||
        (computedState.expired ? "Session expired" : "Authentication error"),
      recoverable: !computedState.expired, // Expired sessions need fresh login
      timestamp: Date.now(),
    };
  }, [error, computedState.expired]);

  // Memoized logout function
  const logout = useCallback(
    async (redirectPath = "/") => {
      try {
        await dispatch(logoutUser());
        if (typeof window !== "undefined") {
          router.push(redirectPath);
        }
        return { success: true };
      } catch (error) {
        console.error("Logout failed:", error);
        return { success: false, error: error.message };
      }
    },
    [dispatch, router]
  );

  // Enhanced manual refresh with error handling
  const manualRefresh = useCallback(async () => {
    // Prevent refresh if already refreshing or no token to refresh
    if (isRefreshing) {
      return { success: false, error: "Refresh already in progress" };
    }

    if (!tokenExpiry) {
      return { success: false, error: "No token available to refresh" };
    }

    if (computedState.expired) {
      return { success: false, error: "Token expired, login required" };
    }

    try {
      const result = await dispatch(refreshToken());
      return result || { success: true };
    } catch (error) {
      console.error("Token refresh failed:", error);
      return { success: false, error: error.message || "Token refresh failed" };
    }
  }, [dispatch, isRefreshing, tokenExpiry, computedState.expired]);

  // Route protection helper - non-breaking addition
  const requireAuth = useCallback(
    (options = {}) => {
      const {
        redirectTo = "/login",
        checkSession = true,
        returnUrl = true,
      } = options;

      // Still loading - let component decide how to handle
      if (!computedState.isReady) {
        return { authorized: null, loading: true };
      }

      // Check session validity if requested
      const sessionValid =
        !checkSession ||
        (authState.sessionExpiry && authState.sessionExpiry > Date.now());

      if (!computedState.isSecurelyAuthenticated || !sessionValid) {
        // Prepare redirect URL with return path
        const currentPath =
          typeof window !== "undefined" ? window.location.pathname : "";
        const redirectUrl =
          returnUrl && currentPath !== redirectTo
            ? `${redirectTo}?from=${encodeURIComponent(currentPath)}`
            : redirectTo;

        return {
          authorized: false,
          redirectUrl,
          reason: computedState.expired ? "expired" : "unauthenticated",
        };
      }

      return { authorized: true };
    },
    [
      computedState.isReady,
      computedState.isSecurelyAuthenticated,
      computedState.expired,
      authState.sessionExpiry,
    ]
  );

  // Auto-refresh trigger (non-breaking enhancement)
  const shouldAutoRefresh = useMemo(() => {
    return (
      computedState.needsRefresh &&
      !isRefreshing &&
      !computedState.expired &&
      computedState.isReady
    );
  }, [
    computedState.needsRefresh,
    isRefreshing,
    computedState.expired,
    computedState.isReady,
  ]);

  return {
    // ===== ORIGINAL API (zero breaking changes) =====
    user,
    isAuthenticated: computedState.isSecurelyAuthenticated, // Enhanced but same interface
    isLoading: computedState.loading, // Unified loading state
    isRefreshing,
    error,
    authProvider,
    tokenExpiry,
    needsRefresh: computedState.needsRefresh,
    expired: computedState.expired,
    timeUntilRefresh: computedState.timeUntilRefresh,
    logout,
    manualRefresh,
    isGoogleAuth: authProvider === "google",
    isTraditionalAuth: authProvider === "traditional",

    // ===== ENHANCED API (new additions) =====
    // Reliability enhancements
    isReady: computedState.isReady, // True when we definitively know auth status
    isSecurelyAuthenticated: computedState.isSecurelyAuthenticated, // Explicit secure state

    // Error enhancements
    errorContext, // Rich error information
    hasError: !!errorContext,

    // Route protection
    requireAuth, // Helper for protected routes

    // Auto-refresh indicators
    shouldAutoRefresh, // Whether auto-refresh should trigger

    // System state
    isRehydrated, // Redux persistence status
    sessionChecked, // Whether initial session check completed

    // Utility methods
    canRefresh: !isRefreshing && !computedState.expired && !!tokenExpiry,
    needsLogin:
      computedState.expired || (!isAuthenticated && computedState.isReady),
  };
}
