// src/app/community/online-services/protected-route/hooks/useAuthGuard.js

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { checkSession } from "@/redux/action/authAction";
import { showToast } from "@/components/common/toastAlert/toast";

const AUTH_TIMEOUT = 10000; // 10 seconds
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 2000; // 2 seconds between retries

export const useAuthGuard = (redirectUrl) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const timeoutRef = useRef(null);
  const retryTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  // Local state for enhanced control
  const [authState, setAuthState] = useState({
    isChecking: false,
    hasTimedOut: false,
    retryAttempt: 0,
    shouldShowSignIn: false,
    hasSessionCheckStarted: false,
  });

  // Redux state
  const { isAuthenticated, isLoading, sessionChecked, error } = useSelector(
    (state) => state.auth
  );

  // Cleanup function
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  // Handle successful authentication
  const handleAuthSuccess = useCallback(() => {
    if (!isMountedRef.current) return;

    cleanup();
    setAuthState((prev) => ({ ...prev, isChecking: false }));

    // Graceful redirect with small delay for UX
    setTimeout(() => {
      if (isMountedRef.current) {
        router.replace(redirectUrl);
      }
    }, 500);
  }, [redirectUrl, router, cleanup]);

  // Handle authentication failure
  const handleAuthFailure = useCallback(() => {
    if (!isMountedRef.current) return;

    cleanup();
    setAuthState((prev) => ({
      ...prev,
      isChecking: false,
      shouldShowSignIn: true,
      hasTimedOut: false,
    }));
  }, [cleanup]);

  // Handle session check with timeout and retry
  const performSessionCheck = useCallback(
    async (attemptNumber = 1) => {
      if (!isMountedRef.current) return;

      setAuthState((prev) => ({
        ...prev,
        isChecking: true,
        retryAttempt: attemptNumber,
        hasTimedOut: false,
        hasSessionCheckStarted: true,
      }));

      // Set timeout for this attempt
      timeoutRef.current = setTimeout(() => {
        if (!isMountedRef.current) return;

        setAuthState((prev) => ({ ...prev, hasTimedOut: true }));

        if (attemptNumber < MAX_RETRY_ATTEMPTS) {
          showToast(
            `Connection timeout. Retrying... (${attemptNumber}/${MAX_RETRY_ATTEMPTS})`,
            "warn"
          );

          // Schedule retry
          retryTimeoutRef.current = setTimeout(() => {
            performSessionCheck(attemptNumber + 1);
          }, RETRY_DELAY);
        } else {
          // Max retries reached
          showToast(
            "Unable to verify authentication. Please check your connection and try signing in.",
            "error"
          );
          handleAuthFailure();
        }
      }, AUTH_TIMEOUT);

      // Dispatch the session check
      try {
        dispatch(checkSession());
      } catch (err) {
        console.error("Session check dispatch failed:", err);
        if (isMountedRef.current) {
          setAuthState((prev) => ({ ...prev, hasTimedOut: true }));
          handleAuthFailure();
          showToast("Authentication check failed. Please try again.", "error");
        }
      }
    },
    [dispatch, handleAuthFailure]
  );

  // Main authentication effect
  useEffect(() => {
    // Don't run if we've already started the process
    if (authState.hasSessionCheckStarted) return;

    // If session hasn't been checked yet, start the process
    if (!sessionChecked) {
      performSessionCheck();
    } else if (sessionChecked && isAuthenticated) {
      // Session already checked and user is authenticated
      handleAuthSuccess();
    } else if (sessionChecked && !isAuthenticated) {
      // Session already checked and user is NOT authenticated
      handleAuthFailure();
    }
  }, [
    sessionChecked,
    isAuthenticated,
    performSessionCheck,
    handleAuthSuccess,
    handleAuthFailure,
    authState.hasSessionCheckStarted,
  ]);

  // Handle Redux state changes (successful auth check)
  useEffect(() => {
    // Only proceed if we've started checking and haven't timed out
    if (!authState.hasSessionCheckStarted || authState.hasTimedOut) return;

    if (sessionChecked && !isLoading) {
      cleanup(); // Clear any pending timeouts

      if (isAuthenticated) {
        handleAuthSuccess();
      } else {
        handleAuthFailure();
      }
    }
  }, [
    sessionChecked,
    isAuthenticated,
    isLoading,
    authState.hasSessionCheckStarted,
    authState.hasTimedOut,
    handleAuthSuccess,
    handleAuthFailure,
    cleanup,
  ]);

  // Handle Redux errors
  useEffect(() => {
    if (error && authState.hasSessionCheckStarted) {
      cleanup();
      setAuthState((prev) => ({ ...prev, isChecking: false }));

      if (authState.retryAttempt < MAX_RETRY_ATTEMPTS) {
        showToast(
          `Authentication error. Retrying... (${authState.retryAttempt}/${MAX_RETRY_ATTEMPTS})`,
          "warn"
        );

        retryTimeoutRef.current = setTimeout(() => {
          performSessionCheck(authState.retryAttempt + 1);
        }, RETRY_DELAY);
      } else {
        showToast(
          "Authentication service unavailable. Please try signing in manually.",
          "error"
        );
        handleAuthFailure();
      }
    }
  }, [
    error,
    authState.hasSessionCheckStarted,
    authState.retryAttempt,
    performSessionCheck,
    handleAuthFailure,
    cleanup,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  // Computed loading state
  const isPageLoading =
    (isLoading || !sessionChecked || authState.isChecking) &&
    !authState.shouldShowSignIn;

  // Manual retry function for user-triggered retries
  const retryAuth = useCallback(() => {
    setAuthState({
      isChecking: false,
      hasTimedOut: false,
      retryAttempt: 0,
      shouldShowSignIn: false,
      hasSessionCheckStarted: false,
    });
    performSessionCheck(1);
  }, [performSessionCheck]);

  return {
    isPageLoading,
    shouldShowSignIn: authState.shouldShowSignIn,
    isRetrying: authState.retryAttempt > 0,
    retryAttempt: authState.retryAttempt,
    hasError: !!error,
    error,
    retryAuth,
    redirectUrl,
  };
};
