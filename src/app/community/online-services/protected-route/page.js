// src/app/community/online-services/protected-route/page.js
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SignInPrompt from "./components/signInPrompt";

// Move the main page logic into a component that uses useSearchParams
function ProtectedRouteContent() {
  const searchParams = useSearchParams();
  const [debugInfo, setDebugInfo] = useState({});
  const [isClient, setIsClient] = useState(false);

  // Track client-side mounting
  useEffect(() => {
    setIsClient(true);

    // Debug information
    const debug = {
      hasSearchParams: !!searchParams,
      redirectParam: searchParams?.get("redirect"),
      fullUrl: typeof window !== "undefined" ? window.location.href : "server",
      userAgent:
        typeof navigator !== "undefined"
          ? navigator.userAgent.includes("Chrome")
          : "server",
      environment: process.env.NODE_ENV,
    };

    console.log("Debug info:", debug);
    setDebugInfo(debug);
  }, [searchParams]);

  // Extract and validate the redirect URL
  const getRedirectUrl = () => {
    try {
      const unsafeRedirectUrl = searchParams?.get("redirect");
      let finalUrl = "/community/services"; // Default fallback

      console.log("Raw redirect param:", unsafeRedirectUrl);

      if (unsafeRedirectUrl) {
        const url = new URL(unsafeRedirectUrl, window.location.origin);
        if (url.origin === window.location.origin) {
          finalUrl = url.pathname + url.search + url.hash;
        } else {
          console.warn(
            "Blocked redirect to external domain:",
            unsafeRedirectUrl
          );
        }
      }

      console.log("Final redirect URL:", finalUrl);
      return finalUrl;
    } catch (e) {
      console.error("Error processing redirect URL:", e);
      return "/community/services";
    }
  };

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return <GlobalLoader message="Initializing..." />;
  }

  const safeRedirectUrl = getRedirectUrl();

  // Show debug info in development or when there are issues
  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV !== "production"
  ) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Debug Information</h2>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded mb-4">
          <pre className="text-sm overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
        <div className="mb-4">
          <p className="font-semibold">
            Redirect URL:{" "}
            <span className="font-mono bg-yellow-200 px-2 py-1 rounded">
              {safeRedirectUrl}
            </span>
          </p>
        </div>
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Component Render:</h3>
          <SignInPrompt redirectUrl={safeRedirectUrl} />
        </div>
      </div>
    );
  }

  // All authentication logic is commented out to force rendering the SignInPrompt.
  // const router = useRouter();
  // const { isAuthenticated, isLoading, sessionChecked } = useSelector(
  //   (state) => state.auth
  // );
  // const isRehydrated = useSelector((state) => state._persist?.rehydrated);
  // const [isValidatingUrl, setIsValidatingUrl] = useState(true);

  // useEffect(() => {
  //   if (isRehydrated && sessionChecked && isAuthenticated) {
  //     console.log("User authenticated. Redirecting to:", safeRedirectUrl);
  //     router.push(safeRedirectUrl);
  //   }
  // }, [isAuthenticated, sessionChecked, isRehydrated, router, safeRedirectUrl]);

  // if (!isRehydrated) {
  //   return <GlobalLoader message="Loading application..." />;
  // }

  // if (!sessionChecked || isLoading) {
  //   return <GlobalLoader message="Checking your session..." />;
  // }

  // if (!isAuthenticated) {
  //   return <SignInPrompt redirectUrl={safeRedirectUrl} />;
  // }

  // return <GlobalLoader message="Redirecting to service..." />;

  // Production rendering - Render the SignInPrompt with the correct redirect URL
  return <SignInPrompt redirectUrl={safeRedirectUrl} />;
}

// A simple loading component
function GlobalLoader({ message = "Loading..." }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{message}</p>
      </div>
    </div>
  );
}

// The main page export now wraps the content in Suspense
export default function ProtectedRoutePage() {
  return (
    // This Suspense boundary satisfies Next.js's requirement for useSearchParams
    <Suspense fallback={<GlobalLoader message="Loading secure access..." />}>
      <ProtectedRouteContent />
    </Suspense>
  );
}
