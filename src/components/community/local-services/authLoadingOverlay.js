// src/components/community/local-services/AuthLoadingOverlay.js

"use client";

import React from "react";

const AuthLoadingOverlay = ({ isVisible, serviceName }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blur Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300" />

      {/* Loading Content */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mx-4 max-w-sm w-full animate-in zoom-in duration-300">
        <div className="text-center">
          {/* Animated Loading Icon */}
          <div className="relative mb-6">
            <div className="w-16 h-16 mx-auto">
              <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
              <div
                className="absolute inset-2 border-2 border-transparent border-t-cyan-500 rounded-full animate-spin animate-reverse"
                style={{ animationDuration: "1.5s" }}
              ></div>
            </div>
          </div>

          {/* Loading Text */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Checking Authentication
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Verifying your session...
          </p>

          {/* Service Info */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-3">
            <div className="text-xs font-medium text-blue-800 dark:text-blue-200 uppercase tracking-wide">
              Accessing Service
            </div>
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1">
              {serviceName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLoadingOverlay;
