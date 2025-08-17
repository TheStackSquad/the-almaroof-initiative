//src/components/about/aboutNavigation.js

"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useFadeIn } from "../../animation/aboutAnimate";

export default function AboutNavigation({ activeSection, onSectionChange }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [navRef, navVisible] = useFadeIn(0);
  const dropdownRef = useRef(null);

  const navItems = [
    { id: "overview", label: "Overview", icon: "👤" },
    { id: "biography", label: "Biography", icon: "📖" },
    { id: "leadership", label: "Leadership Team", icon: "👥" },
    { id: "structure", label: "Office Structure", icon: "🏛️" },
    { id: "achievements", label: "Achievements", icon: "🏆" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentItem =
    navItems.find((item) => item.id === activeSection) || navItems[0];

  return (
    <div
      ref={navRef}
      className={`sticky top-0 z-50 bg-white shadow-lg transition-all duration-1000 ${
        navVisible
          ? "opacity-100 transform translate-y-0"
          : "opacity-0 transform -translate-y-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          {/* Logo/Title (clickable) */}
          <Link href="/" className="flex items-center space-x-4 group">
            <div>
              <h1
                className="text-xl font-bold text-gray-800 group-hover:text-emerald-600 transition"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Otunba Kehinde Almaroof
              </h1>
              <p
                className="text-sm text-gray-600"
                style={{ fontFamily: "Roboto, serif" }}
              >
                About Section
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  activeSection === item.id
                    ? "bg-emerald-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                }`}
                style={{ fontFamily: "Roboto, serif" }}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}

            {/* Back to Home Button */}
            <Link
              href="/"
              className="px-4 py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-full border border-gray-300 transition"
              style={{ fontFamily: "Roboto, serif" }}
            >
              ← Back to Home
            </Link>
          </div>

          {/* Mobile Dropdown */}
          <div className="lg:hidden relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-full shadow-lg"
              style={{ fontFamily: "Roboto, serif" }}
            >
              <span className="text-lg">{currentItem.icon}</span>
              <span className="font-medium">{currentItem.label}</span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            <div
              className={`absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 
                           transform transition-all duration-300 origin-top-right ${
                             isDropdownOpen
                               ? "opacity-100 scale-100 translate-y-0"
                               : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                           }`}
            >
              <div className="py-2">
                {navItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSectionChange(item.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-all duration-200 ${
                      activeSection === item.id
                        ? "bg-emerald-50 text-emerald-700 border-r-4 border-emerald-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-emerald-600"
                    }`}
                    style={{
                      fontFamily: "Roboto, serif",
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                    {activeSection === item.id && (
                      <div className="ml-auto w-2 h-2 bg-emerald-600 rounded-full"></div>
                    )}
                  </button>
                ))}

                {/* Mobile Back to Home Button */}
                <Link
                  href="/"
                  className="block w-full text-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 border-t border-gray-200"
                  style={{ fontFamily: "Roboto, serif" }}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
