// src/components/aboutStructure/departmentNav.js
import React from "react";

export default function DepartmentNav({
  organizationStructure,
  selectedDept,
  onSelectDept,
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24 border border-gray-200 dark:border-gray-700">
      <h3
        className="text-lg font-bold text-gray-800 dark:text-white mb-6"
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        Departments
      </h3>
      <div className="space-y-3">
        {Object.entries(organizationStructure).map(([key, dept]) => (
          <button
            key={key}
            onClick={() => onSelectDept(key)}
            className={`w-full flex items-center space-x-3 p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
              selectedDept === key
                ? `bg-gradient-to-r ${dept.color} text-white shadow-lg`
                : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            }`}
          >
            <span
              className={`text-2xl ${
                selectedDept === key
                  ? "text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {dept.icon}
            </span>
            <div>
              <h4
                className={`font-medium text-sm ${
                  selectedDept === key
                    ? "text-white"
                    : "text-gray-800 dark:text-gray-100"
                }`}
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {dept.title}
              </h4>
              <p
                className={`text-xs ${
                  selectedDept === key
                    ? "text-gray-200 dark:text-gray-300"
                    : "text-gray-500 dark:text-gray-400"
                }`}
                style={{ fontFamily: "Roboto, serif" }}
              >
                {dept.members} Members
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
