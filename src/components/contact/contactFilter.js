//src/components/contact/ContactFilter.js

import React from "react";
import { useSlideIn } from "../../animation/aboutAnimate";

const ContactFilter = ({
  categories,
  activeCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
}) => {
  const [ref, style] = useSlideIn("down", 200);

  return (
    <div
      ref={ref}
      style={style}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/30 p-6 mb-8 transition-all duration-300 border border-gray-100 dark:border-gray-700"
    >
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search contacts by name, position, or department..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700/80 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Filter by Category
        </h3>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeCategory === category.id
                  ? "bg-blue-600 dark:bg-blue-600 text-white shadow-md transform scale-105 hover:bg-blue-700 dark:hover:bg-blue-700"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-sm"
              }`}
            >
              <span>{category.name}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs transition-colors duration-200 ${
                  activeCategory === category.id
                    ? "bg-white/20 dark:bg-gray-800/40 text-white"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-200"
                }`}
              >
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Info */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-blue-50/50 dark:bg-blue-900/20 transition-colors duration-300">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              15
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Total Officials
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-green-50/50 dark:bg-green-900/20 transition-colors duration-300">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              5
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Executive Branch
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-purple-50/50 dark:bg-purple-900/20 transition-colors duration-300">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              10
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Legislative Branch
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactFilter;
