// src/app/news/page.js

import NewsHero from "../../components/news/newsHero";
import NewsCategories from "../../components/news/newsCategories";
import NewsTrending from "../../components/news/newsTrending";
import NewsGrid from "../../components/news/newsGrid";
import NewsNewsletter from "../../components/news/newsLetter";

// Import server-side data utility functions
import { getNewsArticlesByCategory, getLatestNewsArticles } from "@/data";

/**
 * Main News Page (Server Component)
 * Fetches data based on URL search parameters for efficient rendering.
 * @param {Object} props - Contains Next.js searchParams
 */
export default async function NewsPage({ searchParams }) {
  // 1. Determine the active category from URL search parameters. Defaults to "All".
  // Accessing searchParams.category immediately here resolves the "sync-dynamic-apis" warning.
  const activeCategory = searchParams.category || "All";

  // 2. Fetch the articles needed for the News Grid based on the category.
  let filteredArticles = [];
  if (activeCategory === "All") {
    // If 'All' is selected, fetch a large, sorted list of the latest articles.
    filteredArticles = getLatestNewsArticles(100);
  } else {
    // Fetch articles only for the selected category.
    filteredArticles = getNewsArticlesByCategory(activeCategory);
  }

  // 3. Fetch the articles needed for the Hero section (always the latest 3).
  const heroArticles = getLatestNewsArticles(3);

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-500">
      {/* Hero Section: Display the 3 latest articles */}
      <NewsHero articles={heroArticles} />

      {/* Categories Section: Passes the current active category from the URL */}
      <NewsCategories activeCategory={activeCategory} />

      {/* Trending Section */}
      <NewsTrending />

      {/* News Grid Section: Displays the server-filtered list of articles */}
      <NewsGrid articles={filteredArticles} />

      {/* Newsletter Section */}
      <NewsNewsletter />
    </main>
  );
}
