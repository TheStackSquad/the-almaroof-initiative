// src/redux/reducer/authReducer.js

import { AUTH_ACTIONS, AUTH_INITIAL_STATE } from "../lib/constant";

const authReducer = (state = AUTH_INITIAL_STATE, action) => {
  switch (action.type) {
    // Redux Persist Rehydration - Critical fix for loading state persistence
    case "persist/REHYDRATE":
      const rehydratedState = action.payload?.auth || {};
      return {
        ...state,
        ...rehydratedState,
        // Always reset ALL loading states after rehydration to prevent stuck states
        isLoading: false,
        isSessionChecking: false,
        isSignupLoading: false,
        isSigninLoading: false,
        isGoogleAuthLoading: false,
        isProfileLoading: false,
      };

    // Traditional Signup
    case AUTH_ACTIONS.SIGNUP_REQUEST:
      return {
        ...state,
        isSignupLoading: true,
        isLoading: true, // General loading flag for UI components
        signupError: null,
        signupSuccess: false,
        error: null,
      };

    case AUTH_ACTIONS.SIGNUP_SUCCESS:
      return {
        ...state,
        isSignupLoading: false,
        isLoading: false, // Clear general loading
        signupSuccess: true,
        signupError: null,
        error: null,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: !!action.payload.token,
        authProvider: action.payload.authProvider,
        sessionChecked: true, // Mark session as checked after successful signup
      };

    case AUTH_ACTIONS.SIGNUP_FAILURE:
      return {
        ...state,
        isSignupLoading: false,
        isLoading: false, // Clear loading on failure
        signupSuccess: false,
        signupError: action.payload,
        error: action.payload,
      };

    // Traditional Signin
    case AUTH_ACTIONS.SIGNIN_REQUEST:
      return {
        ...state,
        isSigninLoading: true,
        isLoading: true, // Set general loading
        signinError: null,
        signinSuccess: false,
        error: null,
      };

    case AUTH_ACTIONS.SIGNIN_SUCCESS:
      return {
        ...state,
        isSigninLoading: false,
        isLoading: false, // Clear general loading
        signinSuccess: true,
        signinError: null,
        error: null,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        authProvider: action.payload.authProvider,
        lastLoginAt: action.payload.lastLoginAt,
        sessionChecked: true, // Mark session as checked after successful signin
      };

    case AUTH_ACTIONS.SIGNIN_FAILURE:
      return {
        ...state,
        isSigninLoading: false,
        isLoading: false, // Clear loading on failure
        signinSuccess: false,
        signinError: action.payload,
        error: action.payload,
        isAuthenticated: false,
        user: null,
        token: null,
      };

    // Google OAuth
    case AUTH_ACTIONS.GOOGLE_AUTH_REQUEST:
      return {
        ...state,
        isGoogleAuthLoading: true,
        isLoading: true, // Set general loading
        googleAuthError: null,
        googleAuthSuccess: false,
        error: null,
      };

    case AUTH_ACTIONS.GOOGLE_AUTH_SUCCESS:
      return {
        ...state,
        isGoogleAuthLoading: false,
        isLoading: false, // Clear general loading
        googleAuthSuccess: true,
        googleAuthError: null,
        error: null,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        authProvider: action.payload.authProvider,
        lastLoginAt: action.payload.lastLoginAt,
        sessionChecked: true, // Mark session as checked after successful Google auth
      };

    case AUTH_ACTIONS.GOOGLE_AUTH_FAILURE:
      return {
        ...state,
        isGoogleAuthLoading: false,
        isLoading: false, // Clear loading on failure
        googleAuthSuccess: false,
        googleAuthError: action.payload,
        error: action.payload,
        isAuthenticated: false,
        user: null,
        token: null,
      };

    // Session Management - Enhanced with proper loading state management
    case AUTH_ACTIONS.CHECK_SESSION_REQUEST:
      return {
        ...state,
        isSessionChecking: true,
        isLoading: true, // Set general loading for UI components
        sessionError: null, // Clear previous session errors
      };

    case AUTH_ACTIONS.CHECK_SESSION_SUCCESS:
      return {
        ...state,
        isSessionChecking: false,
        isLoading: false, // Clear all loading states on success
        sessionError: null,
        user: { ...state.user, ...action.payload.user },
        token: action.payload.token || state.token,
        authProvider:
          action.payload.authProvider || state.authProvider || "traditional",
        lastLoginAt: action.payload.lastLoginAt || state.lastLoginAt,
        isAuthenticated: true,
        sessionChecked: true, // Mark session as successfully checked
      };

    case AUTH_ACTIONS.CHECK_SESSION_FAILURE:
      return {
        ...state,
        isSessionChecking: false,
        isLoading: false, // Critical: Clear loading on failure to prevent stuck state
        sessionError: action.payload,
        isAuthenticated: false,
        user: null,
        token: null,
        sessionChecked: true, // Mark session as checked even on failure
      };

    case AUTH_ACTIONS.REFRESH_TOKEN_SUCCESS:
      return {
        ...state,
        isRefreshing: false,
        token: action.payload.token,
        tokenExpiry: action.payload.tokenExpiry,
        refreshToken: action.payload.refreshToken,
        user: action.payload.user,
      };

    case AUTH_ACTIONS.REFRESH_TOKEN_FAILURE:
      return {
        ...state,
        isRefreshing: false,
        error: action.payload,
      };

    // Logout
    case AUTH_ACTIONS.LOGOUT_REQUEST:
      return {
        ...state,
        isLoading: true, // Show loading during logout process
      };

    case AUTH_ACTIONS.LOGOUT_SUCCESS:
      return {
        ...AUTH_INITIAL_STATE,
        logoutSuccess: true,
        sessionChecked: true, // Keep session as checked to prevent auto-recheck
        isLoading: false, // Ensure loading is false after logout
      };

    case AUTH_ACTIONS.LOGOUT_FAILURE:
      return {
        ...AUTH_INITIAL_STATE,
        error: action.payload,
        sessionChecked: true, // Keep session as checked
        isLoading: false, // Clear loading even on logout failure
      };

    // Utility Actions
    case AUTH_ACTIONS.CLEAR_AUTH_ERRORS:
      return {
        ...state,
        error: null,
        signupError: null,
        signinError: null,
        googleAuthError: null,
        sessionError: null,
        profileError: null,
      };

    case AUTH_ACTIONS.SET_AUTH_LOADING:
      return {
        ...state,
        isLoading: action.payload, // Allow manual loading state control
      };

    case AUTH_ACTIONS.RESET_AUTH_STATE:
      return {
        ...AUTH_INITIAL_STATE,
        sessionChecked: true, // Prevent auto session check after reset
      };

    default:
      return state;
  }
};

export default authReducer;
