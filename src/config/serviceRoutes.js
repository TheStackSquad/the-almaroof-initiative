// src/config/serviceRoutes.js

/**
 * Service Routes Configuration
 * Maps service IDs to their routing patterns, components, and requirements
 */

export const serviceRoutes = {
  // Online-First Services
  "business-permit": {
    primaryAction: "apply",
    category: "online-first-services",
    displayName: "Business Permit",
    actions: {
      apply: {
        component: "BusinessPermitApply",
        requiresAuth: true,
        title: "Apply for Business Permit",
        description: "Start your business permit application",
      },
      renew: {
        component: "BusinessPermitRenew",
        requiresAuth: true,
        title: "Renew Business Permit",
        description: "Renew your existing business permit",
      },
    },
  },

  "tax-payment": {
    primaryAction: "pay",
    category: "online-first-services",
    displayName: "Tax Payment",
    actions: {
      pay: {
        component: "TaxPayment",
        requiresAuth: true,
        title: "Pay Taxes",
        description: "Make tax payments online",
      },
    },
  },

  "birth-certificate": {
    primaryAction: "register",
    category: "online-first-services",
    displayName: "Birth Certificate",
    actions: {
      register: {
        component: "BirthCertificateRegister",
        requiresAuth: true,
        title: "Register Birth Certificate",
        description: "Register a new birth certificate",
      },
    },
  },

  // Administrative Services
  "marriage-certificate": {
    primaryAction: "register",
    category: "administrative-services",
    displayName: "Marriage Certificate",
    actions: {
      register: {
        component: "MarriageCertificateRegister",
        requiresAuth: true,
        title: "Register Marriage Certificate",
        description: "Register your marriage certificate",
      },
    },
  },

  "death-certificate": {
    primaryAction: "register",
    category: "administrative-services",
    displayName: "Death Certificate",
    actions: {
      register: {
        component: "DeathCertificateRegister",
        requiresAuth: true,
        title: "Register Death Certificate",
        description: "Register a death certificate",
      },
    },
  },

  "land-documentation": {
    primaryAction: "verify",
    category: "administrative-services",
    displayName: "Land Documentation",
    actions: {
      verify: {
        component: "LandDocumentationVerify",
        requiresAuth: true,
        title: "Verify Land Documentation",
        description: "Verify land ownership and documentation",
      },
    },
  },

  // Utilities & Infrastructure
  "primary-healthcare": {
    primaryAction: "book",
    category: "utilities-infrastructure",
    displayName: "Primary Healthcare",
    actions: {
      book: {
        component: "PrimaryHealthcareBook",
        requiresAuth: true,
        title: "Book Healthcare Appointment",
        description: "Book an appointment at primary healthcare centers",
      },
    },
  },

  "waste-management": {
    primaryAction: "schedule",
    category: "utilities-infrastructure",
    displayName: "Waste Management",
    actions: {
      schedule: {
        component: "WasteManagementSchedule",
        requiresAuth: true,
        title: "Schedule Waste Pickup",
        description: "Schedule waste collection services",
      },
    },
  },

  "water-sewage": {
    primaryAction: "apply",
    category: "utilities-infrastructure",
    displayName: "Water & Sewage",
    actions: {
      apply: {
        component: "WaterSewageApply",
        requiresAuth: true,
        title: "Apply for Water Connection",
        description: "Apply for water and sewage services",
      },
    },
  },

  "road-maintenance": {
    primaryAction: "report",
    category: "utilities-infrastructure",
    displayName: "Road Maintenance",
    actions: {
      report: {
        component: "RoadMaintenanceReport",
        requiresAuth: true,
        title: "Report Road Issues",
        description: "Report road maintenance issues",
      },
    },
  },

  // Emergency Services (these might redirect to external systems or modal)
  "makinde-police": {
    primaryAction: "report",
    category: "emergency-services",
    displayName: "Makinde Police Division",
    actions: {
      report: {
        component: "PoliceReport",
        requiresAuth: true,
        title: "Report Crime Online",
        description: "Report crimes or incidents online",
      },
    },
  },
};

/**
 * Get service configuration by ID
 */
export const getServiceConfig = (serviceId) => {
  return serviceRoutes[serviceId] || null;
};

/**
 * Get action configuration for a service
 */
export const getActionConfig = (serviceId, actionId) => {
  const service = getServiceConfig(serviceId);
  return service?.actions?.[actionId] || null;
};

/**
 * Get primary action for a service
 */
export const getPrimaryAction = (serviceId) => {
  const service = getServiceConfig(serviceId);
  return service?.primaryAction || null;
};

/**
 * Check if a route is valid
 */
export const isValidRoute = (serviceId, actionId) => {
  const actionConfig = getActionConfig(serviceId, actionId);
  return actionConfig !== null;
};

/**
 * Get all available services
 */
export const getAllServices = () => {
  return Object.keys(serviceRoutes);
};

/**
 * Get services by category
 */
export const getServicesByCategory = (category) => {
  return Object.entries(serviceRoutes)
    .filter(([_, config]) => config.category === category)
    .map(([serviceId]) => serviceId);
};
