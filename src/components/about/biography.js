// src/components/about/biography.js
"use client";

import React from "react";
import { useSlideIn, useFadeIn } from "@/animation/aboutAnimate";
import bioData from "@/data/bioData";
import BioContent from "@/components/about/aboutBio/bioContent";
import Timeline from "@/components/about/aboutBio/timeline";

export default function Biography() {
  const [sectionRef, sectionStyle] = useSlideIn("up", 0);
  const [titleRef, titleVisible] = useFadeIn(200);

  const QuickFacts = ({ quickFacts }) => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
        <h3
          className="text-xl font-bold text-gray-800 mb-6"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Quick Facts
        </h3>
        <div className="space-y-4">
          {Object.entries(quickFacts).map(([key, value]) => (
            <div key={key} className="pb-4 border-b border-gray-200">
              <h4
                className="font-medium text-gray-800 mb-1"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </h4>
              <p
                className="text-gray-600 text-sm"
                style={{ fontFamily: "Roboto, serif" }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

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
            Biography
          </h1>
          <p
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-6"
            style={{ fontFamily: "Roboto, serif" }}
          >
            The journey of a dedicated leader committed to transforming
            Oshodi-Isolo
          </p>
          <div className="w-24 h-1 bg-emerald-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 mb-20">
          <BioContent bioData={bioData} />
          <QuickFacts quickFacts={bioData.quickFacts} />
        </div>

        {/* Timeline */}
        <Timeline timelineEvents={bioData.timelineEvents} />
      </div>
    </div>
  );
}
