//src/components/contact/ContactGrid.js

import React from "react";
import ContactCard from "./contactCard";
import { useStaggerAnimation } from "../../animation/aboutAnimate";

const ContactGrid = ({ contacts, title, description }) => {
  const [ref, visibleItems] = useStaggerAnimation(contacts.length, 100);

  if (contacts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center transition-colors duration-300">
          <svg
            className="w-12 h-12 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
          No contacts found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="mb-12">
      {/* Section Header */}
      {title && (
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3 transition-colors duration-300">
            {title}
          </h2>
          {description && (
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Contact Cards Grid */}
      <div
        ref={ref}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {contacts.map((contact, index) => (
          <div
            key={contact.id}
            className={`transition-all duration-500 ${
              index < visibleItems
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <ContactCard contact={contact} delay={index * 100} />
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {contacts.length > 6 && (
        <div className="text-center mt-8">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
            <span>Load More Contacts</span>
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
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ContactGrid;