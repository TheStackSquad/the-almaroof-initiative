// src/app/news/[slug]/page.js

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
// FIX 1: Changed imported function name from getNewsArticleBySlug to the correct name, getArticleBySlug.
import { getArticleBySlug, getRelatedNewsArticles } from "@/data";

// Generate static params for all news articles
export async function generateStaticParams() {
  // 1. Import both newsData and trendingData
  const [newsArticlesModule, trendingNewsModule] = await Promise.all([
    import("@/data/newsData"),
    import("@/data/trendingData"),
  ]);

  const newsArticles = newsArticlesModule.newsArticles;
  // NOTE: trendingData.js was exported as 'export default trendingNews;'
  const trendingArticles = trendingNewsModule.default;

  // 2. Combine all articles for static paths generation
  const allArticles = [...newsArticles, ...trendingArticles];

  // 3. Map all articles to their slugs
  return allArticles
    .filter((article) => article.slug) // Filter out articles without a slug (like those in trendingData)
    .map((article) => ({
      slug: article.slug,
    }));
}

// Generate metadata for each news article
export async function generateMetadata({ params }) {
  // FIX 2: Using the correct function name
  const article = getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: "News Article Not Found",
    };
  }

  // Provide defaults for missing fields in trending data for safer metadata generation
  const defaultAuthor = { name: "Local Government Reporter", role: "Staff" };
  const defaultDate = new Date().toISOString().split("T")[0];
  const excerpt = article.excerpt || article.content.substring(0, 150) + "...";

  return {
    title: `${article.title} | Oshodi Local Government News`,
    description: excerpt,
    openGraph: {
      title: article.title,
      description: excerpt,
      images: [article.image],
      type: "article",
      publishedTime: article.date || defaultDate,
      authors: [article.author?.name || defaultAuthor.name],
    },
  };
}

export default async function NewsArticlePage({ params }) {
  // FIX 3: Using the correct function name to fetch the article
  const article = getArticleBySlug(params.slug);
  const relatedArticles = getRelatedNewsArticles(article?.id, 3);

  if (!article) {
    notFound();
  }

  // Define defaults for fields that might be missing in the 'trendingData' structure
  const articleDate = article.date || "N/A";
  const articleExcerpt = article.excerpt || "No excerpt available.";
  const articleAuthor = article.author || {
    name: "Local Reporter",
    role: "Staff",
    avatar: "/api/placeholder/48/48",
  };

  // Format content into paragraphs
  // Add a null/undefined check for article.content to prevent errors on bad data
  const contentParagraphs = (article.content || "")
    .split("\n\n")
    .filter((para) => para.trim());

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Back Button Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/news"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
            style={{ fontFamily: "var(--font-roboto-slab), serif" }}
          >
            <svg
              className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to All News
          </Link>
        </div>
      </header>

      {/* Main Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <header className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <span
              className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              {article.category}
            </span>
          </div>

          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            {article.title}
          </h1>

          <p
            className="text-xl text-gray-600 dark:text-gray-300 italic mb-8 max-w-3xl mx-auto"
            style={{ fontFamily: "var(--font-roboto-slab), serif" }}
          >
            {articleExcerpt}
          </p>

          {/* Author & Date Info */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={articleAuthor.avatar || "/api/placeholder/48/48"}
                  alt={articleAuthor.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-left">
                <p
                  className="text-gray-900 dark:text-white font-medium"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  {articleAuthor.name}
                </p>
                <p
                  className="text-sm"
                  style={{ fontFamily: "var(--font-roboto-slab), serif" }}
                >
                  {articleAuthor.role}
                </p>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <p
                className="text-gray-900 dark:text-white font-medium"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                {articleDate}
              </p>
              <p
                className="text-sm"
                style={{ fontFamily: "var(--font-roboto-slab), serif" }}
              >
                {article.readTime}
              </p>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative h-80 md:h-96 mb-8 rounded-xl overflow-hidden">
          <Image
            src={article.image || "/api/placeholder/800/400"}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <div
            className="text-gray-700 dark:text-gray-300 leading-relaxed"
            style={{ fontFamily: "var(--font-roboto-slab), serif" }}
          >
            {contentParagraphs.map((paragraph, index) => (
              <p key={index} className="mb-6 text-lg">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-3 mb-8">
            {[article.category, ...(article.tags || [])].map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full text-sm"
                style={{ fontFamily: "var(--font-roboto-slab), serif" }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </footer>
      </article>

      {/* Related Articles Section */}
      {relatedArticles.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-200 dark:border-gray-700">
          <h2
            className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            Related News
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((relatedArticle) => (
              <Link
                key={relatedArticle.id}
                href={`/news/${relatedArticle.slug}`}
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <h3
                    className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                  >
                    {relatedArticle.title}
                  </h3>
                  <p
                    className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2"
                    style={{ fontFamily: "var(--font-roboto-slab), serif" }}
                  >
                    {relatedArticle.excerpt ||
                      relatedArticle.content.substring(0, 50) + "..."}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
