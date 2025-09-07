// src/app/community/online-services/protected-route/components/SignInPrompt.js

import { Button } from "@nextui-org/react";
import { LogIn, Shield, RefreshCw } from "lucide-react";
import Head from "next/head";

export default function SignInPrompt({
  redirectUrl,
  hasError,
  error,
  onRetry,
}) {
  const encodedRedirectUrl = encodeURIComponent(redirectUrl);
  const authEntryUrl = `/auth-entry?redirect=${encodedRedirectUrl}`;

  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <title>Sign In Required - Community Online Services</title>
        <meta
          name="description"
          content="Access our secure community online services. Sign in or create an account to continue with business permits, applications, and more."
        />
        <meta name="robots" content="noindex, nofollow" />
        <meta
          property="og:title"
          content="Sign In Required - Community Services"
        />
        <meta
          property="og:description"
          content="Secure access to community online services"
        />
        <link
          rel="canonical"
          href="/community/online-services/protected-route"
        />
      </Head>

      <main
        className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100 dark:bg-gray-900"
        role="main"
        aria-labelledby="signin-heading"
      >
        <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          {/* Error Alert */}
          {hasError && (
            <div
              className="p-4 mb-4 text-sm text-red-700 bg-red-100 dark:bg-red-900/20 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800"
              role="alert"
              aria-live="assertive"
            >
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 flex-shrink-0" />
                <div>
                  <strong className="font-medium">Authentication Error</strong>
                  <p className="mt-1">
                    {error?.message ||
                      "Unable to verify your session. Please sign in to continue."}
                  </p>
                </div>
              </div>

              {/* Retry button for errors */}
              <Button
                size="sm"
                variant="light"
                color="danger"
                onPress={onRetry}
                startContent={<RefreshCw className="w-3 h-3" />}
                className="mt-3 text-xs"
                aria-label="Retry authentication check"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Main Content */}
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>

            <h1
              id="signin-heading"
              className="text-4xl font-extrabold text-gray-900 dark:text-white"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Access Our Online Services
            </h1>

            <p
              className="mt-4 text-gray-600 dark:text-gray-300 text-lg"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              To use our community services, please sign in or create an
              account.
            </p>

            {/* Additional context for payment gateway access */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <Shield className="w-4 h-4 inline mr-1" />
                Secure access required for payment processing and sensitive
                services
              </p>
            </div>
          </div>

          {/* Sign In Button */}
          <div className="flex flex-col space-y-4">
            <Button
              as="a"
              href={authEntryUrl}
              size="lg"
              className="w-full text-lg font-bold py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800"
              style={{ fontFamily: "Montserrat, sans-serif" }}
              startContent={<LogIn className="w-5 h-5" />}
              aria-describedby="signin-description"
            >
              Sign In
            </Button>

            {/* Hidden description for screen readers */}
            <p id="signin-description" className="sr-only">
              Navigate to sign in page to authenticate and access community
              online services including business permits and applications
            </p>

            {/* Secondary actions */}
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Need help?{" "}
                <a
                  href="/support"
                  className="text-blue-600 dark:text-blue-400 hover:underline focus:underline focus:outline-none"
                  aria-label="Get help with signing in"
                >
                  Contact Support
                </a>
              </p>
            </div>
          </div>

          {/* Back Navigation */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="light"
              size="sm"
              onPress={() => window.history.back()}
              className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              aria-label="Go back to previous page"
            >
              ← Go Back
            </Button>
          </div>
        </div>

        {/* Footer for additional context */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md">
            Your session and payment information are protected with
            enterprise-grade security. All transactions are encrypted and
            monitored.
          </p>
        </div>
      </main>
    </>
  );
}
