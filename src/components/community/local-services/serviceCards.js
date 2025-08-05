// src/components/community/local-services/serviceCard.js

"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function ServiceCard({ service }) {
  const router = useRouter();

  const handleBadgeClick = (onlineService) => {
    // Example: "Apply for New Business Permit" → "apply"
    const formSlug = onlineService.toLowerCase().split(" ")[0]; // crude but works for now
    router.push(`/community/online-services/${service.id}/${formSlug}`);
  };

  return (
    <div
      className={`
        group rounded-xl overflow-hidden transition-all duration-300 
        hover:scale-105 hover:-translate-y-2 border-2 cursor-pointer
        bg-white border-gray-100 hover:bg-gray-50 shadow-md hover:shadow-xl
        dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-750 dark:shadow-lg dark:hover:shadow-2xl
      `}
    >
      {/* Service Header */}
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
            {service.category === "Emergency Services" && (
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

      {/* Fees & Processing Time */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="font-medium font-roboto text-gray-500 dark:text-gray-400">
              Processing Time:
            </span>
            <p className="font-semibold font-roboto text-cyan-600 dark:text-cyan-400">
              {service.processingTime}
            </p>
          </div>
          <div>
            <span className="font-medium font-roboto text-gray-500 dark:text-gray-400">
              Fees:
            </span>
            <p className="font-semibold font-roboto text-indigo-600 dark:text-indigo-400">
              {service.fees}
            </p>
          </div>
        </div>

        {/* Online Services Preview */}
        {service.hasOnlineOption && (
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <span className="text-xs font-medium font-roboto text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Available Online:
            </span>
            <div className="flex flex-wrap gap-1 mt-2">
              {service.onlineServices.slice(0, 3).map((onlineService, idx) => (
                <span
                  key={idx}
                  onClick={() => handleBadgeClick(onlineService)}
                  className="px-2 py-1 text-xs font-roboto bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded cursor-pointer hover:underline"
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
          </div>
        )}
      </div>

      {/* Bottom Accent */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 to-cyan-500"></div>
    </div>
  );
}
