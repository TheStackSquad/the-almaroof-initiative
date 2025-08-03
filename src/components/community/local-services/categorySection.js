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
          flex items-center justify-between p-4 rounded-lg cursor-pointer
          transition-all duration-300 border-l-4
          bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
          ${categoryColorClasses}
          ${category.alwaysExpanded ? "cursor-default" : ""}
        `}
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{category.icon}</span>
          <h3 className="text-xl font-bold font-montserrat">{category.name}</h3>
          <span className="px-3 py-1 text-sm font-roboto font-semibold bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full">
            {services.length} services
          </span>
        </div>
        {!category.alwaysExpanded && (
          <div
            className={`transform transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      {(isExpanded || category.alwaysExpanded) && (
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
