// src/app/community/online-services/[...params]/page.js

import { redirect } from "next/navigation";
import Link from "next/link"; // Import Link component
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
 * Dynamic Service Page Handler
 * Handles all routes: /community/online-services/[serviceId]/[actionId]
 */
export default function ServicePage({ params }) {
  const validator = new RouteValidator(params.params);
  const validation = validator.validate();

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
          {/* Fix: Replaced <a> with <Link> */}
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

  // Get the component to render
  const componentName = validation.actionConfig.component;
  const ServiceComponent = COMPONENT_MAP[componentName];

  if (!ServiceComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            Component Not Found
          </h1>
          {/* Fix: Escaped the apostrophes */}
          <p className="text-gray-600 mb-4">
            Component &apos;{componentName}&apos; is not implemented yet.
          </p>
          {/* Fix: Replaced <a> with <Link> */}
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

  // Render the service component wrapped in the common layout
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
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }) {
  const validator = new RouteValidator(params.params);
  const metadata = validator.getPageMetadata();

  return {
    title: `${metadata.title} | Oshodi-Isolo LGA`,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: "website",
    },
  };
}

/**
 * Generate static params for build optimization (optional)
 * Uncomment if you want to pre-generate common routes
 */
// export async function generateStaticParams() {
//  const routes = RouteValidator.getAllValidRoutes();
//  return routes.map(route => {
//    const parts = route.split('/').filter(Boolean);
//    return {
//      params: parts.slice(2) // Remove 'community' and 'online-services'
//    };
//  });
// }
