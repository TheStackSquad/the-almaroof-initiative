//src/data/localServicesData.js

export const localServicesData = {
  emergencyServices: [
    {
      id: "makinde-police",
      name: "Makinde Police Division",
      category: "Emergency Services",
      priority: 1,
      contact: {
        phone: "+234-803-123-4567",
        email: "makinde.police@lagosstate.gov.ng"
      },
      address: "Makinde Street, Mafoluku, Oshodi, Lagos",
      coordinates: { lat: 6.5244, lng: 3.3792 },
      hours: "24/7",
      status: "Available",
      description: "Full-service police station handling criminal matters, complaints, and emergency response.",
      onlineServices: ["Report Crime Online", "Police Report Request"],
      processingTime: "Immediate for emergencies",
  //    requirements: "Valid ID for visits, incident details for reports",
      fees: "Free for emergencies",
      hasOnlineOption: true
    },
    {
      id: "akinpelu-police",
      name: "Akinpelu Police Division",
      category: "Emergency Services",
      priority: 1,
      contact: {
        phone: "+234-803-123-4568",
        email: "akinpelu.police@lagosstate.gov.ng"
      },
      address: "Akinpelu Street, Bolade, Oshodi-Isolo",
      coordinates: { lat: 6.5150, lng: 3.3420 },
      hours: "24/7",
      status: "Available",
      description: "Community policing and crime prevention services.",
      onlineServices: ["Report Crime Online", "Police Report Request"],
      processingTime: "Immediate for emergencies",
      // requirements: "Valid ID, incident details",
      fees: "Free for emergencies",
      hasOnlineOption: true
    },
    {
      id: "mosafejo-police",
      name: "Mosafejo Police Division",
      category: "Emergency Services", 
      priority: 1,
      contact: {
        phone: "+234-803-123-4569",
        email: "mosafejo.police@lagosstate.gov.ng"
      },
      address: "Mosafejo Street, beside LASTMA Office, Oshodi-Isolo, Lagos",
      coordinates: { lat: 6.5300, lng: 3.3500 },
      hours: "24/7",
      status: "Available",
      description: "Traffic and general police services.",
      onlineServices: ["Traffic Report", "Police Report Request"],
      processingTime: "Immediate for emergencies",
      // requirements: "Valid ID",
     fees: "Free for emergencies",
      hasOnlineOption: true
    },
    {
      id: "shogunle-police",
      name: "Shogunle Police Division",
      category: "Emergency Services",
      priority: 1,
      contact: {
        phone: "+234-803-123-4570",
        email: "shogunle.police@lagosstate.gov.ng"
      },
      address: "Shogunle Street, by Oshodi Bus Stop, Oshodi-Isolo, Lagos",
      coordinates: { lat: 6.5280, lng: 3.3450 },
      hours: "24/7", 
      status: "Available",
      description: "General police services and community safety.",
      onlineServices: ["Report Crime Online", "Police Report Request"],
      processingTime: "Immediate for emergencies",
      // requirements: "Valid ID",
     fees: "Free for emergencies",
      hasOnlineOption: true
    }
  ],

  onlineFirstServices: [
    {
      id: "business-permit",
      name: "Business Permit Registration",
      category: "Online-First Services",
      priority: 1,
      contact: {
        phone: "+234-803-123-4571",
        email: "permits@oshodi-isolo.gov.ng"
      },
      address: "Oshodi-Isolo LGA Secretariat, Oshodi, Lagos",
      coordinates: { lat: 6.5244, lng: 3.3792 },
      hours: "9:00 AM - 3:00 PM (Mon-Fri)",
      status: "Available",
      description: "Register new businesses, renew permits, business name registration - now available online!",
      onlineServices: [
        "Apply for New Business Permit",
        "Renew Existing Permit",
        "Check Application Status",
        "Download Certificate",
        "Pay Fees Online"
      ],
      processingTime: "3-5 business days online, 7-10 days in-person",
      requirements: "Business plan, valid ID, proof of address, CAC certificate",
      fees: "₦15,000 - ₦50,000 (pay online for 10% discount)",
      hasOnlineOption: true
    },
    {
      id: "tax-payment",
      name: "Tax Payment & Assessment",
      category: "Online-First Services",
      priority: 1,
      contact: {
        phone: "+234-803-123-4572", 
        email: "tax@oshodi-isolo.gov.ng"
      },
      address: "Oshodi-Isolo LGA Tax Office, Oshodi, Lagos",
      coordinates: { lat: 6.5200, lng: 3.3750 },
      hours: "8:00 AM - 4:00 PM (Mon-Fri)",
      status: "Available",
      description: "Pay personal income tax, property tax, and get tax clearance certificates online.",
      onlineServices: [
        "Pay Income Tax Online",
        "Property Tax Payment", 
        "Download Tax Clearance",
        "Tax Assessment Appeal",
        "Payment History"
      ],
      processingTime: "Instant online payment, 24-48 hours for certificates",
      requirements: "Valid ID, TIN number, property documents (for property tax)",
      fees: "Varies by income/property value (online payment saves time)",
      hasOnlineOption: true
    },
    {
      id: "birth-certificate",
      name: "Birth Certificate Registration",
      category: "Online-First Services", 
      priority: 1,
      contact: {
        phone: "+234-803-123-4573",
        email: "registry@oshodi-isolo.gov.ng"
      },
      address: "Oshodi-Isolo Registry Office, Oshodi, Lagos",
      coordinates: { lat: 6.5150, lng: 3.3800 },
      hours: "9:00 AM - 3:00 PM (Mon-Fri)",
      status: "Available",
      description: "Register births and obtain certificates online - skip the queue!",
      onlineServices: [
        "Apply for Birth Certificate",
        "Correct Birth Certificate",
        "Track Application Status",
        "Download Certificate",
        "Pay Processing Fees"
      ],
      processingTime: "5-7 days online, 14-21 days in-person",
      requirements: "Hospital birth record, parents' ID, marriage certificate",
      fees: "₦3,000 online, ₦5,000 in-person",
      hasOnlineOption: true
    }
  ],

  utilitiesInfrastructure: [
    {
      id: "primary-healthcare",
      name: "Primary Healthcare Centers",
      category: "Utilities & Infrastructure",
      priority: 2,
      contact: {
        phone: "+234-803-123-4574",
        email: "health@oshodi-isolo.gov.ng"
      },
      address: "Multiple locations across Oshodi-Isolo LGA",
      coordinates: { lat: 6.5244, lng: 3.3792 },
      hours: "8:00 AM - 4:00 PM (Mon-Fri), Emergency 24/7",
      status: "Available",
      description: "Maternal health, child immunization, family planning, and basic medical services.",
      onlineServices: [
        "Book Appointment Online",
        "Download Health Records",
        "Vaccination Schedule",
        "Antenatal Registration"
      ],
      processingTime: "Same day for appointments, instant for records",
      requirements: "Health insurance card or payment, valid ID",
      fees: "₦500 - ₦2,000 per consultation",
      hasOnlineOption: true
    },
    {
      id: "waste-management",
      name: "Waste Management Services",
      category: "Utilities & Infrastructure",
      priority: 2,
      contact: {
        phone: "+234-803-123-4575",
        email: "waste@oshodi-isolo.gov.ng"
      },
      address: "Oshodi-Isolo Environmental Office, Lagos",
      coordinates: { lat: 6.5300, lng: 3.3700 },
      hours: "24/7 Collection Service",
      status: "Available",
      description: "Household waste collection, recycling programs, and environmental services.",
      onlineServices: [
        "Schedule Waste Pickup",
        "Report Missed Collection",
        "Pay Waste Bills Online",
        "Request Recycling Service"
      ],
      processingTime: "24-48 hours for pickup requests",
      requirements: "Property address verification",
      fees: "₦1,500 monthly for households, ₦5,000+ for businesses",
      hasOnlineOption: true
    },
    {
      id: "water-sewage",
      name: "Water & Sewage Services",
      category: "Utilities & Infrastructure",
      priority: 2,
      contact: {
        phone: "+234-803-123-4576",
        email: "water@oshodi-isolo.gov.ng"
      },
      address: "Oshodi-Isolo Water Works, Lagos",
      coordinates: { lat: 6.5180, lng: 3.3650 },
      hours: "8:00 AM - 5:00 PM (Mon-Fri), Emergency 24/7",
      status: "Available",
      description: "Water supply connections, sewage services, and pipeline maintenance.",
      onlineServices: [
        "Apply for Water Connection",
        "Report Water Issues",
        "Pay Water Bills",
        "Request Maintenance"
      ],
      processingTime: "3-5 days for connections, 24 hours for repairs",
      requirements: "Property ownership proof, application fee",
      fees: "₦25,000 connection fee, monthly bills vary",
      hasOnlineOption: true
    },
    {
      id: "road-maintenance",
      name: "Road Maintenance & Infrastructure",
      category: "Utilities & Infrastructure",
      priority: 3,
      contact: {
        phone: "+234-803-123-4577",
        email: "roads@oshodi-isolo.gov.ng"
      },
      address: "Oshodi-Isolo Works Department, Lagos",
      coordinates: { lat: 6.5220, lng: 3.3680 },
      hours: "8:00 AM - 5:00 PM (Mon-Fri)",
      status: "Available",
      description: "Road repairs, street lighting, drainage, and general infrastructure maintenance.",
      onlineServices: [
        "Report Road Damage",
        "Request Street Light Repair",
        "Submit Infrastructure Complaint",
        "Track Repair Status"
      ],
      processingTime: "7-14 days depending on issue severity",
      requirements: "Location details, photo evidence preferred",
      fees: "Free for public infrastructure",
      hasOnlineOption: true
    }
  ],

  administrativeServices: [
    {
      id: "marriage-certificate",
      name: "Marriage Certificate Registration",
      category: "Administrative Services",
      priority: 2,
      contact: {
        phone: "+234-803-123-4578",
        email: "marriage@oshodi-isolo.gov.ng"
      },
      address: "Oshodi-Isolo Marriage Registry, Lagos",
      coordinates: { lat: 6.5190, lng: 3.3720 },
      hours: "9:00 AM - 3:00 PM (Mon-Fri)",
      status: "Available",
      description: "Marriage registration, certificate issuance, and marriage verification services.",
      onlineServices: [
        "Book Marriage Date",
        "Download Marriage Certificate",
        "Marriage Verification",
        "Pay Registration Fees"
      ],
      processingTime: "Same day for ceremonies, 3-5 days for certificates",
      requirements: "Valid IDs, divorce certificate (if applicable), witnesses",
      fees: "₦10,000 registration + ₦5,000 certificate",
      hasOnlineOption: true
    },
    {
      id: "death-certificate",
      name: "Death Certificate Registration",
      category: "Administrative Services",
      priority: 2,
      contact: {
        phone: "+234-803-123-4579",
        email: "registry@oshodi-isolo.gov.ng"
      },
      address: "Oshodi-Isolo Registry Office, Lagos",
      coordinates: { lat: 6.5150, lng: 3.3800 },
      hours: "9:00 AM - 3:00 PM (Mon-Fri)",
      status: "Available",
      description: "Death registration and certificate issuance for legal and administrative purposes.",
      onlineServices: [
        "Register Death Online",
        "Download Death Certificate",
        "Death Verification",
        "Correction Requests"
      ],
      processingTime: "5-7 days",
      requirements: "Medical certificate of death, ID of deceased, next of kin ID",
      fees: "₦3,000 registration + ₦2,000 per certificate copy",
      hasOnlineOption: true
    },
    {
      id: "land-documentation",
      name: "Land Documentation Services",
      category: "Administrative Services",
      priority: 3,
      contact: {
        phone: "+234-803-123-4580",
        email: "lands@oshodi-isolo.gov.ng"
      },
      address: "Oshodi-Isolo Lands Office, Lagos",
      coordinates: { lat: 6.5170, lng: 3.3760 },
      hours: "9:00 AM - 3:00 PM (Mon-Fri)",
      status: "Limited Services",
      description: "Land ownership verification, building permits, and property documentation.",
      onlineServices: [
        "Verify Land Ownership",
        "Apply for Building Permit",
        "Property Search",
        "Document Certification"
      ],
      processingTime: "14-21 days for permits, 7 days for verification",
      requirements: "Survey plans, land documents, architectural drawings (for permits)",
      fees: "₦50,000 - ₦200,000 depending on property size and permit type",
      hasOnlineOption: false
    }
  ]
};

// Helper function to get all services sorted by priority and online availability
export const getAllServices = () => {
  const allServices = [
    ...localServicesData.emergencyServices,
    ...localServicesData.onlineFirstServices,
    ...localServicesData.utilitiesInfrastructure,
    ...localServicesData.administrativeServices
  ];

  return allServices.sort((a, b) => {
    // First sort by online availability (online first)
    if (a.hasOnlineOption && !b.hasOnlineOption) return -1;
    if (!a.hasOnlineOption && b.hasOnlineOption) return 1;
    
    // Then by priority
    return a.priority - b.priority;
  });
};

export const getServicesByCategory = (category) => {
  switch(category) {
    case 'Emergency Services':
      return localServicesData.emergencyServices;
    case 'Online-First Services':
      return localServicesData.onlineFirstServices;
    case 'Utilities & Infrastructure':
      return localServicesData.utilitiesInfrastructure;
    case 'Administrative Services':
      return localServicesData.administrativeServices;
    default:
      return [];
  }
};