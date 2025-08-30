// src/app/community/online-services/protected-route/page.js

"use client";

import { Suspense, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/utils/auth/useAuth";
import SignInPrompt from "./components/signInPrompt";

function ProtectedRouteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Enhanced auth hook with zero-flashing capabilities
  const {
    isReady,
    isSecurelyAuthenticated,
    shouldAutoRefresh,
    errorContext,
    hasError,
    needsLogin,
    user,
    manualRefresh,
  } = useAuth();

  // SECURITY: Safe redirect URL validation (government standard)
  const getRedirectUrl = useCallback(() => {
    try {
      const redirectParam = searchParams?.get("redirect");

      // Strict validation for government app
      if (redirectParam?.startsWith("/")) {
       const isAllowedPath = (path) => {
         // Allow broader community and user areas
         const allowedPrefixes = [
           "/community/",
           "/community/services",
           "/community/online-services",
         ];

         // Block sensitive areas
         const blockedPrefixes = ["/admin/", "/api/", "/debug/", "/internal/"];

         return (
           allowedPrefixes.some((prefix) => path.startsWith(prefix)) &&
           !blockedPrefixes.some((prefix) => path.startsWith(prefix))
         );
       };

        if (isAllowedPath) {
          return redirectParam;
        }
      }

      // Fallback to safe default
      return "/community/services";
    } catch (e) {
      console.warn("🚨 Security: Invalid redirect URL detected:", e);
      return "/community/services";
    }
  }, [searchParams]);

  const safeRedirectUrl = getRedirectUrl();

  // Enhanced debugging for government app
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("🔐 ProtectedRoute Security Check:", {
        isReady,
        isSecurelyAuthenticated,
        shouldAutoRefresh,
        needsLogin,
        hasError,
        errorType: errorContext?.type,
        userId: user?.id?.substring(0, 8) + "...", // Partial ID for debugging
        timestamp: new Date().toISOString().split("T")[1].split(".")[0],
      });
    }
  }, [
    isReady,
    isSecurelyAuthenticated,
    shouldAutoRefresh,
    needsLogin,
    hasError,
    errorContext,
    user,
  ]);

  // SECURITY: Handle automatic redirect on successful authentication
  useEffect(() => {
    if (isReady && isSecurelyAuthenticated && !shouldAutoRefresh) {
      console.log("✅ Security cleared - redirecting to:", safeRedirectUrl);
      router.push(safeRedirectUrl);
    }
  }, [
    isReady,
    isSecurelyAuthenticated,
    shouldAutoRefresh,
    router,
    safeRedirectUrl,
  ]);

  // SECURITY: Handle token refresh retry
  const handleRetry = useCallback(async () => {
    if (!shouldAutoRefresh) return;

    console.log("🔄 User requested auth retry");
    try {
      const result = await manualRefresh();
      if (!result.success) {
        console.error("🚨 Manual refresh failed:", result.error);
      }
    } catch (error) {
      console.error("🚨 Token refresh failed in protected route:", error);
    }
  }, [shouldAutoRefresh, manualRefresh]);

  // ===== RENDER LOGIC - Zero Page Flashing =====

  // 1. LOADING: Still determining auth state
  if (!isReady) {
    return <SecureLoader message="Initializing secure access..." />;
  }

  // 2. REFRESHING: Updating credentials automatically
  if (shouldAutoRefresh) {
    return <SecureLoader message="Updating security credentials..." />;
  }

  // 3. EXPIRED/NEEDS LOGIN: Clear authentication required
  if (needsLogin) {
    const isExpired = errorContext?.type === "expired";

    console.log(
      isExpired
        ? "🚨 Security: Token expired - requiring re-authentication"
        : "🔐 Security: Authentication required"
    );

    return (
      <SignInPrompt
        redirectUrl={safeRedirectUrl}
        hasError={isExpired || hasError}
        error={errorContext ? { message: errorContext.message } : null}
        onRetry={errorContext?.recoverable ? handleRetry : undefined}
        securityLevel={isExpired ? "high" : "standard"}
      />
    );
  }

  // 4. ERROR STATE: Something went wrong
  if (hasError && !isSecurelyAuthenticated) {
    console.log("🔐 Security: Authentication error");

    return (
      <SignInPrompt
        redirectUrl={safeRedirectUrl}
        hasError={true}
        error={{ message: errorContext.message }}
        onRetry={errorContext.recoverable ? handleRetry : undefined}
        securityLevel="standard"
      />
    );
  }

  // 5. AUTHENTICATED: Show loading while redirect processes
  if (isSecurelyAuthenticated) {
    return <SecureLoader message="Accessing secure area..." />;
  }

  // 6. FALLBACK: Unknown state - secure by default
  console.warn("🚨 Unknown authentication state - defaulting to secure");
  return (
    <SignInPrompt
      redirectUrl={safeRedirectUrl}
      hasError={true}
      error={{ message: "Authentication status unclear. Please sign in." }}
      securityLevel="high"
    />
  );
}

// Government-grade loading component with security messaging
function SecureLoader({ message = "Loading..." }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center max-w-md">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-transparent rounded-full animate-spin animate-reverse"></div>
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
          {message}
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-xs">
          🔒 Secure Government Portal
        </p>
      </div>
    </div>
  );
}

// Main component with enhanced error boundary
export default function ProtectedRoutePage() {
  return (
    <Suspense
      fallback={
        <SecureLoader message="Loading secure authentication system..." />
      }
    >
      <ProtectedRouteContent />
    </Suspense>
  );
}
