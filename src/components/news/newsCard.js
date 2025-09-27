// src/components/news/newsCard.js
import { useFadeIn } from "../../animation/aboutAnimate";
import Image from "next/image";
import Link from "next/link";

const NewsCard = ({ article, delay = 0 }) => {
  const [cardRef, cardVisible] = useFadeIn(delay);

  // Define robust fallbacks for potentially missing fields (especially from trendingData)
  const articleSlug = article.slug || `news-id-${article.id}`; // CRITICAL for Link
  const articleDate = article.date || "N/A";
  // Fallback to the first 100 characters of 'content' if 'excerpt' is missing
  const articleExcerpt = article.excerpt || (article.content ? article.content.substring(0, 100) + '...' : 'No description available.');
  // Safe access to nested author properties
  const authorName = article.author?.name || "Local Reporter";
  const authorAvatar = article.author?.avatar || "/api/placeholder/32/32";

  // If the article is missing a slug, we cannot generate a valid link, 
  // so we skip rendering it or link to a placeholder page.
  if (!articleSlug) return null; 

  return (
    <Link href={`/news/${articleSlug}`} className="block group">
      <article
        ref={cardRef}
        className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 cursor-pointer ${
          cardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Featured Image */}
        <div className="relative h-56 overflow-hidden">
          <Image
            src={article.image || "/api/placeholder/400/224"}
            alt={article.title}
            fill
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span
              className="px-3 py-1 bg-blue-600 dark:bg-blue-500 text-white text-sm font-semibold rounded-full"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              {article.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Meta Information */}
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
            <time
              className="mr-4"
              style={{ fontFamily: "var(--font-roboto-slab), serif" }}
            >
              {articleDate} {/* Uses robust date */}
            </time>
            <span
              className="flex items-center"
              style={{ fontFamily: "var(--font-roboto-slab), serif" }}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              {article.readTime || "N/A"} {/* Safe readTime */}
            </span>
          </div>

          {/* Title */}
          <h3
            className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            {article.title}
          </h3>

          {/* Excerpt */}
          <p
            className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed"
            style={{ fontFamily: "var(--font-roboto-slab), serif" }}
          >
            {articleExcerpt} {/* Uses robust excerpt */}
          </p>

          {/* Author and Read More */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative w-8 h-8 rounded-full mr-3 overflow-hidden">
                <Image
                  src={authorAvatar}
                  alt={authorName}
                  fill
                  className="object-cover"
                />
              </div>
              <span
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                style={{ fontFamily: "var(--font-roboto-slab), serif" }}
              >
                {authorName} {/* Uses robust author name */}
              </span>
            </div>

            <div className="flex items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300 font-semibold transition-colors duration-300">
              Read More
              <svg
                className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1"
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
    </Link>
  );
};

export default NewsCard;