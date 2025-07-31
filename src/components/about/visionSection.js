//src/components/about/visionSection.js
"use client";

import React from "react";
import { useSlideIn, useFadeIn } from "../../animation/aboutAnimate";

export default function VisionSection() {
  const [sectionRef, sectionStyle] = useSlideIn("up", 0);
  const [titleRef, titleVisible] = useFadeIn(200);
  const [visionRef, visionStyle] = useSlideIn("left", 400);
  const [missionRef, missionStyle] = useSlideIn("right", 600);

  const visionPoints = [
    {
      title: "Infrastructure Development",
      description:
        "Modern roads, bridges, and public facilities for enhanced connectivity",
      icon: "🏗️",
    },
    {
      title: "Economic Growth",
      description:
        "Creating opportunities for local businesses and job creation",
      icon: "📈",
    },
    {
      title: "Education Excellence",
      description:
        "Investing in quality education and youth development programs",
      icon: "🎓",
    },
    {
      title: "Healthcare Access",
      description:
        "Ensuring accessible and quality healthcare for all residents",
      icon: "🏥",
    },
    {
      title: "Technology Integration",
      description: "Embracing digital solutions for efficient governance",
      icon: "💻",
    },
    {
      title: "Environmental Sustainability",
      description: "Green initiatives for a cleaner, healthier community",
      icon: "🌱",
    },
  ];

  return (
    <section
      ref={sectionRef}
      style={sectionStyle}
      className="py-20 bg-gradient-to-br from-emerald-900 via-teal-800 to-blue-900 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-64 h-64 border border-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 border border-emerald-300 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-teal-300 rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            titleVisible
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-8"
          }`}
        >
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Vision for Oshodi-Isolo
          </h2>
          <p
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-6"
            style={{ fontFamily: "Roboto, serif" }}
          >
            Building a prosperous, inclusive, and sustainable community for all
            residents
          </p>
          <div className="w-24 h-1 bg-emerald-400 mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Vision Statement */}
          <div ref={visionRef} style={visionStyle} className="space-y-8">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
              <h3
                className="text-2xl font-bold text-emerald-300 mb-6"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Our Vision
              </h3>
              <p
                className="text-gray-200 leading-relaxed text-lg mb-6"
                style={{ fontFamily: "Roboto, serif" }}
              >
                To transform Oshodi-Isolo into a model local government area
                that exemplifies excellence in governance, sustainable
                development, and citizen engagement. We envision a community
                where every resident has access to quality services, economic
                opportunities, and a voice in their governance.
              </p>

              <div className="bg-emerald-600 bg-opacity-20 rounded-xl p-6">
                <h4
                  className="text-lg font-bold text-white mb-3"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Core Values
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "Transparency",
                    "Innovation",
                    "Inclusivity",
                    "Excellence",
                  ].map((value, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span
                        className="text-gray-200 text-sm"
                        style={{ fontFamily: "Roboto, serif" }}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mission & Goals */}
          <div ref={missionRef} style={missionStyle} className="space-y-6">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl mb-8">
              <h3
                className="text-2xl font-bold text-teal-300 mb-6"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Strategic Focus Areas
              </h3>

              <div className="grid gap-4">
                {visionPoints.map((point, index) => (
                  <div
                    key={index}
                    className="group bg-white bg-opacity-5 rounded-xl p-4 hover:bg-opacity-20 
                                transition-all duration-300 transform hover:translate-x-2"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                        {point.icon}
                      </div>
                      <div className="flex-1">
                        <h4
                          className="font-bold text-white mb-2 group-hover:text-emerald-300 
                                     transition-colors duration-300"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          {point.title}
                        </h4>
                        <p
                          className="text-gray-300 text-sm"
                          style={{ fontFamily: "Roboto, serif" }}
                        >
                          {point.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-center shadow-2xl">
              <h3
                className="text-xl font-bold text-white mb-4"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Join Our Journey
              </h3>
              <p
                className="text-emerald-100 mb-6"
                style={{ fontFamily: "Roboto, serif" }}
              >
                Together, we can build the Oshodi-Isolo of our dreams
              </p>
              <button
                className="px-8 py-3 bg-white text-emerald-700 font-bold rounded-full 
                               hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Get Involved
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
