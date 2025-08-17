//src/components/contact/ContactCard.js
import React, { useState } from "react";
import { useFadeIn } from "@/animation/aboutAnimate";
import Image from "next/image";

const ContactCard = ({
  contact,
  delay = 0,
  isExpanded = null, // For future auto-close functionality
  onToggleExpand = null, // For future auto-close functionality
}) => {
  const [ref, isVisible] = useFadeIn(delay);

  // Use local state if parent doesn't control expansion, otherwise use parent state
  const [localShowDetails, setLocalShowDetails] = useState(false);
  const showDetails = isExpanded !== null ? isExpanded : localShowDetails;

  const handleToggleDetails = () => {
    if (onToggleExpand) {
      // Parent controls the state
      onToggleExpand(contact.id || contact.name);
    } else {
      // Local state control
      setLocalShowDetails(!localShowDetails);
    }
  };

  const handleCall = () => {
    window.location.href = `tel:${contact.phone}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${contact.email}`;
  };

  return (
    <div
      ref={ref}
      className={`bg-white dark:bg-neutral-900 rounded-xl shadow-lg hover:shadow-xl dark:hover:shadow-neutral-700/30 transition-all duration-300 ease-out overflow-hidden border border-gray-100 dark:border-neutral-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{
        transitionDelay: `${delay}ms`,
        willChange: "transform, opacity",
      }}
    >
      {/* Header */}
      <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 text-white transition-colors duration-300">
        {/* Mobile Layout - Stacked */}
        <div className="sm:hidden p-4 space-y-3">
          {/* Image and Basic Info */}
          <div className="flex items-center gap-4">
            {contact.image && (
              <div className="flex-shrink-0">
                <Image
                  src={contact.image}
                  alt={`Profile picture of ${contact.name}`}
                  width={64}
                  height={64}
                  className="rounded-full border-2 border-white/50 shadow-md object-cover"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold leading-tight">
                {contact.name}
              </h3>
              <p className="text-blue-100 dark:text-blue-200 text-sm leading-tight">
                {contact.position}
              </p>
            </div>
          </div>

          {/* Ward Badge - Mobile */}
          {contact.ward && (
            <div className="flex justify-center">
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium">
                Ward {contact.ward}
              </span>
            </div>
          )}
        </div>

        {/* Desktop/Tablet Layout - Side by side */}
        <div className="hidden sm:flex items-center gap-4 sm:gap-6 p-4 sm:p-6">
          {/* Image */}
          {contact.image && (
            <div className="flex-shrink-0">
              <Image
                src={contact.image}
                alt={`Profile picture of ${contact.name}`}
                width={80}
                height={80}
                className="rounded-full border-2 border-white/50 shadow-md object-cover"
              />
            </div>
          )}

          {/* Text Content */}
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-bold leading-tight">{contact.name}</h3>
            <p className="text-blue-100 dark:text-blue-200 mt-1 leading-tight">
              {contact.position}
            </p>
          </div>

          {/* Ward Badge - Desktop */}
          {contact.ward && (
            <div className="flex-shrink-0">
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap">
                Ward {contact.ward}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-5">
          {/* Department */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center transition-colors duration-300 flex-shrink-0">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-300 transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <span className="text-gray-700 dark:text-gray-200 font-medium transition-colors duration-300 text-sm sm:text-base">
              {contact.department}
            </span>
          </div>

          {/* Call + Email Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCall}
              className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white py-3 sm:py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-md active:scale-[0.98]"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Call
            </button>
            <button
              onClick={handleEmail}
              className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white py-3 sm:py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-md active:scale-[0.98]"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Email
            </button>
          </div>

          {/* Show Details Button */}
          <button
            onClick={handleToggleDetails}
            className="w-full text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm flex items-center justify-center gap-2 py-3 border-t border-gray-100 dark:border-neutral-700 mt-5 pt-5 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-neutral-800/50 rounded-lg"
          >
            {showDetails ? "Hide Details" : "Show Details"}
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${
                showDetails ? "rotate-180" : ""
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
        </div>

        {/* Expandable Section */}
        <div
          className={`transition-all duration-500 ease-out overflow-hidden ${
            showDetails ? "max-h-[500px] opacity-100 mt-5" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-4 sm:space-y-5 pt-5 border-t border-gray-100 dark:border-neutral-700">
            {/* Phone */}
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center mt-0.5 transition-colors duration-300 flex-shrink-0">
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors duration-300 mb-1">
                  Phone
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  {contact.phone}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center mt-0.5 transition-colors duration-300 flex-shrink-0">
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors duration-300 mb-1">
                  Email
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 break-words transition-colors duration-300">
                  {contact.email}
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center mt-0.5 transition-colors duration-300 flex-shrink-0">
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0L4.343 16.657a8 8 0 1113.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors duration-300 mb-1">
                  Address
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300 leading-relaxed">
                  {contact.address}
                </p>
              </div>
            </div>

            {/* Bio */}
            {contact.bio && (
              <div className="pt-4 border-t border-gray-100 dark:border-neutral-700 transition-colors duration-300">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 transition-colors duration-300">
                  About
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-300">
                  {contact.bio}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
