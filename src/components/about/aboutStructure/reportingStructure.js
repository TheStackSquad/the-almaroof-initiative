// src/components/aboutStructure/reportingStructure.js
import React from "react";

export default function ReportingStructure({ organizationStructure }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mx-auto border border-gray-200 dark:border-gray-700">
      <h3
        className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center"
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        Reporting Structure
      </h3>
      <div className="relative">
        {/* Chairman at top */}
        <div className="text-center mb-8">
          <div className="inline-block bg-emerald-700 dark:bg-emerald-600 text-white rounded-xl p-4 shadow-lg border border-emerald-600 dark:border-emerald-500">
            <div
              className="font-bold text-white dark:text-gray-100"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Executive Chairman
            </div>
            <div
              className="text-sm opacity-90 text-white dark:text-gray-200"
              style={{ fontFamily: "Roboto, serif" }}
            >
              Otunba Kehinde Almaroof
            </div>
          </div>
        </div>
        {/* Department Heads */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-auto">
          {Object.entries(organizationStructure)
            .filter(([key]) => key !== "executive")
            .map(([key, dept]) => (
              <div
                key={key}
                className={`text-center p-4 rounded-lg text-white dark:text-gray-100 shadow-md transform hover:scale-105 transition-all duration-300 border ${
                  key === "finance"
                    ? "bg-blue-700 dark:bg-blue-600 border-blue-600 dark:border-blue-500"
                    : key === "operations"
                    ? "bg-purple-700 dark:bg-purple-600 border-purple-600 dark:border-purple-500"
                    : key === "marketing"
                    ? "bg-pink-700 dark:bg-pink-600 border-pink-600 dark:border-pink-500"
                    : key === "hr"
                    ? "bg-amber-700 dark:bg-amber-600 border-amber-600 dark:border-amber-500"
                    : key === "it"
                    ? "bg-indigo-700 dark:bg-indigo-600 border-indigo-600 dark:border-indigo-500"
                    : "bg-teal-700 dark:bg-teal-600 border-teal-600 dark:border-teal-500"
                }`}
              >
                <div className="text-2xl mb-2">{dept.icon}</div>
                <div
                  className="font-medium text-sm"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {dept.title}
                </div>
                <div
                  className="text-xs opacity-90"
                  style={{ fontFamily: "Roboto, serif" }}
                >
                  {dept.head}
                </div>
              </div>
            ))}
        </div>
        {/* Connecting Lines */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-px h-16 bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>
        <div className="absolute top-32 left-0 right-0 h-px bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>
      </div>
    </div>
  );
}
