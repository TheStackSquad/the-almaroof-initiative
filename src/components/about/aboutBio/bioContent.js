// src/components/aboutBio/bioContent.js
import React from "react";
import Link from "next/link";

export default function BioContent({ bioData }) {
  return (
    <div className="lg:col-span-2 space-y-8">
      {/* Main Biography */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2
          className="text-2xl font-bold text-gray-800 mb-6"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          A Leaders&apos; Journey
        </h2>
        <div className="prose prose-lg max-w-none">
          <p
            className="text-gray-700 leading-relaxed mb-6"
            style={{ fontFamily: "Roboto, serif" }}
          >
            {bioData.bioIntro}
          </p>
          <p
            className="text-gray-700 leading-relaxed mb-6"
            style={{ fontFamily: "Roboto, serif" }}
          >
            {bioData.bioMiddle}
          </p>
          <p
            className="text-gray-700 leading-relaxed mb-6"
            style={{ fontFamily: "Roboto, serif" }}
          >
            {bioData.bio}
          </p>
          <p
            className="text-gray-700 leading-relaxed"
            style={{ fontFamily: "Roboto, serif" }}
          >
            {bioData.bioConclusion}
          </p>
        </div>
      </div>

      {/* Personal Values */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 shadow-lg">
        <h3
          className="text-2xl font-bold text-gray-800 mb-6"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Core Values & Principles
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {bioData.personalValues.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{item.icon}</div>
                <div>
                  <h4
                    className="font-bold text-gray-800 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {item.value}
                  </h4>
                  <p
                    className="text-gray-600 text-sm"
                    style={{ fontFamily: "Roboto, serif" }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
