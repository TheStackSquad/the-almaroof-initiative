// src/components/community/local-services/ServiceCard.js
"use client";

import React from "react";
import { useServiceAuth } from "@/components/community/local-services/hooks/useServiceAuth";
import AuthLoadingOverlay from "@/components/community/local-services/authLoadingOverlay";
import ServiceCardHeader from "@/components/community/local-services/serviceCardHeader";
import ServiceCardDetails from "@/components/community/local-services/serviceCardDetails";
import ServiceCardActions from "@/components/community/local-services/serviceCardActions";

// 1. REMOVE the `onAction` prop. It is no longer needed.
export default function ServiceCard({ service }) {
  // 2. The hook manages auth state internally via Redux, so remove the `isAuthenticated` prop.
  const { authLoading, handleServiceClick } = useServiceAuth();

  // 3. SIMPLIFY the click handler. No more `actionType`.
  const onServiceClick = () => {
    // 4. Only pass the service object to the hook's handler.
    handleServiceClick(service);
  };

  return (
    <>
      <AuthLoadingOverlay isVisible={authLoading} serviceName={service.name} />
      <div
        className={`
          group rounded-xl overflow-hidden transition-all duration-300
          hover:scale-105 hover:-translate-y-2 border-2 cursor-pointer
          bg-white border-gray-100 hover:bg-gray-50 shadow-md hover:shadow-xl
          dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-750 dark:shadow-lg dark:hover:shadow-2xl
          ${authLoading ? "pointer-events-none opacity-75" : ""}
        `}
      >
        <ServiceCardHeader service={service} />
        <ServiceCardDetails service={service} />
        {/* 5. Pass the simplified click handler (no arguments) */}
        <ServiceCardActions
          service={service}
          authLoading={authLoading}
          onServiceClick={onServiceClick}
        />
        <div className="h-1 bg-gradient-to-r from-indigo-500 to-cyan-500"></div>
      </div>
    </>
  );
}
