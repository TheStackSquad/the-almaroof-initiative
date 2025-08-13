// src/utils/auth/googleAuth.js

"use client";

import { showToast } from "@/components/common/toastAlert/toast";
import { validateGoogleAuthData } from "@/utils/validate/authSchemas";

/**
 * Google OAuth configuration
 */
const GOOGLE_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  redirectUri:
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ||
    `${window?.location?.origin}/auth/google/callback`,
  scope: "openid email profile",
  responseType: "code",
  prompt: "consent",
};

/**
 * Initialize Google OAuth flow
 * @param {string} redirectUrl - URL to redirect after successful auth
 * @returns {Promise<void>}
 */
export const initiateGoogleAuth = async (redirectUrl = "/") => {
  try {
    // Validate configuration
    if (!GOOGLE_CONFIG.clientId) {
      throw new Error("Google Client ID not configured");
    }

    // Store redirect URL for after auth completion
    if (typeof window !== "undefined") {
      sessionStorage.setItem("google_auth_redirect", redirectUrl);
    }

    // Build Google OAuth URL
    const authUrl = buildGoogleAuthUrl();

    // Redirect to Google
    window.location.href = authUrl;
  } catch (error) {
    console.error("Google auth initiation failed:", error);
    showToast("Failed to start Google authentication", "error");
    throw error;
  }
};

/**
 * Build Google OAuth authorization URL
 * @returns {string} - Complete Google OAuth URL
 */
const buildGoogleAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: GOOGLE_CONFIG.clientId,
    redirect_uri: GOOGLE_CONFIG.redirectUri,
    response_type: GOOGLE_CONFIG.responseType,
    scope: GOOGLE_CONFIG.scope,
    prompt: GOOGLE_CONFIG.prompt,
    access_type: "offline",
    state: generateState(), // CSRF protection
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

/**
 * Generate CSRF state parameter
 * @returns {string} - Random state string
 */
const generateState = () => {
  const state =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  // Store state for verification
  if (typeof window !== "undefined") {
    sessionStorage.setItem("google_auth_state", state);
  }

  return state;
};

/**
 * Handle Google OAuth callback
 * @param {string} code - Authorization code from Google
 * @param {string} state - State parameter for CSRF protection
 * @returns {Promise<Object>} - User data from Google
 */
export const handleGoogleCallback = async (code, state) => {
  try {
    // Verify state parameter (CSRF protection)
    const storedState = sessionStorage.getItem("google_auth_state");
    if (state !== storedState) {
      throw new Error("Invalid state parameter");
    }

    // Exchange code for tokens
    const tokenResponse = await exchangeCodeForTokens(code);

    // Get user info from Google
    const userInfo = await getGoogleUserInfo(tokenResponse.access_token);

    // Validate user data
    const validation = validateGoogleAuthData(userInfo);
    if (!validation.isValid) {
      throw new Error(`Invalid user data: ${validation.errors.join(", ")}`);
    }

    // Clean up session storage
    sessionStorage.removeItem("google_auth_state");

    return validation.cleanData;
  } catch (error) {
    console.error("Google callback handling failed:", error);
    showToast("Google authentication failed", "error");
    throw error;
  }
};

/**
 * Exchange authorization code for access tokens
 * @param {string} code - Authorization code
 * @returns {Promise<Object>} - Token response
 */
const exchangeCodeForTokens = async (code) => {
  const tokenEndpoint = "https://oauth2.googleapis.com/token";

  const tokenData = {
    client_id: GOOGLE_CONFIG.clientId,
    client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET, // Note: In production, this should be server-side
    code,
    grant_type: "authorization_code",
    redirect_uri: GOOGLE_CONFIG.redirectUri,
  };

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(tokenData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${error}`);
  }

  return await response.json();
};

/**
 * Get user information from Google
 * @param {string} accessToken - Google access token
 * @returns {Promise<Object>} - User information
 */
const getGoogleUserInfo = async (accessToken) => {
  const userInfoEndpoint = "https://www.googleapis.com/oauth2/v2/userinfo";

  const response = await fetch(userInfoEndpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user information");
  }

  return await response.json();
};

/**
 * Get stored redirect URL after authentication
 * @returns {string} - Redirect URL or default
 */
export const getAuthRedirectUrl = () => {
  if (typeof window === "undefined") return "/";

  const redirectUrl = sessionStorage.getItem("google_auth_redirect") || "/";
  sessionStorage.removeItem("google_auth_redirect");

  return redirectUrl;
};

/**
 * Check if Google OAuth is properly configured
 * @returns {boolean} - True if configured
 */
export const isGoogleAuthConfigured = () => {
  return !!(GOOGLE_CONFIG.clientId && GOOGLE_CONFIG.redirectUri);
};

/**
 * Logout user from Google (revoke tokens)
 * @param {string} accessToken - Google access token to revoke
 * @returns {Promise<void>}
 */
export const revokeGoogleAuth = async (accessToken) => {
  try {
    if (!accessToken) return;

    const revokeEndpoint = `https://oauth2.googleapis.com/revoke?token=${accessToken}`;

    await fetch(revokeEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    showToast("Successfully signed out from Google", "success");
  } catch (error) {
    console.error("Google token revocation failed:", error);
    // Don't show error to user as this is cleanup operation
  }
};

// Export all Google auth functions
export const googleAuth = {
  initiateGoogleAuth,
  handleGoogleCallback,
  getAuthRedirectUrl,
  isGoogleAuthConfigured,
  revokeGoogleAuth,
};
