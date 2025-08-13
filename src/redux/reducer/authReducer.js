// src/redux/reducer/authReducer.js

import { AUTH_ACTIONS, AUTH_INITIAL_STATE } from "../lib/constant";

const authReducer = (state = AUTH_INITIAL_STATE, action) => {
  switch (action.type) {
    // Traditional Signup
    case AUTH_ACTIONS.SIGNUP_REQUEST:
      return {
        ...state,
        isSignupLoading: true,
        isLoading: true,
        signupError: null,
        signupSuccess: false,
        error: null,
      };

    case AUTH_ACTIONS.SIGNUP_SUCCESS:
      return {
        ...state,
        isSignupLoading: false,
        isLoading: false,
        signupSuccess: true,
        signupError: null,
        error: null,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: !!action.payload.token,
        authProvider: action.payload.authProvider,
      };

    case AUTH_ACTIONS.SIGNUP_FAILURE:
      return {
        ...state,
        isSignupLoading: false,
        isLoading: false,
        signupSuccess: false,
        signupError: action.payload,
        error: action.payload,
      };

    // Traditional Signin
    case AUTH_ACTIONS.SIGNIN_REQUEST:
      return {
        ...state,
        isSigninLoading: true,
        isLoading: true,
        signinError: null,
        signinSuccess: false,
        error: null,
      };

    case AUTH_ACTIONS.SIGNIN_SUCCESS:
      return {
        ...state,
        isSigninLoading: false,
        isLoading: false,
        signinSuccess: true,
        signinError: null,
        error: null,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        authProvider: action.payload.authProvider,
        lastLoginAt: action.payload.lastLoginAt,
        sessionChecked: true,
      };

    case AUTH_ACTIONS.SIGNIN_FAILURE:
      return {
        ...state,
        isSigninLoading: false,
        isLoading: false,
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
        isLoading: true,
        googleAuthError: null,
        googleAuthSuccess: false,
        error: null,
      };

    case AUTH_ACTIONS.GOOGLE_AUTH_SUCCESS:
      return {
        ...state,
        isGoogleAuthLoading: false,
        isLoading: false,
        googleAuthSuccess: true,
        googleAuthError: null,
        error: null,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        authProvider: action.payload.authProvider,
        lastLoginAt: action.payload.lastLoginAt,
        sessionChecked: true,
      };

    case AUTH_ACTIONS.GOOGLE_AUTH_FAILURE:
      return {
        ...state,
        isGoogleAuthLoading: false,
        isLoading: false,
        googleAuthSuccess: false,
        googleAuthError: action.payload,
        error: action.payload,
        isAuthenticated: false,
        user: null,
        token: null,
      };

    // Session Management
    case AUTH_ACTIONS.CHECK_SESSION_REQUEST:
      return {
        ...state,
        isSessionChecking: true,
        sessionError: null,
      };

    case AUTH_ACTIONS.CHECK_SESSION_SUCCESS:
      return {
        ...state,
        isSessionChecking: false,
        sessionError: null,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        sessionChecked: true,
      };

    case AUTH_ACTIONS.CHECK_SESSION_FAILURE:
      return {
        ...state,
        isSessionChecking: false,
        sessionError: action.payload,
        isAuthenticated: false,
        user: null,
        token: null,
        sessionChecked: true,
      };

    // Profile Management
    case AUTH_ACTIONS.GET_PROFILE_REQUEST:
      return {
        ...state,
        isProfileLoading: true,
        profileError: null,
      };

    case AUTH_ACTIONS.GET_PROFILE_SUCCESS:
      return {
        ...state,
        isProfileLoading: false,
        profileError: null,
        user: action.payload.user,
      };

    case AUTH_ACTIONS.GET_PROFILE_FAILURE:
      return {
        ...state,
        isProfileLoading: false,
        profileError: action.payload,
      };

    case AUTH_ACTIONS.UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        isProfileLoading: true,
        profileError: null,
      };

    case AUTH_ACTIONS.UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        isProfileLoading: false,
        profileError: null,
        user: action.payload.user,
      };

    case AUTH_ACTIONS.UPDATE_PROFILE_FAILURE:
      return {
        ...state,
        isProfileLoading: false,
        profileError: action.payload,
      };

    // Logout
    case AUTH_ACTIONS.LOGOUT_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case AUTH_ACTIONS.LOGOUT_SUCCESS:
      return {
        ...AUTH_INITIAL_STATE,
        logoutSuccess: true,
        sessionChecked: true,
      };

    case AUTH_ACTIONS.LOGOUT_FAILURE:
      return {
        ...AUTH_INITIAL_STATE,
        error: action.payload,
        sessionChecked: true,
      };

    // Legacy Support
    case AUTH_ACTIONS.REQUEST_PASSCODE_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case AUTH_ACTIONS.REQUEST_PASSCODE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: !!action.payload.token,
      };

    case AUTH_ACTIONS.REQUEST_PASSCODE_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isAuthenticated: false,
        user: null,
        token: null,
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
        isLoading: action.payload,
      };

    case AUTH_ACTIONS.RESET_AUTH_STATE:
      return {
        ...AUTH_INITIAL_STATE,
        sessionChecked: true,
      };

    default:
      return state;
  }
};

export default authReducer;
