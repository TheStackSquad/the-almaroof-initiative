// src/components/community/local-services/ServiceCardHeader.js

"use client";

import React from "react";
import { isEmergencyService } from "./utils/serviceHelpers";

const ServiceCardHeader = ({ service }) => {
  return (
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold font-montserrat text-lg text-indigo-600 dark:text-indigo-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
          {service.name}
        </h3>
        <div className="flex space-x-2">
          {service.hasOnlineOption && (
            <span className="px-2 py-1 text-xs font-roboto font-semibold bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
              Online Available
            </span>
          )}
          {isEmergencyService(service) && (
            <span className="px-2 py-1 text-xs font-roboto font-semibold bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full animate-pulse">
              24/7
            </span>
          )}
        </div>
      </div>

      <p className="text-sm font-roboto text-gray-600 dark:text-gray-400 mb-4">
        {service.description}
      </p>

      {/* Contact & Hours */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div>
          <span className="font-medium font-roboto text-gray-500 dark:text-gray-400">
            Contact:
          </span>
          <p className="font-roboto text-indigo-600 dark:text-indigo-400">
            {service.contact.phone}
          </p>
        </div>
        <div>
          <span className="font-medium font-roboto text-gray-500 dark:text-gray-400">
            Hours:
          </span>
          <p
            className={`font-roboto ${
              service.hours === "24/7"
                ? "text-green-600 dark:text-green-400 font-semibold"
                : ""
            }`}
          >
            {service.hours}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceCardHeader;
