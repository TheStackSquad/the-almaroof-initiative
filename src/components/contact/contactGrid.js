//src/components/contact/ContactGrid.js

import React, { useState, useCallback, useMemo } from "react";
import ContactCard from "@/components/contact/contactCard";
import { useStaggerAnimation } from "@/animation/aboutAnimate";

const ContactGrid = ({ contacts, title, description }) => {
  const [ref, visibleItems] = useStaggerAnimation(contacts.length, 100);

  // State to track which card is expanded
  const [expandedCardId, setExpandedCardId] = useState(null);

  // Memoized handler for toggling card expansion to prevent unnecessary re-renders
  const handleCardToggle = useCallback((cardId) => {
    setExpandedCardId((prevId) => (prevId === cardId ? null : cardId));
  }, []);

  // Memoized contacts for performance
  const memoizedContacts = useMemo(() => contacts, [contacts]);

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-12 sm:py-16 lg:py-20">
      <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center transition-colors duration-300">
        <svg
          className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 dark:text-gray-500"
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
      <h3 className="text-lg sm:text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
        No contacts found
      </h3>
      <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 transition-colors duration-300 max-w-md mx-auto">
        Try adjusting your search or filter criteria to find the contacts you&apos;re
        looking for
      </p>
    </div>
  );

  // Section Header component
  const SectionHeader = () => (
    <div className="text-center mb-8 sm:mb-10 lg:mb-12">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4 transition-colors duration-300">
        {title}
      </h2>
      {description && (
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed transition-colors duration-300 px-4">
          {description}
        </p>
      )}
    </div>
  );

  // Load More Button component
  const LoadMoreButton = () => (
    <div className="text-center mt-8 sm:mt-10 lg:mt-12">
      <button
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        aria-label="Load more contacts"
      >
        <span>Load More Contacts</span>
        <svg
          className="w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5"
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
  );

  // Early return for empty state
  if (!memoizedContacts || memoizedContacts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="mb-8 sm:mb-12 lg:mb-16">
      {/* Section Header */}
      {title && <SectionHeader />}

      {/* Contact Cards Grid */}
      <div
        ref={ref}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-0"
      >
        {memoizedContacts.map((contact, index) => {
          // Create unique key using contact.id or fallback to index
          const cardKey = contact.id || `contact-${index}`;

          return (
            <div
              key={cardKey}
              className={`transition-all duration-500 ease-out ${
                index < visibleItems
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                transitionDelay: `${Math.min(index * 50, 300)}ms`, // Cap delay for performance
              }}
            >
              <ContactCard
                contact={contact}
                delay={index * 100}
                isExpanded={expandedCardId === cardKey}
                onToggleExpand={handleCardToggle}
              />
            </div>
          );
        })}
      </div>

      {/* Load More Button - Only show if more than 6 contacts */}
      {memoizedContacts.length > 6 && <LoadMoreButton />}
    </div>
  );
};

// Performance optimization with React.memo
export default React.memo(ContactGrid);
