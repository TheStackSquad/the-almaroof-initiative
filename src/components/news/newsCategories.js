// src/components/news/newsCategories.js
import { useState } from "react";
import { useSlideIn, useStaggerAnimation } from "../../animation/aboutAnimate";

const NewsCategories = ({ onCategorySelect, activeCategory = "All" }) => {
  const [titleRef, titleStyle] = useSlideIn("up", 200);
  const [categoriesRef, visibleItems] = useStaggerAnimation(8, 100);

  const categories = [
    { name: "All", icon: "📰", count: 24 },
    { name: "Technology", icon: "💻", count: 8 },
    { name: "Science", icon: "🔬", count: 6 },
    { name: "Business", icon: "💼", count: 5 },
    { name: "Environment", icon: "🌱", count: 4 },
    { name: "Politics", icon: "🏛️", count: 3 },
    { name: "Health", icon: "🏥", count: 2 },
    { name: "Sports", icon: "⚽", count: 1 },
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-800 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div ref={titleRef} style={titleStyle} className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Browse by Category
          </h2>
          <p
            className="text-lg text-gray-600 dark:text-gray-300"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            Find news that matters to you
          </p>
        </div>

        {/* Categories Grid */}
        <div
          ref={categoriesRef}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4"
        >
          {categories.map((category, index) => (
            <button
              key={category.name}
              onClick={() =>
                onCategorySelect && onCategorySelect(category.name)
              }
              className={`group relative p-6 rounded-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 ${
                index < visibleItems
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              } ${
                activeCategory === category.name
                  ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {/* Background Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative z-10 text-center">
                <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3
                  className="font-semibold mb-2 text-sm md:text-base"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {category.name}
                </h3>
                <span
                  className="text-xs opacity-75"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  {category.count} articles
                </span>
              </div>

              {/* Active Indicator */}
              {activeCategory === category.name && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-yellow-800"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsCategories;
