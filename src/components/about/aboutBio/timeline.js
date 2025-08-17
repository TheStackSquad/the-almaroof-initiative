// src/components/aboutBio/timeline.js
import React from "react";
import { useStaggerAnimation } from "@/animation/aboutAnimate";

export default function Timeline({ timelineEvents }) {
  const [timelineRef, visibleItems] = useStaggerAnimation(6, 300);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2
        className="text-2xl font-bold text-gray-800 mb-8 text-center"
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        Leadership Timeline
      </h2>

      <div ref={timelineRef} className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-teal-600 rounded-full"></div>

        <div className="space-y-8">
          {timelineEvents.map((event, index) => (
            <div
              key={index}
              className={`relative flex flex-col sm:flex-row items-start sm:space-x-6 transition-all duration-700 ease-out ${
                index < visibleItems
                  ? "opacity-100 transform translate-x-0"
                  : "opacity-0 transform translate-x-8"
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Timeline Dot */}
              <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">{event.icon}</span>
              </div>

              {/* Content */}
              <div className="flex-1 bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors duration-300 mt-4 sm:mt-0">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 mb-3">
                  <span
                    className="px-3 py-1 bg-emerald-600 text-white text-sm font-bold rounded-full"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {event.year}
                  </span>
                  <h3
                    className="text-lg font-bold text-gray-800"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {event.title}
                  </h3>
                </div>
                <p
                  className="text-gray-600"
                  style={{ fontFamily: "Roboto, serif" }}
                >
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
