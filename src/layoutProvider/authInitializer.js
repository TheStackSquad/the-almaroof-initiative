// src/layoutProvider/authInitializer.js

"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkSession, refreshToken } from "@/redux/action/authAction";

export function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  // Get essential auth state values
  const { sessionChecked, isSessionChecking, token, tokenExpiry } = useSelector(
    (state) => state.auth
  );

  // Check if Redux persist has completed rehydration
  const isRehydrated = useSelector((state) => state._persist?.rehydrated);

  // Session check logic - much cleaner
  useEffect(() => {
    // Wait for rehydration to complete
    if (!isRehydrated) return;

    // Only check session if we haven't checked and aren't currently checking
    if (!sessionChecked && !isSessionChecking) {
      console.log("🔄 AuthInitializer: Starting session check");
      dispatch(checkSession());
    }
  }, [isRehydrated, sessionChecked, isSessionChecking, dispatch]);

  // Token refresh logic - separate concern
  useEffect(() => {
    if (!isRehydrated || !token || !tokenExpiry) return;

    // Calculate time until token expires
    const expiryTime = new Date(tokenExpiry).getTime();
    const currentTime = Date.now();
    const timeUntilExpiry = expiryTime - currentTime;
    const refreshThreshold = 5 * 60 * 1000; // 5 minutes before expiry

    // If token expires soon, refresh it
    if (timeUntilExpiry <= refreshThreshold && timeUntilExpiry > 0) {
      console.log("🔄 AuthInitializer: Token expiring soon, refreshing...");
      dispatch(refreshToken());
      return;
    }

    // Set up automatic refresh timer
    if (timeUntilExpiry > refreshThreshold) {
      const refreshTimer = setTimeout(() => {
        console.log("⏰ AuthInitializer: Auto-refreshing token");
        dispatch(refreshToken());
      }, timeUntilExpiry - refreshThreshold);

      // Cleanup timer
      return () => clearTimeout(refreshTimer);
    }
  }, [isRehydrated, token, tokenExpiry, dispatch]);

  // Show loading screen only during initial rehydration
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

  // Once rehydrated, render children immediately
  // No more waiting for session checks
  return children;
}
