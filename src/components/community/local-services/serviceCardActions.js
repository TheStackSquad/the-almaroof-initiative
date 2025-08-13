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
          {service.onlineServices.slice(0, 3).map((onlineService, idx) => (
            <span
              key={idx}
              onClick={() => onServiceClick("online")}
              className="px-2 py-1 text-xs font-roboto bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              {onlineService}
            </span>
          ))}
          {service.onlineServices.length > 3 && (
            <span className="px-2 py-1 text-xs font-roboto bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
              +{service.onlineServices.length - 3} more
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onServiceClick("online")}
            disabled={authLoading}
            className="flex-1 py-2 px-4 text-sm font-montserrat font-medium rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {authLoading ? "Checking..." : "Apply Online"}
          </button>
          <button
            onClick={() => onServiceClick("details")}
            disabled={authLoading}
            className="px-4 py-2 text-sm font-montserrat font-medium rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCardActions;
