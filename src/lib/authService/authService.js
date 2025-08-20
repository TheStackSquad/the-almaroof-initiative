// src/lib/authService/authService.js (Updated for Redux Integration)

"use client";

import {
  validateSignupForm,
  validateSigninForm,
  validateGoogleAuthData,
  sanitizeAuthInput,
} from "@/utils/validate/authSchemas";

export const signupWithCredentials = async (userData, dispatch) => {
  try {
    // Import Redux action dynamically to avoid circular imports
    const { signupUser } = await import("@/redux/action/authAction");

    // Validate form data
    const validation = validateSignupForm(userData);
    if (!validation.isValid) {
      const errorMessage = Object.values(validation.errors)[0];
      throw new Error(errorMessage);
    }

    // Sanitize input data
    const sanitizedData = {
      username: sanitizeAuthInput(validation.cleanData.username),
      email: sanitizeAuthInput(validation.cleanData.email),
      phone: sanitizeAuthInput(validation.cleanData.phone),
      password: validation.cleanData.password, // Don't sanitize password
    };

    // Dispatch Redux action
    const result = await dispatch(signupUser(sanitizedData));

    return {
      success: true,
      user: result.user,
      token: result.token,
      message: result.message || "Account created successfully",
    };
  } catch (error) {
    console.error("Signup error:", error);
    throw new Error(error.message || "Account creation failed");
  }
};

export const signinWithCredentials = async (credentials, dispatch) => {
  try {
    // Import Redux action dynamically
    const { signinUser } = await import("@/redux/action/authAction");

    // Validate form data
    const validation = validateSigninForm(credentials);
    if (!validation.isValid) {
      const errorMessage = Object.values(validation.errors)[0];
      throw new Error(errorMessage);
    }

    // Sanitize input data
    const sanitizedData = {
      email: sanitizeAuthInput(validation.cleanData.email),
      password: validation.cleanData.password, // Don't sanitize password
    };

    // Dispatch Redux action
    const result = await dispatch(signinUser(sanitizedData));

    return {
      success: true,
      user: result.user,
      token: result.token,
      message: result.message || "Signed in successfully",
    };
  } catch (error) {
    console.error("Signin error:", error);
    throw new Error(error.message || "Sign in failed");
  }
};

export const authenticateWithGoogle = async (googleData, dispatch) => {
  try {
    // Import Redux action dynamically
    const { authenticateWithGoogle: googleAuthAction } = await import(
      "@/redux/action/authAction"
    );

    // Validate Google data
    const validation = validateGoogleAuthData(googleData);
    if (!validation.isValid) {
      throw new Error(`Invalid Google data: ${validation.errors.join(", ")}`);
    }

    // Dispatch Redux action
    const result = await dispatch(googleAuthAction(validation.cleanData));

    return {
      success: true,
      user: result.user,
      token: result.token,
      isNewUser: result.isNewUser || false,
      message: result.message || "Google authentication successful",
    };
  } catch (error) {
    console.error("Google auth error:", error);
    throw new Error(error.message || "Google authentication failed");
  }
};

export const checkSession = async (dispatch) => {
  try {
    // Import Redux action dynamically
    const { checkSession: checkSessionAction } = await import(
      "@/redux/action/authAction"
    );

    // Dispatch Redux action
    const result = await dispatch(checkSessionAction());

    return {
      success: result.type === "auth/checkSessionSuccess",
      user: result.user,
      isValid: result.type === "auth/checkSessionSuccess",
    };
  } catch (error) {
    console.error("Session check error:", error);
    return {
      success: false,
      isValid: false,
      message: error.message,
    };
  }
};

export const logout = async (dispatch) => {
  try {
    // Import Redux action dynamically
    const { logoutUser } = await import("@/redux/action/authAction");

    // Dispatch Redux action
    await dispatch(logoutUser());

    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error) {
    console.error("Logout error:", error);

    return {
      success: true, // Still consider it successful as local data is cleared
      message: "Logged out successfully",
    };
  }
};

export const getCurrentUser = async (dispatch) => {
  try {
    // Import Redux action dynamically
    const { getUserProfile } = await import("@/redux/action/authAction");

    // Dispatch Redux action
    const result = await dispatch(getUserProfile());

    return {
      success: true,
      user: result.user,
    };
  } catch (error) {
    console.error("Get current user error:", error);
    throw new Error(error.message || "Failed to fetch user profile");
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem("auth_token");
};

// Get stored user data
export const getStoredUserData = () => {
  const userData = localStorage.getItem("user_data");
  return userData ? JSON.parse(userData) : null;
};

// Get auth token
export const getAuthToken = () => {
  return localStorage.getItem("auth_token");
};

// Clear auth token
export const clearAuthToken = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_data");
};

// Store user data
export const storeUserData = (userData) => {
  localStorage.setItem("user_data", JSON.stringify(userData));
};

// Export all auth service functions
export const authService = {
  signupWithCredentials,
  signinWithCredentials,
  authenticateWithGoogle,
  checkSession,
  logout,
  getCurrentUser,
  isAuthenticated,
  getStoredUserData,
  storeUserData,
  getAuthToken,
  clearAuthToken,
};
