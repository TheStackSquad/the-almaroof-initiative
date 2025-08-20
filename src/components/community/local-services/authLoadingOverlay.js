// src/components/community/local-services/authLoadingOverlay.js

"use client";

import React from "react";

const AuthLoadingOverlay = ({ isVisible, serviceName }) => {
  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out"
      aria-live="polite"
      aria-label="Loading"
    >
      {/* Semi-transparent, animated backdrop for a modern feel */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Main content card with a subtle pulsing animation */}
      <div
        className="relative flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-sm w-full transform animate-in zoom-in-50 ease-out-back duration-500"
        style={{
          animation: "pulse-subtle 2s infinite cubic-bezier(0.4, 0, 0.6, 1)",
        }}
      >
        {/* CSS for a subtle pulse animation */}
        <style jsx>{`
          @keyframes pulse-subtle {
            0%,
            100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.02);
            }
          }
        `}</style>

        {/* Animated Loading Icon */}
        <div className="relative mb-6">
          <div className="w-16 h-16 mx-auto">
            {/* A single, elegant spinner with a gradient effect */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 border-r-indigo-500 animate-spin-fast" />
          </div>
        </div>

        {/* Loading Text */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
          Verifying Session
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
          Please wait while we check your authentication.
        </p>

        {/* Service Info with an updated gradient */}
        {serviceName && (
          <div className="w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 rounded-xl p-4 mt-4">
            <div className="text-xs font-semibold text-indigo-800 dark:text-indigo-200 uppercase tracking-wide mb-1">
              Accessing Service
            </div>
            <div className="text-md font-bold text-gray-900 dark:text-white truncate">
              {serviceName}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthLoadingOverlay;
