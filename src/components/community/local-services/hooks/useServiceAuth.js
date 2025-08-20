// src/components/community/local-services/hooks/useServiceAuth.js
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { checkSession } from "@/redux/action/authAction";
import { RouteValidator } from "@/utils/route/routeValidator";

export const useServiceAuth = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [authLoading, setAuthLoading] = useState(false);

  // Get the current state from Redux for initial checks and rendering
  const { isAuthenticated, isSessionChecking, sessionChecked } = useSelector(
    (state) => state.auth
  );

  const handleServiceClick = useCallback(
    async (service) => {
      console.log("🚀 Service access requested for:", service.name);

      // 1. Show loading state immediately
      setAuthLoading(true);

      try {
        let finalAuthState = { isAuthenticated, sessionChecked }; // Start with current state

        // 2. If we might need a session check, perform it and UPDATE our local state variable.
        if (!sessionChecked && !isSessionChecking) {
          console.log("📡 Dispatching checkSession...");
          // Wait for the checkSession action to complete. This updates the Redux store.
          const resultAction = await dispatch(checkSession());

          // Check if the session check was successful and update our local logic state.
          // We analyze the result action to determine the new auth state.
          if (checkSession.fulfilled.match(resultAction)) {
            finalAuthState = {
              isAuthenticated: true,
              sessionChecked: true,
            };
          } else {
            // session check failed or user is not authenticated
            finalAuthState = {
              isAuthenticated: false,
              sessionChecked: true,
            };
          }
        } else {
          // If no new check was needed, use the state from the closure (latest from useSelector on this render)
          finalAuthState = { isAuthenticated, sessionChecked };
        }

        console.log("🔎 Final auth state for routing:", finalAuthState);

        // 3. Make routing decision with the determined state.
        if (finalAuthState.isAuthenticated) {
          console.log("✅ User authenticated. Generating service URL...");
          const targetUrl = RouteValidator.generateServiceUrl(service.id);
          console.log("🌐 Navigating to:", targetUrl);
          router.push(targetUrl);
        } else {
          console.log("❌ User not authenticated. Redirecting to login...");
          const targetUrl = RouteValidator.generateServiceUrl(service.id);
          const loginRedirectUrl = RouteValidator.generateLoginUrl(targetUrl);
          console.log("🔀 Redirecting to:", loginRedirectUrl);
          router.push(loginRedirectUrl);
        }
      } catch (error) {
        console.error(
          "💥 An unexpected error occurred during service access:",
          error
        );
        // For any other unexpected error during the process, redirect to login as a fallback.
        const targetUrl = RouteValidator.generateServiceUrl(service.id);
        const loginRedirectUrl = RouteValidator.generateLoginUrl(targetUrl);
        router.push(loginRedirectUrl);
      } finally {
        // 4. Always turn off loading.
        setAuthLoading(false);
      }
    },
    [dispatch, router, isAuthenticated, isSessionChecking, sessionChecked]
  ); // All state values are dependencies

  return {
    authLoading,
    handleServiceClick,
  };
};