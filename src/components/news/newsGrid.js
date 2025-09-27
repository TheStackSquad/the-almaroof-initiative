// src/components/news/newsGrid.js

"use client";

import { useStaggerAnimation, useFadeIn } from "@/animation/aboutAnimate";
import NewsCard from "@/components/news/newsCard";

const NewsGrid = ({
  articles = [],
  // Set defaults for the main news section
  title = "Oshodi Local Government News",
  description = "Stay updated with the latest developments, projects, and initiatives from Oshodi Local Government",
}) => {
  // articles is already the filtered list provided by the parent (server component)
  const displayArticles = articles;

  // Use the length of the *provided* articles for the staggered animation count
  const [gridRef, visibleItems] = useStaggerAnimation(
    displayArticles.length,
    200
  );
  const [titleRef, titleVisible] = useFadeIn(100);

  // Check if there are articles to display
  const hasArticles = displayArticles.length > 0;

  return (
    // Use a unique padding/margin setup to allow different sections to be stacked nicely
    <section className="pt-16 pb-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title - Uses dynamic props */}
        <div
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-800 ${
            titleVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h2
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            {/* Dynamic title based on filter/data source is now passed via props */}
            {title}
          </h2>
          <p
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            style={{ fontFamily: "var(--font-roboto-slab), serif" }}
          >
            {description}
          </p>
        </div>

        {/* Conditional rendering for no articles */}
        {!hasArticles && (
          <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              No articles found in this section.
            </p>
            <p className="text-md text-gray-500 dark:text-gray-400 mt-2">
              Please check back later for updates or adjust the selected
              category.
            </p>
          </div>
        )}

        {/* News Grid */}
        {hasArticles && (
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {displayArticles.map((article, index) => (
              <div
                key={article.id}
                className={`transition-all duration-500 ${
                  index < visibleItems
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <NewsCard article={article} />
              </div>
            ))}
          </div>
        )}

        {/* Load More Button - Only shows if there are articles to encourage further exploration */}
        {hasArticles && (
          <div className="text-center mt-16">
            <button className="px-8 py-4 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-700 dark:hover:bg-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl font-montserrat">
              View Full News Archive
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsGrid;
