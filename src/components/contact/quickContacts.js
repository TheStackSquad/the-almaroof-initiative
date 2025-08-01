// src/components/contact/QuickContacts.js

import React from "react";
import { useStaggerAnimation } from "../../animation/aboutAnimate"; // Assuming this path is correct

const QuickContacts = ({ quickContacts }) => {
  const [ref, visibleItems] = useStaggerAnimation(quickContacts.length, 150);

  const getIcon = (iconType) => {
    switch (iconType) {
      case "phone":
        return (
          <svg
            className="w-6 h-6"
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
        );
      case "info":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "alert":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L5.232 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-6 h-6"
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
        );
    }
  };

  const handleCall = (number) => {
    // Check if window is defined (for client-side only execution)
    if (typeof window !== "undefined") {
      window.location.href = `tel:${number}`;
    }
  };

  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Quick Contacts
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Get in touch with us quickly through these direct lines
        </p>
      </div>

      <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickContacts.slice(0, visibleItems).map((contact) => (
          <div
            key={contact.id}
            className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-500 hover:shadow-xl dark:hover:shadow-gray-900/70 hover:scale-105 cursor-pointer opacity-0 translate-y-8`}
            style={{ transitionDelay: `${contact.id * 50}ms` }}
            onClick={() => handleCall(contact.number)}
          >
            <div className="p-6 text-center">
              {/* Icon */}
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-white ${
                  contact.icon === "phone"
                    ? "bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700"
                    : contact.icon === "info"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700"
                    : "bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700"
                }`}
              >
                {getIcon(contact.icon)}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
                {contact.title}
              </h3>

              {/* Number */}
              <p className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
                {contact.number}
              </p>

              {/* Availability */}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Availability: {contact.available}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickContacts; // Export as default for easier import
