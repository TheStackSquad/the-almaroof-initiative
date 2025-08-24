// src/components/about/leadershipTeam.js
"use client";

import React from "react";
import Image from "next/image"; // Import the Image component
import {
  useSlideIn,
  useFadeIn,
  useStaggerAnimation,
} from "@/animation/aboutAnimate";
import { leadershipTeam, departments } from "@/data/leadershipData";

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
          className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20"
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
                             transform hover:-translate-y-2 overflow-hidden group h-full flex flex-col 
                             ${
                               member.isChairman
                                 ? "border-2 border-emerald-200"
                                 : ""
                             }`}
              >
                {/* Header with gradient and image container */}
                <div
                  className={`h-40 relative overflow-hidden flex items-center justify-center`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-80`}
                  ></div>
                  {member.image && (
                    <div className="w-full h-48 sm:h-56 lg:h-64 relative overflow-hidden">
                      <Image
                        src={member.image}
                        alt={`${member.name} - ${member.position}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        style={{
                          objectFit: "cover",
                        }}
                        className="transition-transform duration-500 group-hover:scale-105"
                        priority={index < 3} // Prioritize first 3 images
                        quality={85} // Optimize for web
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-20 z-10"></div>
                  <div
                    className="absolute top-4 right-4 text-4xl text-white opacity-30 group-hover:opacity-50 
                                transition-opacity duration-300 z-20"
                  >
                    {member.icon}
                  </div>
                  {member.isChairman && (
                    <div className="absolute top-4 left-4 z-20">
                      <span className="px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                        CHAIRMAN
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  {/* Avatar Placeholder - now with the image */}
                  <div
                    className={`w-20 h-20 rounded-full mx-auto -mt-20 mb-4 
  flex items-center justify-center shadow-lg relative z-30 overflow-hidden border-4 border-white`}
                  >
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={`${member.name} avatar`}
                        fill
                        sizes="80px"
                        style={{
                          objectFit: "cover",
                        }}
                        className="rounded-full"
                      />
                    ) : (
                      <span className="text-2xl text-white">{member.icon}</span>
                    )}
                  </div>

                  <div className="text-center">
                    <h3
                      className={`font-bold text-gray-800 mb-2 group-hover:text-emerald-700 
                                  transition-colors duration-300 text-lg sm:text-xl
                                  ${
                                    member.isChairman
                                      ? "text-xl sm:text-2xl"
                                      : "text-lg"
                                  }`}
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {member.name}
                    </h3>

                    <p
                      className="text-emerald-600 font-medium mb-1 text-base"
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
                      className={`text-gray-600 leading-relaxed text-sm sm:text-base`}
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
      </div>
      {/* Rest of your component (Department Overview and Team Statistics) remains unchanged */}
    </div>
  );
}