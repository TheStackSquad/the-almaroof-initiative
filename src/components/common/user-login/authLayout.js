// src/components/common/user-login/authLayout.js
import React from "react";
import Image from "next/image";

const AuthLayout = ({ children, isSignUp }) => {
  const ctaContent = isSignUp
    ? {
        title: "Ready to start your journey?",
        description:
          "Create an account to get started with our amazing services and content.",
        imageSrc: "/img/signUp.webp",
        imageAlt: "Sign up illustration",
      }
    : {
        title: "Welcome back!",
        description:
          "Sign in to access your dashboard and continue where you left off.",
        imageSrc: "/img/sign-in.webp", // You would need a separate sign-in image
        imageAlt: "Sign in illustration",
      };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-0 m-0 transition-colors duration-300 w-full">
      <div className="w-full m-0">
        <div className="bg-white dark:bg-gray-800 lg:rounded-2xl lg:shadow-2xl overflow-hidden transition-all duration-300 w-full h-full lg:h-auto">
          <div className="flex flex-col lg:flex-row h-full lg:h-auto w-full">
            {/* Left side - Image and CTA */}
            <div className="w-full lg:w-1/2 relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-800 p-8 lg:p-12 flex items-center justify-center min-h-[40vh] lg:min-h-[auto]">
              <div className="text-center space-y-6 w-full max-w-md">
                <div className="w-48 h-48 lg:w-64 lg:h-64 mx-auto bg-gradient-to-br from-blue-200 to-purple-300 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                  <Image
                    src={ctaContent.imageSrc}
                    alt={ctaContent.imageAlt}
                    width={256}
                    height={256}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                <div className="space-y-4">
                  <h2 className="text-2xl lg:text-4xl font-bold text-gray-800 dark:text-gray-100 font-montserrat leading-tight">
                    {ctaContent.title}
                  </h2>
                  <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300 font-roboto leading-relaxed">
                    {ctaContent.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="w-full lg:w-1/2 p-6 lg:p-8 xl:p-12 flex items-center justify-center">
              <div className="w-full max-w-md">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;