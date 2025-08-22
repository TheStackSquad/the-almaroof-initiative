// src/app/community/online-services/protected-route/page.js
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SignInPrompt from "./components/signInPrompt";

// Move the main page logic into a component that uses useSearchParams
function ProtectedRouteContent() {
  const searchParams = useSearchParams();

  // Extract and validate the redirect URL
  const getRedirectUrl = () => {
    try {
      const unsafeRedirectUrl = searchParams.get("redirect");
      let finalUrl = "/community/services"; // Default fallback

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
      return finalUrl;
    } catch (e) {
      console.warn("Invalid redirect URL format, using default");
      return "/community/services";
    }
  };

  const safeRedirectUrl = getRedirectUrl();

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

  // Render the SignInPrompt with the correct redirect URL
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
