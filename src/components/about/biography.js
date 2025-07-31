//src/components/about/biography.js
"use client";

import React from "react";
import {
  useSlideIn,
  useFadeIn,
  useStaggerAnimation,
} from "../../animation/aboutAnimate";

const bio = `  The conferment of the traditional title \"Otunba\" reflects
                  the community&apos;s recognition of his leadership qualities
                  and dedication to societal development. This honor, deeply
                  rooted in Yoruba tradition, signifies his role as a community
                  elder and leader who bridges the gap between traditional
                  governance and modern democratic principles.`;

export default function Biography() {
  const [sectionRef, sectionStyle] = useSlideIn("up", 0);
  const [titleRef, titleVisible] = useFadeIn(200);
  const [timelineRef, visibleItems] = useStaggerAnimation(6, 300);

  const timelineEvents = [
    {
      year: "2025",
      title: "Electoral Victory",
      description:
        "Won the Lagos Local Government Election for Oshodi-Isolo LGA",
      icon: "🏆",
      color: "from-yellow-400 to-orange-500",
    },
    {
      year: "2024",
      title: "Campaign Leadership",
      description:
        "Led a comprehensive grassroots campaign connecting with community members",
      icon: "📢",
      color: "from-blue-400 to-indigo-500",
    },
    {
      year: "2020s",
      title: "Community Engagement",
      description:
        "Active involvement in community development and social media outreach",
      icon: "🤝",
      color: "from-emerald-400 to-teal-500",
    },
    {
      year: "Earlier",
      title: "Traditional Recognition",
      description:
        'Received the traditional title of "Otunba" recognizing his community leadership',
      icon: "👑",
      color: "from-purple-400 to-pink-500",
    },
    {
      year: "Foundation",
      title: "Early Leadership",
      description: "Began journey in public service and community advocacy",
      icon: "🌱",
      color: "from-green-400 to-emerald-500",
    },
    {
      year: "Education",
      title: "Academic Foundation",
      description:
        "Built strong educational background preparing for public service",
      icon: "🎓",
      color: "from-teal-400 to-cyan-500",
    },
  ];

  const personalValues = [
    {
      value: "Integrity",
      description: "Commitment to honest and transparent leadership",
      icon: "🛡️",
    },
    {
      value: "Innovation",
      description: "Embracing modern solutions for age-old challenges",
      icon: "💡",
    },
    {
      value: "Inclusivity",
      description: "Ensuring every voice in the community is heard",
      icon: "🤗",
    },
    {
      value: "Excellence",
      description: "Striving for the highest standards in public service",
      icon: "⭐",
    },
  ];

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
          {/* Main Biography */}
          <div className="lg:col-span-2 space-y-8">
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
                  Otunba Kehinde Oloyode Almaroof represents a new generation of
                  Nigerian political leadership, combining traditional values
                  with modern governance approaches. His journey to becoming the
                  Executive Chairman of Oshodi-Isolo Local Government Area
                  reflects years of dedicated community service and grassroots
                  engagement.
                </p>

                <p
                  className="text-gray-700 leading-relaxed mb-6"
                  style={{ fontFamily: "Roboto, serif" }}
                >
                  Born and raised with a deep understanding of community
                  dynamics, Almaroof has consistently demonstrated his
                  commitment to public service through various initiatives and
                  community engagement programs. His approach to leadership is
                  characterized by accessibility, transparency, and a genuine
                  desire to improve the lives of Oshodi-Isolo residents.
                </p>

                <p
                  className="text-gray-700 leading-relaxed mb-6"
                  style={{ fontFamily: "Roboto, serif" }}
                >
                {bio}
                </p>

                <p
                  className="text-gray-700 leading-relaxed"
                  style={{ fontFamily: "Roboto, serif" }}
                >
                  His victory in the 2025 Lagos Local Government Elections was
                  not just a political win, but a validation of his vision for a
                  more inclusive, developed, and prosperous Oshodi-Isolo. His
                  campaign was built on direct engagement with constituents,
                  leveraging both traditional community meetings and modern
                  digital platforms to reach every segment of the population.
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
                {personalValues.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg 
                                           transform hover:-translate-y-1 transition-all duration-300"
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

          {/* Quick Facts Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
              <h3
                className="text-xl font-bold text-gray-800 mb-6"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Quick Facts
              </h3>

              <div className="space-y-4">
                <div className="pb-4 border-b border-gray-200">
                  <h4
                    className="font-medium text-gray-800 mb-1"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Current Position
                  </h4>
                  <p
                    className="text-gray-600 text-sm"
                    style={{ fontFamily: "Roboto, serif" }}
                  >
                    Executive Chairman, Oshodi-Isolo Local Government Area
                  </p>
                </div>

                <div className="pb-4 border-b border-gray-200">
                  <h4
                    className="font-medium text-gray-800 mb-1"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Traditional Title
                  </h4>
                  <p
                    className="text-gray-600 text-sm"
                    style={{ fontFamily: "Roboto, serif" }}
                  >
                    Otunba (Yoruba Chieftaincy Title)
                  </p>
                </div>

                <div className="pb-4 border-b border-gray-200">
                  <h4
                    className="font-medium text-gray-800 mb-1"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Electoral Victory
                  </h4>
                  <p
                    className="text-gray-600 text-sm"
                    style={{ fontFamily: "Roboto, serif" }}
                  >
                    2025 Lagos Local Government Elections
                  </p>
                </div>

                <div className="pb-4 border-b border-gray-200">
                  <h4
                    className="font-medium text-gray-800 mb-1"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Jurisdiction
                  </h4>
                  <p
                    className="text-gray-600 text-sm"
                    style={{ fontFamily: "Roboto, serif" }}
                  >
                    Oshodi-Isolo LGA, Lagos State
                  </p>
                </div>

                <div>
                  <h4
                    className="font-medium text-gray-800 mb-1"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Focus Areas
                  </h4>
                  <p
                    className="text-gray-600 text-sm"
                    style={{ fontFamily: "Roboto, serif" }}
                  >
                    Community Development, Infrastructure, Digital Governance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
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
                  className={`relative flex items-start space-x-6 transition-all duration-700 ease-out ${
                    index < visibleItems
                      ? "opacity-100 transform translate-x-0"
                      : "opacity-0 transform translate-x-8"
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  {/* Timeline Dot */}
                  <div
                    className={`relative z-10 w-16 h-16 rounded-full bg-gradient-to-br ${event.color} 
                                 flex items-center justify-center shadow-lg transform hover:scale-110 
                                 transition-transform duration-300`}
                  >
                    <span className="text-2xl">{event.icon}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors duration-300">
                    <div className="flex items-center space-x-4 mb-3">
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
      </div>
    </div>
  );
}
