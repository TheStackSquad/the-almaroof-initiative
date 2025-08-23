// src/layoutProvider/authInitializer.js

"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkSession } from "@/redux/action/authAction";

export function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  // Get all necessary auth state values
  const { sessionChecked, isSessionChecking, sessionError, token } =
    useSelector((state) => state.auth);

  // Check if Redux persist has completed rehydration
  const isRehydrated = useSelector((state) => state._persist?.rehydrated);

  // Enhanced session check logic that handles various edge cases
  useEffect(() => {
    // Only proceed after rehydration is complete
    if (!isRehydrated) return;

    // Determine if we should check the session
    const shouldCheckSession =
      // Never checked before
      !sessionChecked ||
      // Previously checked but failed with an error and not currently checking
      (sessionChecked && sessionError && !isSessionChecking) ||
      // Has token but session not verified (edge case after direct token storage)
      (token && !sessionChecked && !isSessionChecking);

    if (shouldCheckSession) {
      console.log("🔄 AuthInitializer: Starting session check", {
        sessionChecked,
        sessionError: !!sessionError,
        hasToken: !!token,
        isSessionChecking,
      });
      dispatch(checkSession());
    } else {
      console.log("🔍 AuthInitializer: Skipping session check", {
        sessionChecked,
        sessionError: !!sessionError,
        hasToken: !!token,
        isSessionChecking,
      });
    }
  }, [
    isRehydrated,
    sessionChecked,
    sessionError,
    isSessionChecking,
    token,
    dispatch,
  ]);

  // Show loading screen until rehydration is complete
  if (!isRehydrated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Initializing application...
          </p>
        </div>
      </div>
    );
  }

  // Render children once rehydration is complete
  return children;
}
