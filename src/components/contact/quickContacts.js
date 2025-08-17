// src/components/contact/QuickContacts.js
'use client';

import React from "react";
import { useStaggerAnimation } from "@/animation/aboutAnimate";

const QuickContacts = ({ quickContacts }) => {
  const [ref, visibleItems] = useStaggerAnimation(
    quickContacts?.length || 1,
    150
  );

  const getIcon = (type) => {
    switch (type) {
      case "phone":
        return "📞";
      case "info":
        return "ℹ️";
      case "alert":
        return "⚠️";
      default:
        return "📞";
    }
  };

  const handleCall = (number) => {
    if (typeof window !== "undefined") {
      window.location.href = `tel:${number}`;
    }
  };

  return (
    <section
      className="mb-8 mt-5">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Quick Contacts
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Get in touch quickly via these lines
        </p>
      </div>

      <div
        ref={ref}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      >
        {quickContacts.slice(0, visibleItems).map((item, index) => (
          <div
            key={item.id}
            onClick={() => handleCall(item.number)}
            className={`cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-6 transform transition duration-500 hover:scale-105 opacity-0 translate-y-8`}
            style={{ transitionDelay: `${index * 100}ms`, animation: "fadeInUp 0.5s forwards" }}
          >
            <div className="text-4xl mb-4">{getIcon(item.icon)}</div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {item.title}
            </h3>
            <p className="text-xl font-bold text-gray-700 dark:text-gray-200">
              {item.number}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {item.available}
            </p>
          </div>
        ))}
      </div>

      {/* Simple CSS animation */}
      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(32px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default QuickContacts;
