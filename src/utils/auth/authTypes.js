// src/utils/auth/authTypes.js

export const SECURITY_THRESHOLDS = {
  REFRESH_BUFFER: 15 * 60 * 1000, // 15 minutes
  MAX_REFRESH_ATTEMPTS: 3,
  SUSPICIOUS_ACTIVITY_THRESHOLD: 5, // Failed refreshes
  TOKEN_ROTATION_WINDOW: 24 * 60 * 60 * 1000, // 24 hours
  REFRESH_COOLDOWN: 5000, // 5 seconds between refresh attempts
  AUTO_REFRESH_INTERVALS: [30000, 60000, 120000], // Exponential backoff: 30s, 1m, 2m
  SESSION_TIMEOUT_WARNING: 5 * 60 * 1000, // 5 minutes warning
  MAX_CONCURRENT_SESSIONS: 3,
  FAILED_LOGIN_LOCKOUT_THRESHOLD: 5,
  LOCKOUT_DURATION: 30 * 60 * 1000, // 30 minutes
};

export const ERROR_TYPES = {
  NETWORK: "network_error",
  EXPIRED: "token_expired",
  INVALID: "invalid_token",
  RATE_LIMITED: "rate_limited",
  SERVER: "server_error",
  SUSPICIOUS: "suspicious_activity",
  RACE_CONDITION: "race_condition",
  INSUFFICIENT_ROLE: "insufficient_role",
  INSUFFICIENT_PERMISSIONS: "insufficient_permissions",
  SESSION_CONFLICT: "session_conflict",
};

export const FORM_STATES = {
  IDLE: "idle",
  VALIDATING: "validating",
  SUBMITTING: "submitting",
  PAYMENT_PENDING: "payment_pending",
  PAYMENT_PROCESSING: "payment_processing",
  PAYMENT_RETRY: "payment_retry",
  SUCCESS: "success",
  ERROR: "error",
};

export const PAYMENT_STATES = {
  PENDING: "pending",
  PROCESSING: "processing",
  PAID: "paid",
  FAILED: "failed",
  EXPIRED: "expired",
  CANCELLED: "cancelled",
};
