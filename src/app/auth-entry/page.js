// src/app/auth-entry/page.js

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useSelector } from "react-redux";
import UserForm from "@/components/common/user-login/useForm";
import SocialLogin from "@/components/common/user-login/socialLogin";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import { Spinner } from "@nextui-org/react";

function AuthEntryPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const redirectUrl =
    searchParams.get("redirect") || "/community/online-services";

  // Handle redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, isLoading, redirectUrl, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg mb-4">
            <ShieldCheckIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold font-montserrat text-gray-900 dark:text-gray-100 mb-2">
            Access Required
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
            Sign in to your account or create a new one to access our services
          </p>
        </div>

        {/* Main Auth Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* User Form (Traditional Auth) */}
          <UserForm redirectUrl={redirectUrl} />

          {/* Divider */}
          <div className="px-6 py-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-800 px-3 text-gray-500 dark:text-gray-400 font-medium">
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          {/* Social Login */}
          <div className="px-6 pb-6">
            <SocialLogin redirectUrl={redirectUrl} />
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

export default function AuthEntryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <AuthEntryPageContent />
    </Suspense>
  );
}