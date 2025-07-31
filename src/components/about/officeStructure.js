//src/components/about/officeStructure.js

"use client";

import React, { useState } from "react";
import { useSlideIn, useFadeIn } from "../../animation/aboutAnimate";

export default function OfficeStructure() {
  const [sectionRef, sectionStyle] = useSlideIn("up", 0);
  const [titleRef, titleVisible] = useFadeIn(200);
  const [selectedDept, setSelectedDept] = useState("executive");

  const organizationStructure = {
    executive: {
      title: "Executive Office",
      head: "Otunba Kehinde Oloyode Almaroof",
      position: "Executive Chairman",
      members: 5,
      color: "from-emerald-500 to-teal-600",
      icon: "👑",
      departments: [
        {
          name: "Office of the Chairman",
          head: "Otunba Kehinde Almaroof",
          staff: 3,
        },
        {
          name: "Office of the Deputy Chairman",
          head: "Deputy Chairman",
          staff: 2,
        },
      ],
      responsibilities: [
        "Overall policy direction and strategic planning",
        "Community engagement and stakeholder relations",
        "Inter-governmental coordination",
        "Public representation and advocacy",
      ],
    },
    administration: {
      title: "Administration Department",
      head: "Secretary to Local Government",
      position: "Chief Administrative Officer",
      members: 15,
      color: "from-blue-500 to-indigo-600",
      icon: "📊",
      departments: [
        { name: "Human Resources", head: "HR Manager", staff: 4 },
        { name: "Records & Documentation", head: "Records Officer", staff: 3 },
        { name: "Protocol & Events", head: "Protocol Officer", staff: 2 },
        { name: "Legal Affairs", head: "Legal Advisor", staff: 2 },
        { name: "Public Relations", head: "PR Manager", staff: 4 },
      ],
      responsibilities: [
        "Personnel management and development",
        "Administrative coordination across departments",
        "Legal compliance and advisory services",
        "Records management and documentation",
      ],
    },
    works: {
      title: "Works & Infrastructure",
      head: "Director of Works",
      position: "Chief Engineer",
      members: 28,
      color: "from-orange-500 to-red-600",
      icon: "🏗️",
      departments: [
        {
          name: "Road Construction & Maintenance",
          head: "Chief Engineer (Roads)",
          staff: 8,
        },
        {
          name: "Building & Construction",
          head: "Building Engineer",
          staff: 6,
        },
        { name: "Urban Planning", head: "Town Planner", staff: 4 },
        {
          name: "Environmental Services",
          head: "Environmental Officer",
          staff: 5,
        },
        { name: "Waste Management", head: "Waste Manager", staff: 5 },
      ],
      responsibilities: [
        "Infrastructure development and maintenance",
        "Urban planning and development control",
        "Environmental protection and sustainability",
        "Waste management and sanitation services",
      ],
    },
    finance: {
      title: "Finance & Budget",
      head: "Head of Finance",
      position: "Chief Financial Officer",
      members: 12,
      color: "from-green-500 to-emerald-600",
      icon: "💰",
      departments: [
        { name: "Budget & Planning", head: "Budget Officer", staff: 3 },
        { name: "Revenue Generation", head: "Revenue Manager", staff: 4 },
        { name: "Accounts & Audit", head: "Chief Accountant", staff: 3 },
        { name: "Procurement", head: "Procurement Officer", staff: 2 },
      ],
      responsibilities: [
        "Financial planning and budget management",
        "Revenue generation and collection",
        "Financial reporting and transparency",
        "Procurement and contract management",
      ],
    },
    health: {
      title: "Health & Social Services",
      head: "Director of Health Services",
      position: "Chief Medical Officer",
      members: 22,
      color: "from-red-500 to-pink-600",
      icon: "🏥",
      departments: [
        { name: "Primary Healthcare", head: "Medical Officer", staff: 8 },
        { name: "Public Health", head: "Public Health Officer", staff: 6 },
        { name: "Social Welfare", head: "Social Welfare Officer", staff: 4 },
        {
          name: "Community Health",
          head: "Community Health Coordinator",
          staff: 4,
        },
      ],
      responsibilities: [
        "Primary healthcare service delivery",
        "Public health programs and disease prevention",
        "Social welfare and community support",
        "Health education and promotion",
      ],
    },
    education: {
      title: "Education & Youth Development",
      head: "Director of Education",
      position: "Chief Education Officer",
      members: 18,
      color: "from-purple-500 to-pink-600",
      icon: "🎓",
      departments: [
        { name: "Basic Education", head: "Education Supervisor", staff: 6 },
        { name: "Youth Development", head: "Youth Coordinator", staff: 4 },
        {
          name: "Skills Acquisition",
          head: "Skills Development Officer",
          staff: 4,
        },
        { name: "Sports & Recreation", head: "Sports Coordinator", staff: 4 },
      ],
      responsibilities: [
        "Educational oversight and quality assurance",
        "Youth empowerment and development programs",
        "Skills acquisition and vocational training",
        "Sports development and recreational activities",
      ],
    },
  };

  const currentDept = organizationStructure[selectedDept];

  return (
    <div
      ref={sectionRef}
      style={sectionStyle}
      className="min-h-screen py-20 bg-gradient-to-br from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            titleVisible
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-8"
          }`}
        >
          <h1
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Office Structure
          </h1>
          <p
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-6"
            style={{ fontFamily: "Roboto, serif" }}
          >
            Organizational framework driving efficient governance and service
            delivery
          </p>
          <div className="w-24 h-1 bg-emerald-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Department Navigation */}
          <div className="lg:col-span-1">
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
                    onClick={() => setSelectedDept(key)}
                    className={`w-full flex items-center space-x-3 p-4 rounded-xl text-left 
                               transition-all duration-300 transform hover:scale-105 ${
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
                          selectedDept === key
                            ? "text-gray-200"
                            : "text-gray-500"
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
          </div>

          {/* Department Details */}
          <div className="lg:col-span-3 space-y-8">
            {/* Department Header */}
            <div
              className={`bg-gradient-to-r ${currentDept.color} rounded-2xl p-8 text-white shadow-xl`}
            >
              <div className="flex items-center space-x-6">
                <div className="text-6xl opacity-80">{currentDept.icon}</div>
                <div>
                  <h2
                    className="text-3xl font-bold mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {currentDept.title}
                  </h2>
                  <p
                    className="text-xl opacity-90 mb-1"
                    style={{ fontFamily: "Roboto, serif" }}
                  >
                    {currentDept.head}
                  </p>
                  <p
                    className="text-lg opacity-75"
                    style={{ fontFamily: "Roboto, serif" }}
                  >
                    {currentDept.position}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid md:grid-cols-3 gap-4">
                <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                  <div
                    className="text-2xl font-bold"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {currentDept.members}
                  </div>
                  <p
                    className="text-sm opacity-90"
                    style={{ fontFamily: "Roboto, serif" }}
                  >
                    Team Members
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
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
                <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
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
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3
                className="text-2xl font-bold text-gray-800 mb-6"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Sub-Departments & Units
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {currentDept.departments.map((subDept, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 
                                hover:from-emerald-50 hover:to-teal-50 transition-all duration-300 
                                transform hover:-translate-y-1 shadow-md hover:shadow-lg"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4
                        className="font-bold text-gray-800 flex-1"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {subDept.name}
                      </h4>
                      <span
                        className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs 
                                     font-bold rounded-full ml-2"
                      >
                        {subDept.staff} Staff
                      </span>
                    </div>
                    <p
                      className="text-emerald-700 font-medium text-sm mb-2"
                      style={{ fontFamily: "Roboto, serif" }}
                    >
                      Head: {subDept.head}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Responsibilities */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3
                className="text-2xl font-bold text-gray-800 mb-6"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Key Responsibilities
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                {currentDept.responsibilities.map((responsibility, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50 
                                           hover:bg-emerald-50 transition-colors duration-300"
                  >
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p
                      className="text-gray-700"
                      style={{ fontFamily: "Roboto, serif" }}
                    >
                      {responsibility}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Organizational Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3
                className="text-2xl font-bold text-gray-800 mb-6"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Reporting Structure
              </h3>

              <div className="relative">
                {/* Chairman at top */}
                <div className="text-center mb-8">
                  <div
                    className="inline-block bg-gradient-to-r from-emerald-500 to-teal-600 
                                text-white rounded-xl p-4 shadow-lg"
                  >
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
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(organizationStructure)
                    .filter(([key]) => key !== "executive")
                    .map(([key, dept]) => (
                      <div
                        key={key}
                        className={`text-center p-4 rounded-lg bg-gradient-to-r ${dept.color} 
                                              text-white shadow-md transform hover:scale-105 transition-all duration-300`}
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
                <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-px h-16 bg-gray-300"></div>
                <div className="absolute top-32 left-0 right-0 h-px bg-gray-300"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}