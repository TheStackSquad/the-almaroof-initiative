// src/redux/lib/constant.js

// Authentication Action Types
export const AUTH_ACTIONS = {
  // Traditional Auth
  SIGNUP_REQUEST: "auth/signupRequest",
  SIGNUP_SUCCESS: "auth/signupSuccess",
  SIGNUP_FAILURE: "auth/signupFailure",

  SIGNIN_REQUEST: "auth/signinRequest",
  SIGNIN_SUCCESS: "auth/signinSuccess",
  SIGNIN_FAILURE: "auth/signinFailure",

  // Google OAuth
  GOOGLE_AUTH_REQUEST: "auth/googleAuthRequest",
  GOOGLE_AUTH_SUCCESS: "auth/googleAuthSuccess",
  GOOGLE_AUTH_FAILURE: "auth/googleAuthFailure",

  // Session Management
  CHECK_SESSION_REQUEST: "auth/checkSessionRequest",
  CHECK_SESSION_SUCCESS: "auth/checkSessionSuccess",
  CHECK_SESSION_FAILURE: "auth/checkSessionFailure",

  // Profile Management
  GET_PROFILE_REQUEST: "auth/getProfileRequest",
  GET_PROFILE_SUCCESS: "auth/getProfileSuccess",
  GET_PROFILE_FAILURE: "auth/getProfileFailure",

  UPDATE_PROFILE_REQUEST: "auth/updateProfileRequest",
  UPDATE_PROFILE_SUCCESS: "auth/updateProfileSuccess",
  UPDATE_PROFILE_FAILURE: "auth/updateProfileFailure",

  // Logout
  LOGOUT_REQUEST: "auth/logoutRequest",
  LOGOUT_SUCCESS: "auth/logoutSuccess",
  LOGOUT_FAILURE: "auth/logoutFailure",

  // State Management
  CLEAR_AUTH_ERRORS: "auth/clearAuthErrors",
  SET_AUTH_LOADING: "auth/setAuthLoading",
  RESET_AUTH_STATE: "auth/resetAuthState",

  // Legacy Support (for existing requestPasscode)
  REQUEST_PASSCODE_REQUEST: "auth/requestPasscodeRequest",
  REQUEST_PASSCODE_SUCCESS: "auth/requestPasscodeSuccess",
  REQUEST_PASSCODE_FAILURE: "auth/requestPasscodeFailure",
};

// API Endpoints
export const API_ENDPOINTS = {
  SIGNUP: "/api/auth/signup",
  SIGNIN: "/api/auth/signin",
  GOOGLE_AUTH: "/api/auth/google",
  GOOGLE_CALLBACK: "/api/auth/google/callback",
  VERIFY_SESSION: "/api/auth/verify",
  LOGOUT: "/api/auth/logout",
  PROFILE: "/api/auth/profile",
};

// Auth State Initial Values
export const AUTH_INITIAL_STATE = {
  // User Data
  user: null,
  token: null,
  isAuthenticated: false,

  // Loading States
  isLoading: false,
  isSignupLoading: false,
  isSigninLoading: false,
  isGoogleAuthLoading: false,
  isSessionChecking: false,
  isProfileLoading: false,

  // Error States
  error: null,
  signupError: null,
  signinError: null,
  googleAuthError: null,
  sessionError: null,
  profileError: null,

  // Success States
  signupSuccess: false,
  signinSuccess: false,
  googleAuthSuccess: false,
  logoutSuccess: false,

  // Additional Info
  lastLoginAt: null,
  authProvider: null, // 'traditional' | 'google'
  sessionChecked: false,
};

// Error Messages
export const AUTH_ERRORS = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  USER_EXISTS: "User with this email already exists.",
  USER_NOT_FOUND: "User not found.",
  VALIDATION_ERROR: "Please check your input data.",
  SESSION_EXPIRED: "Your session has expired. Please sign in again.",
  GOOGLE_AUTH_ERROR: "Google authentication failed.",
  UNKNOWN_ERROR: "An unexpected error occurred.",
  SERVER_ERROR: "Server error. Please try again later.",
};

// Success Messages
export const AUTH_SUCCESS = {
  SIGNUP: "Account created successfully!",
  SIGNIN: "Welcome back!",
  GOOGLE_AUTH: "Google authentication successful!",
  LOGOUT: "Logged out successfully.",
  PROFILE_UPDATED: "Profile updated successfully.",
};
