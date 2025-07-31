//src/app/about/achievementSection.js

"use client";

import React from "react";
import {
  useSlideIn,
  useFadeIn,
  useStaggerAnimation,
} from "../../animation/aboutAnimate";

export default function AchievementsSection() {
  const [sectionRef, sectionStyle] = useSlideIn("up", 0);
  const [titleRef, titleVisible] = useFadeIn(200);
  const [cardsRef, visibleCards] = useStaggerAnimation(4, 200);

  const achievements = [
    {
      title: "Electoral Victory",
      description:
        "Successfully won the 2025 Lagos Local Government Election for Oshodi-Isolo LGA",
      icon: "🏆",
      color: "from-yellow-400 to-orange-500",
    },
    {
      title: "Community Leadership",
      description:
        "Demonstrated exceptional grassroots leadership and community engagement",
      icon: "👥",
      color: "from-emerald-400 to-teal-500",
    },
    {
      title: "Digital Innovation",
      description:
        "Pioneered modern communication through active social media engagement",
      icon: "📱",
      color: "from-blue-400 to-indigo-500",
    },
    {
      title: "Public Service",
      description:
        "Committed to transparent governance and accessible public service delivery",
      icon: "🏛️",
      color: "from-purple-400 to-pink-500",
    },
  ];

  return (
    <section
      ref={sectionRef}
      style={sectionStyle}
      className="py-20 bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <div className="max-w-7xl mx-auto px-6">
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
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Key Achievements
          </h2>
          <p
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-6"
            style={{ fontFamily: "Roboto, serif" }}
          >
            Celebrating milestones in leadership, community service, and
            democratic participation
          </p>
          <div className="w-24 h-1 bg-emerald-600 mx-auto rounded-full"></div>
        </div>

        {/* Achievement Cards */}
        <div
          ref={cardsRef}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`transform transition-all duration-700 ease-out ${
                index < visibleCards
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-8 scale-95"
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div
                className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 
                            transform hover:-translate-y-2 group overflow-hidden"
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${achievement.color} opacity-0 
                               group-hover:opacity-10 transition-opacity duration-500`}
                ></div>

                <div className="relative p-8 text-center">
                  {/* Icon */}
                  <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {achievement.icon}
                  </div>

                  {/* Title */}
                  <h3
                    className="text-xl font-bold text-gray-800 mb-4 group-hover:text-emerald-700 
                               transition-colors duration-300"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {achievement.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-gray-600 leading-relaxed"
                    style={{ fontFamily: "Roboto, serif" }}
                  >
                    {achievement.description}
                  </p>

                  {/* Decorative Line */}
                  <div
                    className="w-16 h-1 bg-emerald-500 mx-auto mt-6 rounded-full 
                                transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics Section */}
        <div className="mt-20 bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="transform hover:scale-105 transition-transform duration-300">
              <div
                className="text-4xl font-bold text-emerald-600 mb-2"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                2025
              </div>
              <p
                className="text-gray-600 font-medium"
                style={{ fontFamily: "Roboto, serif" }}
              >
                Election Victory Year
              </p>
            </div>

            <div className="transform hover:scale-105 transition-transform duration-300">
              <div
                className="text-4xl font-bold text-teal-600 mb-2"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                1
              </div>
              <p
                className="text-gray-600 font-medium"
                style={{ fontFamily: "Roboto, serif" }}
              >
                Local Government Area
              </p>
            </div>

            <div className="transform hover:scale-105 transition-transform duration-300">
              <div
                className="text-4xl font-bold text-blue-600 mb-2"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                ∞
              </div>
              <p
                className="text-gray-600 font-medium"
                style={{ fontFamily: "Roboto, serif" }}
              >
                Community Impact
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}