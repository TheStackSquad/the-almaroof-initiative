// src/components/about/officeStructure.js
"use client";

import React, { useState } from "react";
import { useSlideIn, useFadeIn } from "@/animation/aboutAnimate";
import officeStructureData from "@/data/officeStructureData";
import DepartmentNav from "@/components/about/aboutStructure/departmentNav";
import DepartmentDetails from "@/components/about/aboutStructure/departmentDetails";
import ReportingStructure from "@/components/about/aboutStructure/reportingStructure";

export default function OfficeStructure() {
  const [sectionRef, sectionStyle] = useSlideIn("up", 0);
  const [titleRef, titleVisible] = useFadeIn(200);
  const [selectedDept, setSelectedDept] = useState("executive");
  const currentDept = officeStructureData[selectedDept];

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
            <DepartmentNav
              organizationStructure={officeStructureData}
              selectedDept={selectedDept}
              onSelectDept={setSelectedDept}
            />
          </div>
          {/* Department Details & Reporting Structure */}
          <div className="lg:col-span-3 space-y-8">
            <DepartmentDetails currentDept={currentDept} />
            <ReportingStructure organizationStructure={officeStructureData} />
          </div>
        </div>
      </div>
    </div>
  );
}
