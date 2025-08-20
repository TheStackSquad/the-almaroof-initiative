// src/app/community/online-services/[...params]/page.js

import { redirect } from "next/navigation";
import Link from "next/link";
import { RouteValidator } from "@/utils/route/routeValidator";
import ServicePageWrapper from "@/components/community/service-pages/servicePageWrapper";

// Import all service components
import BusinessPermitApply from "@/components/community/service-pages/businessPermitApply";
import TaxPayment from "@/components/community/service-pages/taxPayment";
import BirthCertificateRegister from "@/components/community/service-pages/birthCertificateRegister";
import MarriageCertificateRegister from "@/components/community/service-pages/marriageCertificateRegister";
import DeathCertificateRegister from "@/components/community/service-pages/deathCertificateRegister";
import LandDocumentationVerify from "@/components/community/service-pages/landDocumentationVerify";
import PrimaryHealthcareBook from "@/components/community/service-pages/primaryHealthcareBook";
import WasteManagementSchedule from "@/components/community/service-pages/wasteManagementSchedule";
import WaterSewageApply from "@/components/community/service-pages/waterSewageApply";
import RoadMaintenanceReport from "@/components/community/service-pages/roadMaintenanceReport";
import PoliceReport from "@/components/community/service-pages/policeReport";

// Component mapping
const COMPONENT_MAP = {
  BusinessPermitApply,
  TaxPayment,
  BirthCertificateRegister,
  MarriageCertificateRegister,
  DeathCertificateRegister,
  LandDocumentationVerify,
  PrimaryHealthcareBook,
  WasteManagementSchedule,
  WaterSewageApply,
  RoadMaintenanceReport,
  PoliceReport,
};

/**
 * Utility function to safely resolve and validate params
 */
function resolveAndValidateParams(params) {
  try {
    console.log("Raw params received by page:", params);

    let routeParams = [];

    if (params && Array.isArray(params.params)) {
      // Correct structure for catch-all routes
      routeParams = params.params;
    } else if (Array.isArray(params)) {
      // Fallback: if params is already an array
      routeParams = params;
    } else {
      console.error("Unexpected params structure:", params);
      throw new Error("Invalid route parameters structure");
    }

    console.log("Extracted routeParams for validation:", routeParams);

    const validator = new RouteValidator(routeParams);
    const validation = validator.validate();

    return { validation, error: null };
  } catch (error) {
    console.error("Error resolving params:", error);
    return {
      validation: {
        isValid: false,
        error: "Failed to process route parameters",
        redirectTo: "/community/services",
      },
      error: error.message,
    };
  }
}

/**
 * Error fallback component
 */
function ServiceErrorFallback({
  error,
  redirectPath = "/community/online-services",
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          Oops! Something went wrong
        </h1>
        <p className="text-gray-600 mb-6">
          {error || "We encountered an error while loading this service."}
        </p>
        <div className="space-y-3">
          <Link
            href={redirectPath}
            className="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Services
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="block w-full text-blue-600 hover:text-blue-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Dynamic Service Page Handler
 * Handles all routes: /community/online-services/[serviceId]/[actionId]
 */
export default function ServicePage({ params }) {
  // Safely resolve and validate params with error handling
  const { validation, error } = resolveAndValidateParams(params);

  // Handle critical errors
  if (error) {
    return <ServiceErrorFallback error={error} />;
  }

  // Handle redirects for invalid or incomplete routes
  if (!validation.isValid && validation.redirectTo) {
    redirect(validation.redirectTo);
  }

  // Handle completely invalid routes
  if (!validation.isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            Service Not Found
          </h1>
          <p className="text-gray-600 mb-4">{validation.error}</p>
          <Link
            href="/community/services"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  // Get the component to render with error handling
  const componentName = validation.actionConfig?.component;

  if (!componentName) {
    return (
      <ServiceErrorFallback error="Service configuration is missing component information" />
    );
  }

  const ServiceComponent = COMPONENT_MAP[componentName];

  if (!ServiceComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            Component Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            Component &apos;{componentName}&apos; is not implemented yet.
          </p>
          <Link
            href="/community/online-services"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  // Render the service component wrapped in the common layout with error boundary
  try {
    return (
      <ServicePageWrapper
        serviceConfig={validation.serviceConfig}
        actionConfig={validation.actionConfig}
        serviceId={validation.serviceId}
        actionId={validation.actionId}
      >
        <ServiceComponent
          serviceId={validation.serviceId}
          actionId={validation.actionId}
          serviceConfig={validation.serviceConfig}
          actionConfig={validation.actionConfig}
        />
      </ServicePageWrapper>
    );
  } catch (renderError) {
    console.error("Error rendering service component:", renderError);
    return <ServiceErrorFallback error="Failed to render service component" />;
  }
}

/**
 * Generate metadata for SEO - FIXED AND ENHANCED
 */
export async function generateMetadata({ params }) {
  try {
    // Safely resolve and validate params
    const { validation, error } = resolveAndValidateParams(params);

    // Handle errors or invalid routes
    if (error || !validation.isValid) {
      return {
        title: "Service Not Found | Oshodi-Isolo LGA",
        description: "The requested service could not be found",
        robots: "noindex, nofollow", // Prevent indexing of error pages
      };
    }

    // Generate metadata for valid routes
    return {
      title: `${
        validation.actionConfig?.title || "Service"
      } | Oshodi-Isolo LGA`,
      description:
        validation.actionConfig?.description ||
        "Oshodi-Isolo LGA online service",
      keywords: `${validation.serviceConfig?.displayName}, Oshodi-Isolo, LGA, online services`,
      openGraph: {
        title: `${validation.actionConfig?.title} | Oshodi-Isolo LGA`,
        description: validation.actionConfig?.description,
        type: "website",
      },
    };
  } catch (metadataError) {
    console.error("Error generating metadata:", metadataError);
    // Return fallback metadata
    return {
      title: "Oshodi-Isolo LGA | Online Services",
      description:
        "Access online services for Oshodi-Isolo Local Government Area",
      robots: "noindex, nofollow",
    };
  }
}

/**
 * Generate static params for build optimization - ENHANCED
 */
export async function generateStaticParams() {
  try {
    const routes = RouteValidator.getAllValidRoutes();
    return routes
      .map((route) => {
        const parts = route.split("/").filter(Boolean);
        // Remove 'community' and 'online-services' to get the params array
        const routeParams = parts.slice(2);
        return {
          params: routeParams.length > 0 ? routeParams : [""], // Ensure params is never empty
        };
      })
      .filter((route) => route.params.length > 0); // Filter out empty routes
  } catch (staticError) {
    console.error("Error generating static params:", staticError);
    // Return empty array to prevent build failures
    return [];
  }
}
