// src/components/forms/loadingState.js
import React, { memo } from "react";

const LoadingState = memo(({ type = "loading", message, subMessage }) => {
  const getContent = () => {
    switch (type) {
      case "authentication":
        return {
          title: "Checking Authentication",
          subtitle: "Please wait while we verify your session...",
          icon: (
            <svg
              className="w-8 h-8 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          ),
        };
      default:
        return {
          title: message || "Loading",
          subtitle: subMessage || "Please wait...",
          icon: (
            <svg
              className="w-8 h-8 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          ),
        };
    }
  };

  const content = getContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Animated loading circle */}
        <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20">
          <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            {content.icon}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            {content.title}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed px-4">
            {content.subtitle}
          </p>
        </div>

        {/* Loading dots animation */}
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

LoadingState.displayName = "LoadingState";

export default LoadingState;
