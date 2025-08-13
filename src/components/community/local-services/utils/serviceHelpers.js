// src/components/community/local-services/utils/serviceHelpers.js

export const getServiceUrl = (service, actionType) => {
  if (actionType === "online") {
    // For business permits, redirect to apply page
    if (
      service.id === "business-permits" ||
      service.name.toLowerCase().includes("business permit")
    ) {
      return "/community/online-services/business-permit/apply/";
    }

    // For other services, use generic pattern
    const formSlug =
      service.onlineServices[0]?.toLowerCase().split(" ")[0] || "service";
    return `/community/online-services/${service.id}/${formSlug}`;
  }
  return "";
};

export const generateLoginUrl = (targetUrl) => {
  return `/community/online-services/protected-route?redirect=${encodeURIComponent(
    targetUrl
  )}`;
};

export const isEmergencyService = (service) => {
  return service.category === "Emergency Services";
};

export const is24HourService = (service) => {
  return service.hours === "24/7";
};
