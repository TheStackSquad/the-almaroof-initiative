// src/redux/action/authAction.js

import axios from "axios";
import { AUTH_ACTIONS, API_ENDPOINTS, AUTH_ERRORS } from "../lib/constant";

// Configure axios defaults
const api = axios.create({
  // The browser will automatically attach the HttpOnly cookie to requests for this base URL.
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  return config;
});

// Handle 401 Unauthorized errors by redirecting the user.
// The browser will handle clearing the cookie after it expires or on logout.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server returns a 401, we redirect the user to the login page.
    // The server is responsible for invalidating the cookie.
    if (error.response?.status === 401) {
      window.location.href = "/community/online-services/protected-route";
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
    // No need to get the token from localStorage; the browser sends the cookie automatically.
    // The presence of the cookie is what indicates a potential valid session.

    // Make the API call to verify the session.
    const response = await api.get(API_ENDPOINTS.VERIFY_SESSION);
    const { user } = response.data;

    // No need to manually update localStorage. The user data should come from the server.
    // We just dispatch the success action.
    dispatch({
      type: AUTH_ACTIONS.CHECK_SESSION_SUCCESS,
      payload: {
        user,
      },
    });

    return { type: "auth/checkSessionSuccess", user };
  } catch (error) {
    // There is no local data to clear. The browser handles the cookie.
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
