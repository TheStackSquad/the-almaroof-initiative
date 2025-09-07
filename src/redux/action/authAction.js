//src/redux/action/authAction.js

import { AUTH_ACTIONS, API_ENDPOINTS, AUTH_ERRORS } from "@/redux/lib/constant";
import { api, handleAuthError, setCSRFToken, getCSRFToken } from "@/redux/axiosConfig/axios";
import { sanitizeUserData } from "@/redux/reduxUtils/sanitizeUserData";

export const signupUser = (userData) => async (dispatch) => {
  // Log the initiation of the signup process and the data being sent
  console.log("Initiating user signup with data:", userData);
  dispatch({ type: AUTH_ACTIONS.SIGNUP_REQUEST });

  try {
    // Log the API endpoint being called
    console.log(`Making a POST request to ${API_ENDPOINTS.SIGNUP}`);
    const response = await api.post(API_ENDPOINTS.SIGNUP, userData);

    // Destructure only the necessary fields from the response
    const { user, message } = response.data;

    // Log the successful response from the server
    console.log("User signup successful!", { user, message });

    // Dispatch the success action with the simplified payload
    dispatch({
      type: AUTH_ACTIONS.SIGNUP_SUCCESS,
      payload: {
        user,
        message,
        authProvider: "traditional",
      },
    });

    // Log the final return data
    console.log("Signup function returning response data:", response.data);
    return response.data;
  } catch (error) {
    // Log the error details if the signup fails
    console.error("User signup failed!", error);

    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      AUTH_ERRORS.UNKNOWN_ERROR;

    // Log the specific error message being dispatched
    console.error("Dispatching signup failure with message:", errorMessage);

    dispatch({
      type: AUTH_ACTIONS.SIGNUP_FAILURE,
      payload: errorMessage,
    });

    // Log the error being thrown
    console.error("Throwing an error with message:", errorMessage);
    throw new Error(errorMessage);
  }
};

export const signinUser = (credentials) => async (dispatch) => {
  dispatch({ type: AUTH_ACTIONS.SIGNIN_REQUEST });

  try {
    const response = await api.post(API_ENDPOINTS.SIGNIN, credentials, {
      withCredentials: true,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRF-Token": getCSRFToken(),
      },
    });

    const { user, message, csrfToken } = response.data;

    // Update CSRF token for future requests
    if (csrfToken) {
      setCSRFToken(csrfToken);
    }

    // Sanitize user data before storing
    const sanitizedUser = sanitizeUserData(user);

    dispatch({
      type: AUTH_ACTIONS.SIGNIN_SUCCESS,
      payload: {
        user: sanitizedUser,
        message: message || "Sign in successful",
        authProvider: "traditional",
        lastLoginAt: new Date().toISOString(),
      },
    });

    return { success: true, user: sanitizedUser };
  } catch (error) {
    // Handle different error responses
    let errorMessage = "Sign in failed. Please try again.";

    if (error.response?.status === 401) {
      errorMessage =
        error.response.data?.message || "Invalid email or password.";
    } else if (error.response?.status === 429) {
      errorMessage =
        error.response.data?.message ||
        "Too many attempts. Please try again later.";
    } else if (error.response?.status === 400) {
      errorMessage =
        error.response.data?.message ||
        "Please check your input and try again.";
    } else if (error.message) {
      errorMessage = error.message;
    }

    dispatch({
      type: AUTH_ACTIONS.SIGNIN_FAILURE,
      payload: errorMessage,
    });

    return {
      success: false,
      error: errorMessage,
    };
  }
};

// Sends a password reset magic link to the user's email.
export const sendForgotPasswordLink = (email) => async (dispatch) => {
  dispatch({ type: AUTH_ACTIONS.FORGOT_PASSWORD_REQUEST });
  try {
    const response = await api.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });

    dispatch({
      type: AUTH_ACTIONS.FORGOT_PASSWORD_SUCCESS,
      payload:
        response.data?.message || "Password reset link sent successfully.",
    });
  } catch (error) {
    // Re-using the centralized error handler to manage toast notifications
    // and dispatching a failure action
    handleAuthError(error, dispatch);
  }
};

