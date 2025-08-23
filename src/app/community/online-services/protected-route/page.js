// src/app/community/online-services/protected-route/page.js

"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { checkSession } from "@/redux/action/authAction";
import SignInPrompt from "./components/signInPrompt";

function ProtectedRouteContent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  // Get auth state and rehydration status
  const authState = useSelector((state) => state.auth);
  const isRehydrated = useSelector((state) => state._persist?.rehydrated);

  const { isAuthenticated, sessionChecked, sessionError, isSessionChecking } =
    authState;

  // Enhanced debugging with cleaner logs
  useEffect(() => {
    console.log("🔍 ProtectedRoute State:", {
      isAuthenticated,
      sessionChecked,
      hasSessionError: !!sessionError,
      isSessionChecking,
      isRehydrated,
      timestamp: new Date().toISOString().split("T")[1].split(".")[0], // Show only time
    });
  }, [
    isAuthenticated,
    sessionChecked,
    sessionError,
    isSessionChecking,
    isRehydrated,
  ]);

  // Safe redirect URL extraction with fallback
  const getRedirectUrl = () => {
    try {
      const redirectParam = searchParams?.get("redirect");
      // Only allow relative URLs starting with '/' for security
      if (redirectParam?.startsWith("/")) {
        return redirectParam;
      }
      return "/community/services";
    } catch (e) {
      console.warn("Error parsing redirect URL:", e);
      return "/community/services";
    }
  };

  const safeRedirectUrl = getRedirectUrl();

  // Auto-redirect authenticated users to their intended destination
  useEffect(() => {
    if (isAuthenticated && sessionChecked && isRehydrated) {
      console.log("✅ Authenticated user - redirecting to:", safeRedirectUrl);
      router.push(safeRedirectUrl);
    }
  }, [isAuthenticated, sessionChecked, isRehydrated, router, safeRedirectUrl]);

  // Handle retry for session errors
  const handleRetry = () => {
    console.log("🔄 Retrying session check...");
    dispatch(checkSession());
  };

  // Determine loading state - simplified logic
  const isInitializing = !isRehydrated;
  const isCheckingSession =
    isSessionChecking || (!sessionChecked && !sessionError);

  // Show loading while initializing or checking session
  if (isInitializing) {
    return <GlobalLoader message="Initializing secure access..." />;
  }

  if (isCheckingSession) {
    return <GlobalLoader message="Verifying authentication..." />;
  }

  // Handle unauthenticated users or session errors
  if (!isAuthenticated || sessionError) {
    console.log("🔐 Showing SignIn:", {
      isAuthenticated,
      hasSessionError: !!sessionError,
    });

    return (
      <SignInPrompt
        redirectUrl={safeRedirectUrl}
        hasError={!!sessionError}
        error={sessionError ? { message: sessionError } : null}
        onRetry={sessionError ? handleRetry : undefined}
      />
    );
  }

  // Authenticated users should have been redirected by the useEffect above
  // This is a fallback that shows loading while redirect happens
  console.log("🔄 Authenticated - redirect in progress");
  return <GlobalLoader message="Redirecting to secure area..." />;
}

// Consistent loading component with proper styling
function GlobalLoader({ message = "Loading..." }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
          {message}
        </p>
      </div>
    </div>
  );
}

// Main component with Suspense boundary for useSearchParams
export default function ProtectedRoutePage() {
  return (
    <Suspense fallback={<GlobalLoader message="Loading secure access..." />}>
      <ProtectedRouteContent />
    </Suspense>
  );
}
