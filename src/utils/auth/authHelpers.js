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

export const createRouteProtector = (authHook) => {
  return (options = {}) => {
    const {
      redirectTo = "/login",
      checkSession = true,
      returnUrl = true,
      logAccess = true,
      requiredRole = null,
      requiredPermissions = [],
    } = options;

    const authResult = authHook.requireAuth({
      redirectTo,
      checkSession,
      returnUrl,
      logAccess,
    });

    // Enhanced authorization checks
    if (
      authResult.authorized === true &&
      (requiredRole || requiredPermissions.length > 0)
    ) {
      const user = authHook.user;

      // Role-based access control
      if (requiredRole && user?.role !== requiredRole) {
        logSecurityEvent("insufficient_role", {
          requiredRole,
          userRole: user?.role,
          userId: user?.id,
        });
        return {
          authorized: false,
          redirectUrl: "/unauthorized",
          reason: "insufficient_role",
        };
      }

      // Permission-based access control
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
            redirectUrl: "/unauthorized",
            reason: "insufficient_permissions",
          };
        }
      }
    }

    return authResult;
  };
};