// NEW: Reset password with token
export const resetPassword = ({ token, newPassword }) => async (dispatch) => {
  dispatch({ type: AUTH_ACTIONS.RESET_PASSWORD_REQUEST });
  try {
    const response = await api.post(API_ENDPOINTS.RESET_PASSWORD, {
      token,
      newPassword
    });
    
    dispatch({
      type: AUTH_ACTIONS.RESET_PASSWORD_SUCCESS,
      payload: response.data?.message || "Password reset successfully."
    });
    
    return response.data;
  } catch (error) {
    // Use centralized error handler for consistency
    handleAuthError(error, dispatch);
    // Re-throw so component can handle navigation
    throw error;
  }
};

// Google OAuth Action
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

// Check Session Action

export const checkSession = () => async (dispatch, getState) => {
  const { isSessionChecking } = getState().auth;

  // Prevent multiple simultaneous checks
  if (isSessionChecking) {
    console.log("🔍 Session check already in progress, skipping...");
    return;
  }

  dispatch({ type: AUTH_ACTIONS.CHECK_SESSION_REQUEST });

  try {
    console.log("🔍 Checking session...");

    const response = await api.get(API_ENDPOINTS.VERIFY_SESSION);
    const { user, authProvider, lastLoginAt } = response.data;

    console.log("✅ Session check successful");

    dispatch({
      type: AUTH_ACTIONS.CHECK_SESSION_SUCCESS,
      payload: {
        user,
        authProvider,
        lastLoginAt,
      },
    });

    return { success: true, user, authProvider };
  } catch (error) {
    console.error("❌ Session check failed:", error);

    // Handle different error types
    const errorMessage =
      error.response?.data?.message || error.message || "Session expired";
    const statusCode = error.response?.status;

    dispatch({
      type: AUTH_ACTIONS.CHECK_SESSION_FAILURE,
      payload: errorMessage,
    });

    // If token is invalid/expired, clear auth state
    if (statusCode === 401) {
      dispatch(clearAuthState());
    }

    return { success: false, error: errorMessage };
  }
};

// Token refresh functionality
export const refreshToken = () => async (dispatch, getState) => {
  const { isRefreshing } = getState().auth;

  // Prevent multiple refresh attempts
  if (isRefreshing) {
    console.log("🔄 Token refresh already in progress, skipping...");
    return { success: false, error: "Refresh in progress" };
  }

  dispatch({ type: AUTH_ACTIONS.REFRESH_TOKEN_REQUEST });

  try {
    console.log("🔄 Refreshing token...");

    // Step 1: Call refresh endpoint. The refresh token should be in an HttpOnly cookie.
    const response = await api.post(API_ENDPOINTS.REFRESH_TOKEN); // Cookie is sent automatically
    const {
      user,
      token: newToken,
      tokenExpiry,
      // refreshToken: newRefreshToken // Only needed if using rotating refresh tokens
    } = response.data;

    console.log("✅ Token refreshed successfully");

    // Step 2: Update client state with the new access token
    dispatch({
      type: AUTH_ACTIONS.REFRESH_TOKEN_SUCCESS,
      payload: {
        user,
        token: newToken,
        tokenExpiry,
        // refreshToken: newRefreshToken,
      },
    });

    return { success: true, token: newToken };
  } catch (error) {
    console.error("❌ Token refresh failed:", error);

    const errorMessage =
      error.response?.data?.message || "Token refresh failed";

    dispatch({
      type: AUTH_ACTIONS.REFRESH_TOKEN_FAILURE,
      payload: errorMessage,
    });

    // If refresh fails, user needs to login again
    dispatch(clearAuthState());

    return { success: false, error: errorMessage };
  }
};

// Logout Action

export const logoutUser = () => async (dispatch) => {
  dispatch({ type: AUTH_ACTIONS.LOGOUT_REQUEST });

  try {
    // Clear server-side session (HttpOnly cookie)
    await api.post(API_ENDPOINTS.LOGOUT);
  } catch (error) {
    console.warn(
      "Logout API call failed, proceeding with client-side cleanup:",
      error
    );
    // Even if the API call fails, we must clear the client state.
  } finally {
    // Step 3: CRITICAL - Remove token from localStorage if it exists, but it shouldn't!
    // This is a cleanup step for an incorrect implementation.
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
    }

    // Dispatch success - this should reset the auth state
    dispatch({
      type: AUTH_ACTIONS.LOGOUT_SUCCESS,
      payload: { message: "Logged out successfully" },
    });
  }
};

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

//Initialize Auth State (call on app startup)

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
