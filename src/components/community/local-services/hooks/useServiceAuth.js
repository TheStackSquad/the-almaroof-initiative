// src/components/community/local-services/hooks/useServiceAuth.js

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { checkSession } from "@/redux/action/authAction";
import { RouteValidator } from "@/utils/route/routeValidator";

export const useServiceAuth = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [authLoading, setAuthLoading] = useState(false);

  // Get all necessary auth state from Redux
  const {
    isAuthenticated,
    isLoading,
    isSessionChecking,
    sessionChecked,
    sessionError,
    token,
  } = useSelector((state) => state.auth);

  // Debug logging
  useEffect(() => {
    console.log("🔍 Auth State Update:", {
      isAuthenticated,
      isLoading,
      isSessionChecking,
      sessionChecked,
      sessionError,
      hasToken: !!token,
    });
  }, [
    isAuthenticated,
    isLoading,
    isSessionChecking,
    sessionChecked,
    sessionError,
    token,
  ]);

  // Modern auth check with beautiful loading state
  const handleAuthenticatedAction = async (service, actionType) => {
    console.log("🚀 handleAuthenticatedAction called:", {
      actionType,
      isAuthenticated,
      sessionChecked,
    });

    // Show beautiful loading overlay
    setAuthLoading(true);

    try {
      // If session hasn't been checked yet, check it
      if (!sessionChecked && !isSessionChecking) {
        console.log("📡 Dispatching checkSession...");
        await dispatch(checkSession());
      }

      // Small delay for smooth UX (prevents flash)
      await new Promise((resolve) => setTimeout(resolve, 500));

      // After the delay, check auth state
      if (isAuthenticated) {
        console.log("✅ User authenticated, proceeding to service");
        handleDirectAction(service, actionType);
      } else {
        console.log("❌ User not authenticated, redirecting to login");
        const targetUrl = RouteValidator.generateServiceUrl(
          service.id,
          actionType
        );
        const loginUrl = RouteValidator.generateLoginUrl(targetUrl);
        console.log("🔀 Redirecting to:", loginUrl);
        router.push(loginUrl);
      }
    } catch (error) {
      console.error("💥 Auth check failed:", error);
      const targetUrl = RouteValidator.generateServiceUrl(
        service.id,
        actionType
      );
      const loginUrl = RouteValidator.generateLoginUrl(targetUrl);
      console.log("🔀 Error redirect to:", loginUrl);
      router.push(loginUrl);
    } finally {
      setAuthLoading(false);
    }
  };

  // Direct action for authenticated users
  const handleDirectAction = (service, actionType) => {
    console.log("🎯 handleDirectAction:", { actionType });

    if (actionType === "details") {
      return { type: "details", service };
    } else if (actionType === "online") {
      const targetUrl = RouteValidator.generateServiceUrl(
        service.id,
        actionType
      );
      console.log("🌐 Navigating to:", targetUrl);
      router.push(targetUrl);
    }
  };

  // Handle clicks with auth check
  const handleServiceClick = (service, actionType, onAction) => {
    console.log("👆 Service clicked:", { service: service.name, actionType });

    if (actionType === "details" && typeof onAction === "function") {
      onAction(service, actionType);
    } else {
      handleAuthenticatedAction(service, actionType);
    }
  };

  return {
    authLoading,
    isAuthenticated,
    handleServiceClick,
    handleAuthenticatedAction,
    handleDirectAction,
  };
};