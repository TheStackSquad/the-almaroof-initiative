// src/components/community/local-services/ServiceCard.js

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/utils/auth/useAuth";
import { RouteValidator } from "@/utils/route/routeValidator";
import AuthLoadingOverlay from "@/components/community/local-services/authLoadingOverlay";
import ServiceCardHeader from "@/components/community/local-services/serviceCardHeader";
import ServiceCardDetails from "@/components/community/local-services/serviceCardDetails";
import ServiceCardActions from "@/components/community/local-services/serviceCardActions";

export default function ServiceCard({ service }) {
  const router = useRouter();

  // Step 1: Replace useServiceAuth with enhanced useAuth hook
  const { isReady, requireAuth, shouldAutoRefresh } = useAuth();

  // Step 2: Calculate unified loading state based on authentication readiness
  const authLoading = !isReady || shouldAutoRefresh;

  // Step 3: Implement clean service navigation with RouteValidator integration
  const handleServiceClick = () => {
    console.log("🚀 Service access requested for:", service.name);

    // Step 4: Prevent navigation if authentication state is not ready
    if (!isReady || shouldAutoRefresh) {
      console.log("⏳ Authentication not ready, waiting...");
      return;
    }

    // Step 5: Generate target service URL using RouteValidator
    const serviceUrl = RouteValidator.generateServiceUrl(service.id);

    // Step 6: Use enhanced requireAuth with automatic redirect enabled
    const authCheck = requireAuth({
      redirectTo: `/community/online-services/protected-route?redirect=${encodeURIComponent(
        serviceUrl
      )}`,
      autoRedirect: true, // Enable automatic redirection
    });

    // Step 7: Handle navigation based on authentication status
    if (authCheck.authorized) {
      console.log("✅ Authenticated - Direct navigation to:", serviceUrl);
      router.push(serviceUrl);
    } else if (authCheck.redirected) {
      console.log("🔀 Not authenticated - Automatic redirect performed");
      // Redirect was automatically handled by requireAuth
    } else {
      console.log("⚠️ Authentication check failed without redirect");
      // Fallback - manual redirect (shouldn't happen with autoRedirect: true)
      router.push(
        `/community/online-services/protected-route?redirect=${encodeURIComponent(
          serviceUrl
        )}`
      );
    }
  };

  return (
    <>
      {/* Step 8: Show loading overlay during authentication state transitions */}
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

        {/* Step 9: Pass simplified click handler to actions component */}
        <ServiceCardActions
          service={service}
          authLoading={authLoading}
          onServiceClick={handleServiceClick}
        />

        <div className="h-1 bg-gradient-to-r from-indigo-500 to-cyan-500"></div>
      </div>
    </>
  );
}
