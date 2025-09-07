// src/utils/auth/authHelpers.js

import { logSecurityEvent } from "./securityLogger";
import { ERROR_TYPES, SECURITY_THRESHOLDS } from "./authTypes";

/**
 * Route protection and session management helpers
 */

export class RefreshManager {
  constructor() {
    this.activePromise = null;
    this.lastRefreshTime = 0;
    this.attemptCount = 0;
    this.failureCount = 0;
  }

  async executeRefresh(refreshFunction, userId) {
    // Cooldown check
    const timeSinceLastRefresh = Date.now() - this.lastRefreshTime;
    if (timeSinceLastRefresh < SECURITY_THRESHOLDS.REFRESH_COOLDOWN) {
      logSecurityEvent("refresh_rate_limit_hit", {
        timeSinceLastRefresh,
        userId,
      });
      throw new Error("Refresh rate limited");
    }

    // Return existing promise if refresh in progress
    if (this.activePromise) {
      logSecurityEvent("race_condition_prevented", { userId });
      return this.activePromise;
    }

    // Check attempt limits
    if (this.attemptCount >= SECURITY_THRESHOLDS.MAX_REFRESH_ATTEMPTS) {
      this.failureCount++;
      logSecurityEvent("max_refresh_attempts_exceeded", {
        attempts: this.attemptCount,
        userId,
      });
      throw new Error("Maximum refresh attempts exceeded");
    }

    // Execute refresh with protection
    this.activePromise = this._performRefresh(refreshFunction, userId);

    try {
      const result = await this.activePromise;
      return result;
    } finally {
      this.activePromise = null;
    }
  }

  async _performRefresh(refreshFunction, userId) {
    try {
      this.attemptCount++;
      this.lastRefreshTime = Date.now();

      logSecurityEvent("token_refresh_initiated", {
        attempt: this.attemptCount,
        userId,
      });

      const result = await refreshFunction();

      if (result?.success !== false) {
        this.reset(); // Reset counters on success
        logSecurityEvent("token_refresh_successful", { userId });
      } else {
        this.failureCount++;
        logSecurityEvent("token_refresh_failed", {
          error: result?.error,
          userId,
        });
      }

      return result;
    } catch (error) {
      this.failureCount++;
      logSecurityEvent("token_refresh_error", {
        error: error.message,
        attempt: this.attemptCount,
        userId,
      });
      throw error;
    }
  }

  reset() {
    this.attemptCount = 0;
    this.failureCount = 0;
  }

  getMetrics() {
    return {
      attemptCount: this.attemptCount,
      failureCount: this.failureCount,
      lastRefreshTime: this.lastRefreshTime,
      isRateLimited:
        Date.now() - this.lastRefreshTime <
        SECURITY_THRESHOLDS.REFRESH_COOLDOWN,
      isSuspicious:
        this.failureCount >= SECURITY_THRESHOLDS.SUSPICIOUS_ACTIVITY_THRESHOLD,
    };
  }
}

// FIXED: Remove circular dependency and implement auth logic directly
export const createRouteProtector = (authContext) => {
  return (options = {}) => {
    const {
      redirectTo = "/login",
      checkSession = true,
      returnUrl = true,
      logAccess = true,
      requiredRole = null,
      requiredPermissions = [],
      autoRedirect = false,
    } = options;

    const { isReady, isSecurelyAuthenticated, expired, sessionExpiry, user } =
      authContext;

    // Step 1: Check if auth system is ready
    if (!isReady) {
      if (logAccess) {
        logSecurityEvent("auth_not_ready", {
          userId: user?.id,
          requestedPath: redirectTo,
        });
      }
      return {
        authorized: false,
        redirected: false,
        reason: "auth_not_ready",
        redirectUrl: null,
      };
    }

    // Step 2: Check if session is expired
    if (expired) {
      if (logAccess) {
        logSecurityEvent("session_expired_access_attempt", {
          userId: user?.id,
          requestedPath: redirectTo,
        });
      }

      const redirectUrl = returnUrl
        ? `${redirectTo}?redirect=${encodeURIComponent(
            window?.location?.pathname || "/"
          )}`
        : redirectTo;

      if (autoRedirect && typeof window !== "undefined") {
        window.location.href = redirectUrl;
        return {
          authorized: false,
          redirected: true,
          reason: "session_expired",
          redirectUrl,
        };
      }

      return {
        authorized: false,
        redirected: false,
        reason: "session_expired",
        redirectUrl,
      };
    }

    // Step 3: Check basic authentication
    if (!isSecurelyAuthenticated) {
      if (logAccess) {
        logSecurityEvent("unauthorized_access_attempt", {
          userId: user?.id,
          requestedPath: redirectTo,
        });
      }

      const redirectUrl = returnUrl
        ? `${redirectTo}?redirect=${encodeURIComponent(
            window?.location?.pathname || "/"
          )}`
        : redirectTo;

      if (autoRedirect && typeof window !== "undefined") {
        window.location.href = redirectUrl;
        return {
          authorized: false,
          redirected: true,
          reason: "not_authenticated",
          redirectUrl,
        };
      }

      return {
        authorized: false,
        redirected: false,
        reason: "not_authenticated",
        redirectUrl,
      };
    }

    // Step 4: Check session validity if required
    if (checkSession && sessionExpiry) {
      const now = Date.now();
      const sessionValid = sessionExpiry > now;

      if (!sessionValid) {
        if (logAccess) {
          logSecurityEvent("session_expired", {
            sessionExpiry,
            currentTime: now,
            userId: user?.id,
          });
        }

        const redirectUrl = returnUrl
          ? `${redirectTo}?redirect=${encodeURIComponent(
              window?.location?.pathname || "/"
            )}`
          : redirectTo;

        if (autoRedirect && typeof window !== "undefined") {
          window.location.href = redirectUrl;
          return {
            authorized: false,
            redirected: true,
            reason: "session_invalid",
            redirectUrl,
          };
        }

        return {
          authorized: false,
          redirected: false,
          reason: "session_invalid",
          redirectUrl,
        };
      }
    }

    // Step 5: Role-based access control
    if (requiredRole && user?.role !== requiredRole) {
      logSecurityEvent("insufficient_role", {
        requiredRole,
        userRole: user?.role,
        userId: user?.id,
      });
      return {
        authorized: false,
        redirected: false,
        reason: "insufficient_role",
        redirectUrl: "/unauthorized",
      };
    }

    // Step 6: Permission-based access control
    if (requiredPermissions.length > 0) {
      const userPermissions = user?.permissions || [];
      const hasAllPermissions = requiredPermissions.every((permission) =>
        userPermissions.includes(permission)
      );

      if (!hasAllPermissions) {
        logSecurityEvent("insufficient_permissions", {
          requiredPermissions,
          userPermissions,
          userId: user?.id,
        });
        return {
          authorized: false,
          redirected: false,
          reason: "insufficient_permissions",
          redirectUrl: "/unauthorized",
        };
      }
    }

    // Step 7: All checks passed - authorize access
    if (logAccess) {
      logSecurityEvent("authorized_access", {
        userId: user?.id,
        userRole: user?.role,
        permissions: user?.permissions,
      });
    }

    return {
      authorized: true,
      redirected: false,
      reason: "authenticated",
      redirectUrl: null,
    };
  };
};
