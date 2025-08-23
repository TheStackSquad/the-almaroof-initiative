// src/components/about/heroSection.js

"use client";

import React from "react";
import { useFadeIn, useSlideIn } from "@/animation/aboutAnimate";
// import Link from "next/link";

export default function HeroSection() {
  const [titleRef, titleVisible] = useFadeIn(200);
  const [subtitleRef, subtitleStyle] = useSlideIn("up", 400);
  const [descRef, descStyle] = useSlideIn("up", 600);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-5">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-700 to-blue-800"></div>
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>

      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border-2 border-emerald-300 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 border-2 border-teal-300 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 border-2 border-blue-300 rounded-full animate-bounce"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Main Title - LCP Element moved out of animated container */}
        <h2
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-emerald-300 mb-2"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          KEHINDE OLOYODE
        </h2>
        {/* Animated Titles */}
        <div
          ref={titleRef}
          className={`transition-all duration-1000 ease-out ${
            titleVisible
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-8"
          }`}
        >
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            OTUNBA
          </h1>
          <h3
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-teal-200"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            ALMAROOF
          </h3>
        </div>

        {/* Subtitle */}
        <div ref={subtitleRef} style={subtitleStyle}>
          <p
            className="text-xl md:text-2xl lg:text-3xl text-gray-200 mb-8 mt-8"
            style={{ fontFamily: "Roboto, serif" }}
          >
            Executive Chairman, Oshodi-Isolo Local Government Area
          </p>
        </div>

        {/* Description */}
        <div ref={descRef} style={descStyle}>
          <p
            className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12"
            style={{ fontFamily: "Roboto, serif" }}
          >
            A dedicated leader committed to transforming Oshodi-Isolo through
            innovative governance, community development, and sustainable
            progress for all residents.
          </p>
        </div>

        {/* CTA Buttons & Scroll Indicator */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
          <a href="/projects">
            <button
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Learn More About My Vision
            </button>
          </a>
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
          <a href="/contact">
            <button
              className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-emerald-800 font-bold rounded-full transform hover:scale-105 transition-all duration-300"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Get In Touch
            </button>
          </a>
        </div>
      </div>

      {/* Note: The old scroll indicator has been removed from here */}
    </section>
  );
}
