// src/components/aboutStructure/reportingStructure.js
import React from "react";

export default function ReportingStructure({ organizationStructure }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mx-auto">
      <h3
        className="text-2xl font-bold text-gray-800 mb-6 text-center"
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        Reporting Structure
      </h3>
      <div className="relative">
        {/* Chairman at top */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl p-4 shadow-lg">
            <div
              className="font-bold"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Executive Chairman
            </div>
            <div
              className="text-sm opacity-90"
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
                className={`text-center p-4 rounded-lg bg-gradient-to-r ${dept.color} text-white shadow-md transform hover:scale-105 transition-all duration-300`}
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
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-px h-16 bg-gray-300 hidden sm:block"></div>
        <div className="absolute top-32 left-0 right-0 h-px bg-gray-300 hidden sm:block"></div>
      </div>
    </div>
  );
}
