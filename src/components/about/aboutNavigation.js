//src/components/about/aboutNavigate.js
"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useFadeIn } from "@/animation/aboutAnimate";

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
      className={`sticky top-0 z-50 bg-white shadow-md transition-all duration-1000 ${
        navVisible
          ? "opacity-100 transform translate-y-0"
          : "opacity-0 transform -translate-y-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo/Title (clickable) */}
          <Link href="/" className="flex items-center space-x-2 group shrink-0">
            <div>
              <h1
                className="text-xl font-bold text-gray-800 group-hover:text-emerald-600 transition"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                About
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors duration-300 relative group ${
                  activeSection === item.id
                    ? "text-emerald-600"
                    : "text-gray-600 hover:text-emerald-600"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 transform transition-transform duration-300 ${
                    activeSection === item.id ? "scale-x-100" : "scale-x-0"
                  }`}
                ></span>
              </button>
            ))}

            {/* Back to Home Button (Text Link) */}
            <Link
              href="/"
              className="px-3 py-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-200"
              style={{ fontFamily: "Roboto, serif" }}
            >
              ← Back to Home
            </Link>
          </div>

          {/* Mobile Dropdown */}
          <div className="lg:hidden relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-md shadow"
              style={{ fontFamily: "Roboto, serif" }}
            >
              <span className="flex items-center space-x-2">
                <span className="text-lg">{currentItem.icon}</span>
                <span className="font-medium text-sm">{currentItem.label}</span>
              </span>
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
              className={`absolute right-0 mt-2 w-full bg-white rounded-md shadow-lg border border-gray-200 
                transform transition-all duration-300 origin-top ${
                  isDropdownOpen
                    ? "opacity-100 scale-y-100"
                    : "opacity-0 scale-y-95 pointer-events-none"
                }`}
            >
              <div className="py-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSectionChange(item.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                      activeSection === item.id
                        ? "bg-emerald-50 text-emerald-700 font-bold"
                        : "text-gray-700 hover:bg-gray-50 hover:text-emerald-600"
                    }`}
                    style={{ fontFamily: "Roboto, serif" }}
                  >
                    <span className="flex items-center space-x-3">
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </span>
                  </button>
                ))}
              </div>

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
  );
}
