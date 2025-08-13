// src/redux/action/authAction.js

import axios from "axios";
import { AUTH_ACTIONS, API_ENDPOINTS, AUTH_ERRORS } from "../lib/constant";

// Configure axios defaults
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      window.location.href = "/request-passcode";
    }
    return Promise.reject(error);
  }
);

/**
 * Traditional Signup Action
 */
export const signupUser = (userData) => async (dispatch) => {
  dispatch({ type: AUTH_ACTIONS.SIGNUP_REQUEST });

  try {
    const response = await api.post(API_ENDPOINTS.SIGNUP, userData);
    const { user, token, message } = response.data;

    dispatch({
      type: AUTH_ACTIONS.SIGNUP_SUCCESS,
      payload: {
        user,
        token,
        message,
        authProvider: "traditional",
      },
    });

    // Store token if provided (some implementations only provide token on signin)
    if (token) {
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user_data", JSON.stringify(user));
    }

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      AUTH_ERRORS.UNKNOWN_ERROR;

    dispatch({
      type: AUTH_ACTIONS.SIGNUP_FAILURE,
      payload: errorMessage,
    });

    throw new Error(errorMessage);
  }
};

/**
 * Traditional Signin Action
 */
export const signinUser = (credentials) => async (dispatch) => {
  dispatch({ type: AUTH_ACTIONS.SIGNIN_REQUEST });

  try {
    const response = await api.post(API_ENDPOINTS.SIGNIN, credentials);
    const { user, token, message } = response.data;

    // Store auth data
    localStorage.setItem("auth_token", token);
    localStorage.setItem("user_data", JSON.stringify(user));

    dispatch({
      type: AUTH_ACTIONS.SIGNIN_SUCCESS,
      payload: {
        user,
        token,
        message,
        authProvider: "traditional",
        lastLoginAt: new Date().toISOString(),
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      AUTH_ERRORS.INVALID_CREDENTIALS;

    dispatch({
      type: AUTH_ACTIONS.SIGNIN_FAILURE,
      payload: errorMessage,
    });

    throw new Error(errorMessage);
  }
};

/**
 * Google OAuth Action
 */
export const authenticateWithGoogle = (googleData) => async (dispatch) => {
  dispatch({ type: AUTH_ACTIONS.GOOGLE_AUTH_REQUEST });

  try {
    const response = await api.post(API_ENDPOINTS.GOOGLE_AUTH, googleData);
    const { user, token, message, isNewUser } = response.data;

    // Store auth data
    localStorage.setItem("auth_token", token);
    localStorage.setItem("user_data", JSON.stringify(user));

    dispatch({
      type: AUTH_ACTIONS.GOOGLE_AUTH_SUCCESS,
      payload: {
        user,
        token,
        message,
        authProvider: "google",
        isNewUser,
        lastLoginAt: new Date().toISOString(),
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      AUTH_ERRORS.GOOGLE_AUTH_ERROR;

    dispatch({
      type: AUTH_ACTIONS.GOOGLE_AUTH_FAILURE,
      payload: errorMessage,
    });

    throw new Error(errorMessage);
  }
};

/**
 * Check Session Action
 */
export const checkSession = () => async (dispatch) => {
  dispatch({ type: AUTH_ACTIONS.CHECK_SESSION_REQUEST });

  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await api.get(API_ENDPOINTS.VERIFY_SESSION);
    const { user } = response.data;

    // Update stored user data
    localStorage.setItem("user_data", JSON.stringify(user));

    dispatch({
      type: AUTH_ACTIONS.CHECK_SESSION_SUCCESS,
      payload: {
        user,
        token,
      },
    });

    return { type: "auth/checkSessionSuccess", user, token };
  } catch (error) {
    // Clear invalid session data
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");

    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      AUTH_ERRORS.SESSION_EXPIRED;

    dispatch({
      type: AUTH_ACTIONS.CHECK_SESSION_FAILURE,
      payload: errorMessage,
    });

    return { type: "auth/checkSessionFailure", error: errorMessage };
  }
};

/**
 * Get User Profile Action
 */
export const getUserProfile = () => async (dispatch) => {
  dispatch({ type: AUTH_ACTIONS.GET_PROFILE_REQUEST });

  try {
    const response = await api.get(API_ENDPOINTS.PROFILE);
    const { user } = response.data;

    // Update stored user data
    localStorage.setItem("user_data", JSON.stringify(user));

    dispatch({
      type: AUTH_ACTIONS.GET_PROFILE_SUCCESS,
      payload: { user },
    });

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      AUTH_ERRORS.UNKNOWN_ERROR;

    dispatch({
      type: AUTH_ACTIONS.GET_PROFILE_FAILURE,
      payload: errorMessage,
    });

    throw new Error(errorMessage);
  }
};

/**
 * Update User Profile Action
 */
export const updateUserProfile = (profileData) => async (dispatch) => {
  dispatch({ type: AUTH_ACTIONS.UPDATE_PROFILE_REQUEST });

  try {
    const response = await api.put(API_ENDPOINTS.PROFILE, profileData);
    const { user, message } = response.data;

    // Update stored user data
    localStorage.setItem("user_data", JSON.stringify(user));

    dispatch({
      type: AUTH_ACTIONS.UPDATE_PROFILE_SUCCESS,
      payload: { user, message },
    });

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      AUTH_ERRORS.UNKNOWN_ERROR;

    dispatch({
      type: AUTH_ACTIONS.UPDATE_PROFILE_FAILURE,
      payload: errorMessage,
    });

    throw new Error(errorMessage);
  }
};

/**
 * Logout Action
 */
export const logoutUser = () => async (dispatch) => {
  dispatch({ type: AUTH_ACTIONS.LOGOUT_REQUEST });

  try {
    // Call logout endpoint (optional - for token blacklisting)
    await api.post(API_ENDPOINTS.LOGOUT);
  } catch (error) {
    // Continue with logout even if API call fails
    console.warn("Logout API call failed:", error);
  } finally {
    // Clear local storage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");

    dispatch({
      type: AUTH_ACTIONS.LOGOUT_SUCCESS,
      payload: { message: "Logged out successfully" },
    });
  }
};

/**
 * Legacy Support - Updated requestPasscode to work with new system
 */
export const requestPasscode = (authData) => async (dispatch) => {
  // Determine if this is signup or signin based on data presence
  const isSignup = authData.username && authData.phone;

  if (isSignup) {
    return dispatch(signupUser(authData));
  } else {
    return dispatch(signinUser(authData));
  }
};

/**
 * Utility Actions
 */

// Clear auth errors
export const clearAuthErrors = () => ({
  type: AUTH_ACTIONS.CLEAR_AUTH_ERRORS,
});

// Set loading state
export const setAuthLoading = (isLoading) => ({
  type: AUTH_ACTIONS.SET_AUTH_LOADING,
  payload: isLoading,
});

// Reset auth state
export const resetAuthState = () => ({
  type: AUTH_ACTIONS.RESET_AUTH_STATE,
});

/**
 * Initialize Auth State (call on app startup)
 */
export const initializeAuth = () => (dispatch) => {
  const token = localStorage.getItem("auth_token");
  const userData = localStorage.getItem("user_data");

  if (token && userData) {
    try {
      const user = JSON.parse(userData);
      dispatch({
        type: AUTH_ACTIONS.CHECK_SESSION_SUCCESS,
        payload: { user, token },
      });

      // Verify session in background
      dispatch(checkSession());
    } catch (error) {
      // Clear corrupted data
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
    }
  }
};
