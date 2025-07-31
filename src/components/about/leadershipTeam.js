// src/components/about/leadershipTeam.js
"use client";

import React from "react";
import {
  useSlideIn,
  useFadeIn,
  useStaggerAnimation,
} from "../../animation/aboutAnimate";
import { leadershipTeam, departments } from "../../data/leadershipData";

export default function LeadershipTeam() {
  const [sectionRef, sectionStyle] = useSlideIn("up", 0);
  const [titleRef, titleVisible] = useFadeIn(200);
  const [teamRef, visibleMembers] = useStaggerAnimation(8, 200);

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
            Leadership Team
          </h1>
          <p
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-6"
            style={{ fontFamily: "Roboto, serif" }}
          >
            Meet the dedicated professionals leading Oshodi-Isolo&apos;s
            transformation
          </p>
          <div className="w-24 h-1 bg-emerald-600 mx-auto rounded-full"></div>
        </div>

        {/* Leadership Grid */}
        <div
          ref={teamRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20"
        >
          {leadershipTeam.map((member, index) => (
            <div
              key={index}
              className={`transform transition-all duration-700 ease-out ${
                index < visibleMembers
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-8 scale-95"
              } ${
                member.isChairman
                  ? "md:col-span-2 lg:col-span-1 xl:col-span-2"
                  : ""
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div
                className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 
                             transform hover:-translate-y-2 overflow-hidden group 
                             ${
                               member.isChairman
                                 ? "border-2 border-emerald-200"
                                 : ""
                             }`}
              >
                {/* Header with gradient */}
                <div
                  className={`h-32 bg-gradient-to-br ${member.color} relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div
                    className="absolute top-4 right-4 text-4xl text-white opacity-30 group-hover:opacity-50 
                                transition-opacity duration-300"
                  >
                    {member.icon}
                  </div>
                  {member.isChairman && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                        CHAIRMAN
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Avatar Placeholder */}
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${member.color} rounded-full mx-auto -mt-12 mb-4 
                                 flex items-center justify-center shadow-lg relative z-10`}
                  >
                    <span className="text-2xl text-white">{member.icon}</span>
                  </div>

                  <div className="text-center">
                    <h3
                      className={`font-bold text-gray-800 mb-2 group-hover:text-emerald-700 
                                  transition-colors duration-300 ${
                                    member.isChairman ? "text-lg" : "text-base"
                                  }`}
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {member.name}
                    </h3>

                    <p
                      className="text-emerald-600 font-medium mb-1"
                      style={{ fontFamily: "Roboto, serif" }}
                    >
                      {member.position}
                    </p>

                    <p
                      className="text-gray-500 text-sm mb-4"
                      style={{ fontFamily: "Roboto, serif" }}
                    >
                      {member.department}
                    </p>

                    <p
                      className={`text-gray-600 leading-relaxed ${
                        member.isChairman ? "text-sm" : "text-xs"
                      }`}
                      style={{ fontFamily: "Roboto, serif" }}
                    >
                      {member.description}
                    </p>
                  </div>

                  {/* Contact Button */}
                  <div className="mt-6 text-center">
                    <button
                      className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm 
                                     font-medium hover:bg-emerald-100 transition-colors duration-300"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Department Overview */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2
            className="text-2xl font-bold text-gray-800 mb-8 text-center"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Department Overview
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 
                            hover:from-emerald-50 hover:to-teal-50 transition-all duration-300 
                            transform hover:-translate-y-1 shadow-md hover:shadow-lg"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-3xl">{dept.icon}</div>
                  <div>
                    <h3
                      className="font-bold text-gray-800"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {dept.name}
                    </h3>
                    <p
                      className="text-emerald-600 text-sm font-medium"
                      style={{ fontFamily: "Roboto, serif" }}
                    >
                      {dept.members} Team Members
                    </p>
                  </div>
                </div>

                <p
                  className="text-gray-600 text-sm"
                  style={{ fontFamily: "Roboto, serif" }}
                >
                  {dept.description}
                </p>
              </div>
            ))}
          </div>

          {/* Team Statistics */}
          <div className="mt-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="transform hover:scale-105 transition-transform duration-300">
                <div
                  className="text-3xl font-bold mb-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  98+
                </div>
                <p
                  className="text-emerald-100"
                  style={{ fontFamily: "Roboto, serif" }}
                >
                  Team Members
                </p>
              </div>

              <div className="transform hover:scale-105 transition-transform duration-300">
                <div
                  className="text-3xl font-bold mb-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  6
                </div>
                <p
                  className="text-emerald-100"
                  style={{ fontFamily: "Roboto, serif" }}
                >
                  Core Departments
                </p>
              </div>

              <div className="transform hover:scale-105 transition-transform duration-300">
                <div
                  className="text-3xl font-bold mb-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  24/7
                </div>
                <p
                  className="text-emerald-100"
                  style={{ fontFamily: "Roboto, serif" }}
                >
                  Service Availability
                </p>
              </div>

              <div className="transform hover:scale-105 transition-transform duration-300">
                <div
                  className="text-3xl font-bold mb-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  100%
                </div>
                <p
                  className="text-emerald-100"
                  style={{ fontFamily: "Roboto, serif" }}
                >
                  Community Focused
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
