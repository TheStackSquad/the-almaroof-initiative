// src/components/news/newsTrending.js

"use client";

import { useSlideIn, useStaggerAnimation } from "../../animation/aboutAnimate";
import Image from "next/image";
// Import the data keys instead of the full data object
import trendingNewsKeys from "../../data/trendingData";
// Import the translation hook
import { useTranslation } from "react-i18next";

const NewsTrending = () => {
  const { t } = useTranslation(); // Initialize the translation hook
  const [titleRef, titleStyle] = useSlideIn("up", 200);
  const [listRef, visibleItems] = useStaggerAnimation(5, 150);

  // Map over the keys to get the translated news items
  const translatedNews = trendingNewsKeys.map((item) => ({
    ...item,
    ...t(item.key), // Use the 'key' to get the translated object
  }));

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Side - Title and Description */}
          <div className="lg:w-1/3">
            <div ref={titleRef} style={titleStyle}>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-white"
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
                <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 text-sm font-semibold rounded-full">
                  {t("news.trending.live_updates")}{" "}
                  {/* Use key for translation */}
                </span>
              </div>
              <h2
                className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {t("news.trending.title")} {/* Use key for translation */}
              </h2>
              <p
                className="text-lg text-gray-600 dark:text-gray-300 mb-8"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {t("news.trending.description")} {/* Use key for translation */}
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span>{t("news.trending.live_updates")}</span> {/* Use key */}
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span>{t("news.trending.real_time_trends")}</span>{" "}
                  {/* Use key */}
                </div>
              </div>
            </div>
          </div>
          {/* Right Side - Trending List */}
          <div className="lg:w-2/3">
            <div ref={listRef} className="space-y-4">
              {translatedNews.map((news, index) => (
                <article
                  key={news.id}
                  className={`group p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 cursor-pointer border border-gray-200 dark:border-gray-700 flex items-start ${
                    index < visibleItems
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-8"
                  }`}
                >
                  {/* Image container */}
                  <div className="w-24 h-24 flex-shrink-0 relative overflow-hidden rounded-xl mr-6">
                    <Image
                      src={news.image}
                      fill
                      style={{ objectFit: "cover" }}
                      alt={news.title}
                      className="transition-transform duration-300 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  {/* Content and details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="mb-2">
                      <div className="flex items-center mb-1">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs font-semibold rounded-full mr-3">
                          {news.category}{" "}
                          {/* Now comes from the translated object */}
                        </span>
                        <span
                          className="text-xs text-gray-500 dark:text-gray-400"
                          style={{ fontFamily: "Roboto, sans-serif" }}
                        >
                          {news.readTime} read
                        </span>
                      </div>
                      <h3
                        className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {news.title}{" "}
                        {/* Now comes from the translated object */}
                      </h3>
                    </div>
                  </div>
                  {/* Trend and arrow */}
                  <div className="flex-shrink-0 ml-4 flex flex-col items-end justify-between self-stretch">
                    {/* Trend Indicator */}
                    <div className="px-3 py-2 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 text-orange-600 dark:text-orange-300 rounded-xl text-sm font-semibold mb-2">
                      {news.trend} {/* Now comes from the translated object */}
                    </div>
                    {/* Arrow */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 self-end">
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
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
                </article>
              ))}
            </div>
            {/* View All Trending Button */}
            <div className="mt-8 text-center">
              <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                {t("news.trending.view_all")} {/* Use key for translation */}
                <svg
                  className="w-4 h-4 ml-2 inline"
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
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsTrending;
