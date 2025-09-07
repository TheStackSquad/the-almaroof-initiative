//src/app/auth-entry/reset-password/page.js

"use client";

import { Suspense } from "react";
import ResetPassword from "@/components/common/user-login/resetPassword";

// Loading component
const ResetPasswordLoading = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
};

// Reset Password Page Component
const ResetPasswordPage = () => {
  return (
    <>
      <style jsx>{`
        /* Montserrat for headings */
        @font-face {
          font-family: "Montserrat";
          src: url("/fonz/MontserratAlternates-Bold.woff") format("woff");
          font-weight: 700;
          font-style: normal;
          font-display: swap;
        }
        /* Roboto for body text */
        @font-face {
          font-family: "Roboto";
          src: url("/fonz/RobotoSlab-Bold.woff") format("woff");
          font-weight: 700;
          font-style: normal;
          font-display: swap;
        }
      `}</style>

      <Suspense fallback={<ResetPasswordLoading />}>
        <ResetPassword />
      </Suspense>
    </>
  );
};

export default ResetPasswordPage;
