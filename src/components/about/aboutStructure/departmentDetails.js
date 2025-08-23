// src/components/aboutStructure/departmentDetails.js
import React from "react";

export default function DepartmentDetails({ currentDept }) {
  return (
    <div className="space-y-8">
      {/* Department Header */}
      <div
        className={`bg-gradient-to-r ${currentDept.color} rounded-2xl p-8 text-white shadow-xl mx-auto`}
      >
        <div className="flex items-center space-x-6 text-white">
          <div className="text-6xl opacity-80">{currentDept.icon}</div>
          <div>
            <h2
              className="text-3xl font-bold mb-2 text-gray-800 dark:text-white"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {currentDept.title}
            </h2>
            <p
              className="text-xl opacity-90 mb-1 text-gray-800 dark:text-white"
              style={{ fontFamily: "Roboto, serif" }}
            >
              {currentDept.head}
            </p>
            <p
              className="text-lg opacity-75 text-gray-800 dark:text-white"
              style={{ fontFamily: "Roboto, serif" }}
            >
              {currentDept.position}
            </p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-600 bg-opacity-20 rounded-lg p-4 text-center text-gray-800 dark:text-white">
            <div
              className="text-2xl font-bold dark:bg-gray-900"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {currentDept.members}
            </div>
            <p
              className="text-sm opacity-90 text-gray-800 dark:text-white"
              style={{ fontFamily: "Roboto, serif" }}
            >
              Team Members
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 bg-opacity-20 rounded-lg p-4 text-center text-gray-800 dark:text-white">
            <div
              className="text-2xl font-bold"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {currentDept.departments.length}
            </div>
            <p
              className="text-sm opacity-90"
              style={{ fontFamily: "Roboto, serif" }}
            >
              Sub-Departments
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 bg-opacity-20 rounded-lg p-4 text-center text-gray-800 dark:text-white">
            <div
              className="text-2xl font-bold"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              24/7
            </div>
            <p
              className="text-sm opacity-90"
              style={{ fontFamily: "Roboto, serif" }}
            >
              Service Hours
            </p>
          </div>
        </div>
      </div>
      {/* Sub-Departments */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mx-auto border border-gray-200 dark:border-gray-700">
        <h3
          className="text-2xl font-bold text-gray-800 dark:text-white mb-6"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Sub-Departments & Units
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentDept.departments.map((subDept, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 hover:bg-emerald-50 dark:hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                <h4
                  className="font-bold text-gray-800 dark:text-white flex-1"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {subDept.name}
                </h4>
                <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold rounded-full mt-2 sm:mt-0 sm:ml-2">
                  {subDept.staff} Staff
                </span>
              </div>
              <p
                className="text-emerald-700 dark:text-emerald-400 font-medium text-sm mb-2"
                style={{ fontFamily: "Roboto, serif" }}
              >
                Head: {subDept.head}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Key Responsibilities */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mx-auto border border-gray-200 dark:border-gray-700">
        <h3
          className="text-2xl font-bold text-gray-800 dark:text-white mb-6"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Key Responsibilities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentDept.responsibilities.map((responsibility, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900 hover:bg-emerald-50 dark:hover:bg-gray-700 transition-colors duration-300"
            >
              <div className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
              <p
                className="text-gray-700 dark:text-gray-200"
                style={{ fontFamily: "Roboto, serif" }}
              >
                {responsibility}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
