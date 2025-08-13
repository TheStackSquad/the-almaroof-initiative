// src/app/community/online-services/protected-route/page.js
"use client";

import { Button, Spinner } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect, Suspense } from "react";

function ProtectedPageContent() {
  const searchParams = useSearchParams();
  const redirectUrl =
    searchParams.get("redirect") || "/community/online-services";
  const { isAuthenticated, isLoading, error } = useSelector(
    (state) => state.auth
  );

  // Handle authenticated redirect
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      window.location.href = redirectUrl;
    }
  }, [isAuthenticated, isLoading, redirectUrl]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
        {error && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            Login failed: {error.message || "Please try again"}
          </div>
        )}

        <div className="text-center">
          <h1
            className="text-4xl font-extrabold text-gray-900 dark:text-white"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Access Our Online Services
          </h1>
          <p
            className="mt-4 text-gray-600 dark:text-gray-300 text-lg"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            To use our community services, please sign in or create an account.
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <Button
            as="a"
            href={`/auth-entry`}
            className="w-full text-lg font-bold py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Sign In
          </Button>
        </div>
      </div>
    </main>
  );
}

export default function ProtectedPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size="lg" />
        </div>
      }
    >
      <ProtectedPageContent />
    </Suspense>
  );
}