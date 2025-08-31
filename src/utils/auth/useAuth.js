// src/utils/auth/useAuth.js

"use client";

import { useSelector, useDispatch } from "react-redux";
import { useCallback, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logoutUser, refreshToken } from "@/redux/action/authAction";

// Import utilities from split files
import {
  shouldRefreshToken,
  isTokenExpired,
  getTokenTimeRemaining,
  validateTokenStructure,
} from "@/utils/auth/tokenUtils";

import { RefreshManager, createRouteProtector } from "./authHelpers";

import { logSecurityEvent } from "./securityLogger";

import { SECURITY_THRESHOLDS, ERROR_TYPES } from "./authTypes";

export function useAuth() {
  const dispatch = useDispatch();
  const router = useRouter();

  // Initialize managers (singleton pattern)
  const refreshManagerRef = useRef(null);
  if (!refreshManagerRef.current) {
    refreshManagerRef.current = new RefreshManager();
  }

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
    const timeUntilRefresh =
      getTokenTimeRemaining(tokenExpiry) - SECURITY_THRESHOLDS.REFRESH_BUFFER;

    const isReady =
      isRehydrated && sessionChecked && !isLoading && !isSessionChecking;
    const isSecurelyAuthenticated = isAuthenticated && !expired && isReady;
    const loading =
      !isRehydrated || isLoading || isSessionChecking || isRefreshing;

    return {
      expired,
      needsRefresh,
      timeUntilRefresh: Math.max(0, timeUntilRefresh),
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

  // Enhanced error context with categorization
  const errorContext = useMemo(() => {
    if (!error && !computedState.expired) return null;

    let errorType = ERROR_TYPES.SERVER;
    let recoverable = true;

    if (computedState.expired) {
      errorType = ERROR_TYPES.EXPIRED;
      recoverable = false;
    } else if (error?.message?.includes("network")) {
      errorType = ERROR_TYPES.NETWORK;
    } else if (error?.message?.includes("rate limit")) {
      errorType = ERROR_TYPES.RATE_LIMITED;
    } else if (error?.message?.includes("invalid")) {
      errorType = ERROR_TYPES.INVALID;
      recoverable = false;
    }

    const refreshMetrics = refreshManagerRef.current.getMetrics();
    if (refreshMetrics.isSuspicious) {
      errorType = ERROR_TYPES.SUSPICIOUS;
      recoverable = false;
      logSecurityEvent("suspicious_activity_detected", {
        failureCount: refreshMetrics.failureCount,
        userId: user?.id,
      });
    }

    return {
      type: errorType,
      message:
        error?.message ||
        (computedState.expired ? "Session expired" : "Authentication error"),
      recoverable,
      timestamp: Date.now(),
      retryAfter: errorType === ERROR_TYPES.RATE_LIMITED ? 60000 : null,
    };
  }, [error, computedState.expired, user?.id]);

  // Race condition protected refresh function
  const protectedRefresh = useCallback(async () => {
    const refreshFunction = () => dispatch(refreshToken());
    return await refreshManagerRef.current.executeRefresh(
      refreshFunction,
      user?.id
    );
  }, [dispatch, user?.id]);

  // Memoized logout function with enhanced security
  const logout = useCallback(
    async (redirectPath = "/", reason = "user_initiated") => {
      try {
        // Clear refresh manager state
        refreshManagerRef.current.reset();

        logSecurityEvent("user_logout", {
          reason,
          userId: user?.id,
          sessionDuration: user?.loginTime
            ? Date.now() - new Date(user.loginTime).getTime()
            : null,
        });

        await dispatch(logoutUser());

        if (typeof window !== "undefined") {
          router.push(redirectPath);
        }
        return { success: true };
      } catch (error) {
        logSecurityEvent("logout_failed", {
          error: error.message,
          userId: user?.id,
        });
        console.error("Logout failed:", error);
        return { success: false, error: error.message };
      }
    },
    [dispatch, router, user?.id, user?.loginTime]
  );

  // Enhanced session validation
  const validateSession = useCallback(() => {
    const now = Date.now();
    const tokenValid = tokenExpiry && new Date(tokenExpiry).getTime() > now;
    const sessionValid =
      authState.sessionExpiry && authState.sessionExpiry > now;

    const validation = {
      isValid: tokenValid && sessionValid && isAuthenticated,
      tokenValid,
      sessionValid,
      needsRefresh: shouldRefreshToken(tokenExpiry),
      expired: isTokenExpired(tokenExpiry),
    };

    if (!validation.isValid) {
      logSecurityEvent("session_validation_failed", {
        validation,
        userId: user?.id,
      });
    }

    return validation;
  }, [tokenExpiry, authState.sessionExpiry, isAuthenticated, user?.id]);

  // Force logout for security reasons
  const forceLogout = useCallback(
    async (reason = "security_violation") => {
      const metrics = refreshManagerRef.current.getMetrics();
      logSecurityEvent("forced_logout", {
        reason,
        securityMetrics: metrics,
        userId: user?.id,
      });

      return await logout("/auth/signin?forced=true", reason);
    },
    [logout, user?.id]
  );

  // Create route protector with current auth context
  const requireAuth = useMemo(() => {
    return createRouteProtector({
      isReady: computedState.isReady,
      isSecurelyAuthenticated: computedState.isSecurelyAuthenticated,
      expired: computedState.expired,
      sessionExpiry: authState.sessionExpiry,
      user,
    });
  }, [computedState, authState.sessionExpiry, user]);

  // Security metrics
  const securityMetrics = useMemo(() => {
    const refreshMetrics = refreshManagerRef.current.getMetrics();
    return {
      ...refreshMetrics,
      securityLevel: refreshMetrics.isSuspicious ? "HIGH_RISK" : "NORMAL",
      isHighRisk: refreshMetrics.isSuspicious,
    };
  }, []);

  // Auto-refresh trigger
  const shouldAutoRefresh = useMemo(() => {
    const refreshMetrics = refreshManagerRef.current.getMetrics();
    return (
      computedState.needsRefresh &&
      !isRefreshing &&
      !computedState.expired &&
      computedState.isReady &&
      !refreshMetrics.isRateLimited &&
      !refreshMetrics.isSuspicious
    );
  }, [computedState, isRefreshing]);

  return {
    // ===== ORIGINAL API (zero breaking changes) =====
    user,
    isAuthenticated: computedState.isSecurelyAuthenticated,
    isLoading: computedState.loading,
    isRefreshing,
    error,
    authProvider,
    tokenExpiry,
    needsRefresh: computedState.needsRefresh,
    expired: computedState.expired,
    timeUntilRefresh: computedState.timeUntilRefresh,
    logout,
    manualRefresh: protectedRefresh, // Now uses protected version
    isGoogleAuth: authProvider === "google",
    isTraditionalAuth: authProvider === "traditional",

    // ===== ENHANCED API (new additions) =====
    isReady: computedState.isReady,
    isSecurelyAuthenticated: computedState.isSecurelyAuthenticated,
    errorContext,
    hasError: !!errorContext,
    requireAuth,
    shouldAutoRefresh,
    protectedRefresh,
    securityMetrics,
    validateSession,
    forceLogout,
    isRehydrated,
    sessionChecked,
    canRefresh:
      !isRefreshing &&
      !computedState.expired &&
      !!tokenExpiry &&
      !securityMetrics.isRateLimited,
    needsLogin:
      computedState.expired || (!isAuthenticated && computedState.isReady),
    isHighRisk: securityMetrics.isHighRisk,
    refreshAttemptsRemaining: Math.max(
      0,
      SECURITY_THRESHOLDS.MAX_REFRESH_ATTEMPTS - securityMetrics.attemptCount
    ),
  };
}
