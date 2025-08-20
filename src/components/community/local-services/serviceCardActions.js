// src/components/community/local-services/ServiceCardActions.js

"use client";

import React from "react";

const ServiceCardActions = ({ service, authLoading, onServiceClick }) => {
  if (!service.hasOnlineOption) {
    return null;
  }

  return (
    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900">
      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
        <span className="text-xs font-medium font-roboto text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Available Online:
        </span>
        <div className="flex flex-wrap gap-1 mt-2">
          {/* Show the services as non-clickable tags */}
          {service.onlineServices.slice(0, 3).map((onlineService, idx) => (
            <span
              key={idx}
              // REMOVE THE ONCLICK
              className="px-2 py-1 text-xs font-roboto bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded" // REMOVE 'cursor-pointer' and 'hover' styles
            >
              {onlineService}
            </span>
          ))}
          {/* ... 'more' tag ... */}
        </div>

        {/* NEW: Single Action Button */}
        <button
          onClick={onServiceClick} // Now called without an argument
          disabled={authLoading}
          className="w-full mt-4 py-3 px-4 text-sm font-montserrat font-medium rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {authLoading ? "Checking Access..." : "Access Service"}
        </button>
      </div>
    </div>
  );
};

export default ServiceCardActions;
