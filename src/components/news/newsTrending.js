// src/components/news/newsTrending.js

"use client";

import { useSlideIn, useStaggerAnimation } from "@/animation/aboutAnimate";
import Image from "next/image";
import trendingNews from "@/data/trendingData";

const NewsTrending = () => {
  const [titleRef, titleStyle] = useSlideIn("up", 200);
  const [listRef, visibleItems] = useStaggerAnimation(5, 150);

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Side - Title and Description */}
          <div className="lg:w-1/3 lg:sticky lg:top-8 lg:self-start">
            <div ref={titleRef} style={titleStyle}>
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <span className="px-2 sm:px-3 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 text-xs sm:text-sm font-semibold rounded-full whitespace-nowrap">
                  Live Updates
                </span>
              </div>

              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 leading-tight"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Trending Now
              </h2>

              <p
                className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                Explore the latest and most talked-about topics in Oshodi-Isolo
                Local Government.
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse flex-shrink-0"></div>
                  <span>Live Updates</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 flex-shrink-0"></div>
                  <span>Real-time Trends</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Trending List */}
          <div className="lg:w-2/3">
            <div ref={listRef} className="space-y-3 sm:space-y-4">
              {trendingNews.map((news, index) => (
                <article
                  key={news.id}
                  className={`group p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 cursor-pointer border border-gray-200 dark:border-gray-700 ${
                    index < visibleItems
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-8"
                  }`}
                >
                  {/* Mobile Layout (sm and below) */}
                  <div className="sm:hidden">
                    {/* Mobile Header with Category and Read Time */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs font-semibold rounded-full">
                        {news.category}
                      </span>
                      <div className="px-2 py-1 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 text-orange-600 dark:text-orange-300 rounded-lg text-xs font-semibold">
                        {news.trend}
                      </div>
                    </div>

                    {/* Mobile Image */}
                    <div className="w-full h-48 relative overflow-hidden rounded-lg mb-3">
                      <Image
                        src={news.image}
                        fill
                        style={{ objectFit: "cover" }}
                        alt={news.title}
                        className="transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 50vw"
                        priority={index < 2}
                      />
                    </div>

                    {/* Mobile Content */}
                    <div className="space-y-2">
                      <h3
                        className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {news.title}
                      </h3>

                      <div className="flex items-center justify-between">
                        <span
                          className="text-xs text-gray-500 dark:text-gray-400"
                          style={{ fontFamily: "Roboto, sans-serif" }}
                        >
                          {news.readTime} read
                        </span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <svg
                            className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop/Tablet Layout (sm and above) */}
                  <div className="hidden sm:flex sm:items-start">
                    {/* Image container */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 flex-shrink-0 relative overflow-hidden rounded-xl mr-4 sm:mr-6">
                      <Image
                        src={news.image}
                        fill
                        style={{ objectFit: "cover" }}
                        alt={news.title}
                        className="transition-transform duration-300 group-hover:scale-110"
                        sizes="(max-width: 768px) 25vw, (max-width: 1024px) 20vw, 15vw"
                        priority={index < 2}
                      />
                    </div>

                    {/* Content and details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0 pr-2 sm:pr-4">
                      <div className="mb-2">
                        <div className="flex flex-col sm:flex-row sm:items-center mb-2 space-y-1 sm:space-y-0 sm:space-x-3">
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs font-semibold rounded-full self-start">
                            {news.category}
                          </span>
                          <span
                            className="text-xs text-gray-500 dark:text-gray-400"
                            style={{ fontFamily: "Roboto, sans-serif" }}
                          >
                            {news.readTime} read
                          </span>
                        </div>

                        <h3
                          className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight line-clamp-2"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          {news.title}
                        </h3>
                      </div>
                    </div>

                    {/* Trend and arrow */}
                    <div className="flex-shrink-0 flex flex-col items-end justify-between self-stretch min-h-full">
                      {/* Trend Indicator */}
                      <div className="px-2 sm:px-3 py-1 sm:py-2 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 text-orange-600 dark:text-orange-300 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold mb-2">
                        {news.trend}
                      </div>

                      {/* Arrow */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 self-end mt-auto">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsTrending;
