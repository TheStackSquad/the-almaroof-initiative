// src/utils/auth/tokenUtils.js

import { SECURITY_THRESHOLDS, ERROR_TYPES } from "./authTypes";

/**
 * Token validation utilities with enhanced security
 */

export const shouldRefreshToken = (tokenExpiry) => {
  if (!tokenExpiry) return false;
  const timeUntilExpiry = new Date(tokenExpiry).getTime() - Date.now();
  return timeUntilExpiry <= SECURITY_THRESHOLDS.REFRESH_BUFFER;
};

export const isTokenExpired = (tokenExpiry) => {
  if (!tokenExpiry) return false;
  return new Date(tokenExpiry).getTime() <= Date.now();
};

export const getTokenTimeRemaining = (tokenExpiry) => {
  if (!tokenExpiry) return 0;
  return Math.max(0, new Date(tokenExpiry).getTime() - Date.now());
};

export const validateTokenStructure = (token) => {
  if (!token || typeof token !== "string") {
    return { valid: false, error: "Invalid token format" };
  }

  // Basic JWT structure validation (header.payload.signature)
  const parts = token.split(".");
  if (parts.length !== 3) {
    return { valid: false, error: "Invalid JWT structure" };
  }

  try {
    // Validate base64 encoding
    const payload = JSON.parse(atob(parts[1]));

    // Check required claims
    const requiredClaims = ["sub", "iat", "exp"];
    const missingClaims = requiredClaims.filter((claim) => !payload[claim]);

    if (missingClaims.length > 0) {
      return {
        valid: false,
        error: `Missing required claims: ${missingClaims.join(", ")}`,
      };
    }

    return { valid: true, payload };
  } catch (error) {
    return { valid: false, error: "Invalid token payload" };
  }
};

export const generateSecureReference = (prefix = "ref", length = 16) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const timestamp = Date.now();
  let result = "";

  // Use crypto.getRandomValues for secure random generation
  const randomArray = new Uint8Array(length);
  crypto.getRandomValues(randomArray);

  for (let i = 0; i < length; i++) {
    result += chars[randomArray[i] % chars.length];
  }

  return `${prefix}_${timestamp}_${result}`;
};

