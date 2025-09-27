// src/data/index.js
import { newsArticles } from "./newsData";
import trendingNews from "./trendingData";
import { legislativeArticles } from "./legislativeData"; 

// 1. Combine ALL articles for the main news list and slug lookup
// Note: Spreading 'trendingNews' first might place the trending items at the top of the combined array,
// but the 'getLatestNewsArticles' utility function correctly handles sorting by date regardless.
export const allNewsArticles = [
  ...trendingNews,
  ...newsArticles,
  ...legislativeArticles,
  // Add other news sources here later: ...politicalNews, ...businessNews, etc.
];

// 2. Export the original trending list separately for the specific component
export { trendingNews };

// === Utility Functions for News Data ===

// Get all articles
export const getAllNewsArticles = () => allNewsArticles;

/**
 * Helper function to find an article by slug (used by [slug]/page.js)
 * We'll use this name for consistency with the design plan.
 */
export function getArticleBySlug(slug) {
  return allNewsArticles.find((article) => article.slug === slug);
}

/**
 * Helper function to get all slugs for Next.js generateStaticParams
 */
export function getAllSlugs() {
  // Returns an array of objects structured as { slug: '...' } as required by Next.js
  return allNewsArticles.map((article) => ({ slug: article.slug }));
}

// Get articles by category
export const getNewsArticlesByCategory = (category) => {
  return allNewsArticles.filter((article) => article.category === category);
};

// Get featured articles (requires 'isFeatured' to be added to data objects later)
export const getFeaturedNewsArticles = () => {
  return allNewsArticles.filter((article) => article.isFeatured);
};

// Get the latest articles, sorted by date
export const getLatestNewsArticles = (limit = 6) => {
  // Ensure that all articles have a valid 'date' field (which we ensured in the previous step)
  return [...allNewsArticles] // Use a copy of the array for sorting
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
};

// Get related articles (same category, excluding current article)
export const getRelatedNewsArticles = (currentArticleId, limit = 3) => {
  const currentArticle = allNewsArticles.find(
    (article) => article.id === currentArticleId
  );
  if (!currentArticle) return [];

  return allNewsArticles
    .filter(
      (article) =>
        article.id !== currentArticleId &&
        article.category === currentArticle.category
    )
    .slice(0, limit);
};

// Get articles by author
export const getNewsArticlesByAuthor = (authorName) => {
  return allNewsArticles.filter((article) =>
    article.author.name.toLowerCase().includes(authorName.toLowerCase())
  );
};

// Search articles by title or content
export const searchNewsArticles = (query) => {
  const searchTerm = query.toLowerCase();
  return allNewsArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm) ||
      article.content.toLowerCase().includes(searchTerm) ||
      article.excerpt?.toLowerCase().includes(searchTerm)
  );
};


