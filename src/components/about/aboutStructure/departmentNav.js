// src/components/aboutStructure/departmentNav.js
import React from "react";

export default function DepartmentNav({
  organizationStructure,
  selectedDept,
  onSelectDept,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
      <h3
        className="text-lg font-bold text-gray-800 mb-6"
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
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="text-2xl">{dept.icon}</span>
            <div>
              <h4
                className={`font-medium text-sm ${
                  selectedDept === key ? "text-white" : "text-gray-800"
                }`}
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {dept.title}
              </h4>
              <p
                className={`text-xs ${
                  selectedDept === key ? "text-gray-200" : "text-gray-500"
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
