// src/components/community/local-services/ServiceCard.js

"use client";

import React from "react";
import { useServiceAuth } from "@/components/community/local-services/hooks/useServiceAuth";
import AuthLoadingOverlay from "@/components/community/local-services/authLoadingOverlay";
import ServiceCardHeader from "@/components/community/local-services/serviceCardHeader";
import ServiceCardDetails from "@/components/community/local-services/serviceCardDetails";
import ServiceCardActions from "@/components/community/local-services/serviceCardActions";

export default function ServiceCard({ service, onAction, isAuthenticated }) {
  const { authLoading, handleServiceClick } = useServiceAuth(isAuthenticated);

  // Handle service click wrapper
  const onServiceClick = (actionType) => {
    handleServiceClick(service, actionType, onAction);
  };

  return (
    <>
      {/* Beautiful Loading Overlay */}
      <AuthLoadingOverlay isVisible={authLoading} serviceName={service.name} />

      {/* Service Card */}
      <div
        className={`
          group rounded-xl overflow-hidden transition-all duration-300
          hover:scale-105 hover:-translate-y-2 border-2 cursor-pointer
          bg-white border-gray-100 hover:bg-gray-50 shadow-md hover:shadow-xl
          dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-750 dark:shadow-lg dark:hover:shadow-2xl
          ${authLoading ? "pointer-events-none opacity-75" : ""}
        `}
      >
        {/* Service Header */}
        <ServiceCardHeader service={service} />

        {/* Fees & Processing Time */}
        <ServiceCardDetails service={service} />

        {/* Online Services & Actions */}
        <ServiceCardActions
          service={service}
          authLoading={authLoading}
          onServiceClick={onServiceClick}
        />

        {/* Bottom Accent */}
        <div className="h-1 bg-gradient-to-r from-indigo-500 to-cyan-500"></div>
      </div>
    </>
  );
}
