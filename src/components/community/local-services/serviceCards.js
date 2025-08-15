// src/components/community/local-services/ServiceCard.js

"use client";

import React from "react";
// Import the custom hook that encapsulates the authentication logic.
import { useServiceAuth } from "@/components/community/local-services/hooks/useServiceAuth";
// Import the component that displays a loading overlay during the auth check.
import AuthLoadingOverlay from "@/components/community/local-services/authLoadingOverlay";
import ServiceCardHeader from "@/components/community/local-services/serviceCardHeader";
import ServiceCardDetails from "@/components/community/local-services/serviceCardDetails";
import ServiceCardActions from "@/components/community/local-services/serviceCardActions";

export default function ServiceCard({ service, onAction, isAuthenticated }) {
  // Call the custom hook to get the necessary state and functions for the auth flow.
  // 'authLoading' is a state that is true while the authentication check is running.
  // 'handleServiceClick' is the function that performs the auth check and then redirects.
  const { authLoading, handleServiceClick } = useServiceAuth(isAuthenticated);

  // This is a wrapper function for handleServiceClick. It ensures the correct parameters are passed.
  const onServiceClick = (actionType) => {
    // This is the core logic: it calls the hook's function to check auth before proceeding.
    handleServiceClick(service, actionType, onAction);
  };

  return (
    <>
      {/* This component shows a loading overlay, visible only when authLoading is true. */}
      <AuthLoadingOverlay isVisible={authLoading} serviceName={service.name} />

      {/* Service Card */}
      <div
        className={`
          group rounded-xl overflow-hidden transition-all duration-300
          hover:scale-105 hover:-translate-y-2 border-2 cursor-pointer
          bg-white border-gray-100 hover:bg-gray-50 shadow-md hover:shadow-xl
          dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-750 dark:shadow-lg dark:hover:shadow-2xl
          // This conditional class disables pointer events on the card and lowers its opacity
          // when the authentication check is in progress, preventing double-clicks.
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
          // The authLoading state is passed down so the actions component can also
          // visually indicate a loading state or disable buttons.
          authLoading={authLoading}
          onServiceClick={onServiceClick}
        />

        {/* Bottom Accent */}
        <div className="h-1 bg-gradient-to-r from-indigo-500 to-cyan-500"></div>
      </div>
    </>
  );
}
