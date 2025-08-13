// src/components/community/local-services/ServiceCardDetails.js

"use client";

import React from "react";

const ServiceCardDetails = ({ service }) => {
  return (
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
    </div>
  );
};

export default ServiceCardDetails;
