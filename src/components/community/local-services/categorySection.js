// src/components/community/local-services/CategorySection.js
import React from "react";
import { getServicesByCategory } from "@/data/localServicesData";
import ServiceCard from "./serviceCards";

export default function CategorySection({
  category,
  expandedCategories,
  setExpandedCategories,
  openServiceModal,
}) {
  const services = getServicesByCategory(category.name);
  const isExpanded = expandedCategories[category.name];

  const toggleCategory = (categoryName) => {
    if (categoryName === "Emergency Services") return;
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const getCategoryColor = (colorName) => {
    const colors = {
      red: "text-red-600 border-red-500 dark:text-red-400",
      green: "text-green-600 border-green-500 dark:text-green-400",
      blue: "text-blue-600 border-blue-500 dark:text-blue-400",
      purple: "text-purple-600 border-purple-500 dark:text-purple-400",
    };
    return colors[colorName] || colors.blue;
  };

  const categoryColorClasses = getCategoryColor(category.color);

  return (
    <div className="mb-8">
      <div
        onClick={() => toggleCategory(category.name)}
        className={`
          flex flex-col sm:flex-row items-start sm:items-center justify-between 
          p-4 sm:p-4 rounded-lg cursor-pointer
          transition-all duration-300 border-l-4
          bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
          ${categoryColorClasses}
          ${category.alwaysExpanded ? "cursor-default" : ""}
        `}
      >
        {/* Main content section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          {/* Icon and title row */}
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{category.icon}</span>
            <h3 className="text-lg sm:text-xl font-bold font-montserrat">
              {category.name}
            </h3>
          </div>

          {/* Services count badge */}
          <span className="px-3 py-1 text-sm font-roboto font-semibold bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full ml-8 sm:ml-0">
            {services.length} services
          </span>
        </div>

        {/* Chevron icon - positioned better on mobile */}
        {!category.alwaysExpanded && (
          <div className="absolute top-4 right-4 sm:relative sm:top-auto sm:right-auto sm:mt-0">
            <div
              className={`transform transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Services grid */}
      {(isExpanded || category.alwaysExpanded) && (
        <div className="mt-6 grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {services
            .sort((a, b) =>
              a.hasOnlineOption === b.hasOnlineOption
                ? 0
                : a.hasOnlineOption
                ? -1
                : 1
            )
            .map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                openServiceModal={openServiceModal}
              />
            ))}
        </div>
      )}
    </div>
  );
}
