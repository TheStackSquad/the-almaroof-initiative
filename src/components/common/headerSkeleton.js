// components/common/headerSkeleton.jsx
import React from "react";

const HeaderSkeleton = () => {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo skeleton */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div className="w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>

          {/* Navigation skeleton - Desktop */}
          <div className="hidden md:flex space-x-8">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-16 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
              ></div>
            ))}
          </div>

          {/* CTA Button skeleton */}
          <div className="hidden md:block w-24 h-9 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>

          {/* Mobile menu button skeleton */}
          <div className="md:hidden w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    </header>
  );
};

export default HeaderSkeleton;
