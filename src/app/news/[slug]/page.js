// src/app/news/[slug]/page.js

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ShareButton from "@/components/common/buttons/shareButtons";
import { getArticleBySlug, getRelatedNewsArticles } from "@/data";

// Generate static params for all news articles
export async function generateStaticParams() {
  const [newsArticlesModule, trendingNewsModule] = await Promise.all([
    import("@/data/newsData"),
    import("@/data/trendingData"),
  ]);

  const newsArticles = newsArticlesModule.newsArticles;
  const trendingArticles = trendingNewsModule.default;

  const allArticles = [...newsArticles, ...trendingArticles];

  return allArticles
    .filter((article) => article.slug)
    .map((article) => ({
      slug: article.slug,
    }));
}

// Generate metadata for each news article - FIX: Await params
export async function generateMetadata({ params }) {
  const { slug } = await params; // FIX: Await params before using properties
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "News Article Not Found",
      metadataBase: new URL(
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      ), // FIX: Add metadataBase
    };
  }

  const defaultAuthor = { name: "Local Government Reporter", role: "Staff" };
  const defaultDate = new Date().toISOString().split("T")[0];
  const excerpt = article.excerpt || article.content.substring(0, 150) + "...";

  return {
    title: `${article.title} | Oshodi Local Government News`,
    description: excerpt,
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    ), // FIX: Add metadataBase
    openGraph: {
      title: article.title,
      description: excerpt,
      images: [article.image],
      type: "article",
      publishedTime: article.date || defaultDate,
      authors: [article.author?.name || defaultAuthor.name],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: excerpt,
      images: [article.image],
    },
  };
}

export default async function NewsArticlePage({ params }) {
  const { slug } = await params; // FIX: Await params
  const article = getArticleBySlug(slug);
  const relatedArticles = getRelatedNewsArticles(article?.id, 3);

  if (!article) {
    notFound();
  }

  const articleDate = article.date || "N/A";
  const articleExcerpt = article.excerpt || "No excerpt available.";
  const articleAuthor = article.author || {
    name: "Local Reporter",
    role: "Staff",
    avatar: "/img/placeholderMan.webp",
  };

  const contentParagraphs = (article.content || "")
    .split("\n\n")
    .filter((para) => para.trim());

  // Calculate reading time
  const wordCount = contentParagraphs.join(" ").split(" ").length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Sticky Header Navigation - Enhanced Mobile/Desktop */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-gray-700/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back Button - Enhanced for mobile */}
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-all duration-200 group font-medium"
              style={{ fontFamily: "var(--font-roboto-slab), serif" }}
            >
              <svg
                className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="hidden sm:inline">Back to News</span>
              <span className="sm:hidden">Back</span>
            </Link>

            {/* Share Button - Mobile Friendly */}
            <div className="flex items-center gap-3">
              <ShareButton title={article.title} excerpt={articleExcerpt} />

              {/* Reading Progress Indicator */}
              <div className="hidden md:block w-20 h-1 bg-slate-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300 ease-out"
                  style={{
                    width: "0%",
                    "--reading-progress": "0%",
                  }}
                  id="reading-progress"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container - Enhanced Responsive */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header - Enhanced Mobile Layout */}
        <header className="mb-12">
          {/* Category Badge */}
          <div className="flex justify-center mb-6">
            <span
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide shadow-lg"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              {article.category}
            </span>
          </div>

          {/* Title - Responsive Typography */}
          <h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight text-center px-2 sm:px-0"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            {article.title}
          </h1>

          {/* Excerpt - Enhanced Mobile */}
          <p
            className="text-lg sm:text-xl text-slate-600 dark:text-gray-300 italic mb-8 max-w-3xl mx-auto text-center leading-relaxed px-4 sm:px-0"
            style={{ fontFamily: "var(--font-roboto-slab), serif" }}
          >
            {articleExcerpt}
          </p>

          {/* Author & Meta Info - Responsive Layout */}
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 dark:border-gray-700/60 shadow-lg">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
              {/* Author Info */}
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden ring-4 ring-blue-100 dark:ring-blue-900/30 shadow-md">
                  <Image
                    src={articleAuthor.avatar || "/img/placeholderMan.webp"}
                    alt={articleAuthor.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <p
                    className="text-slate-900 dark:text-white font-semibold text-lg"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                  >
                    {articleAuthor.name}
                  </p>
                  <p
                    className="text-slate-600 dark:text-gray-400 text-sm"
                    style={{ fontFamily: "var(--font-roboto-slab), serif" }}
                  >
                    {articleAuthor.role}
                  </p>
                </div>
              </div>

              {/* Divider for mobile */}
              <div className="hidden sm:block w-px h-12 bg-slate-300 dark:bg-gray-600"></div>
              <div className="sm:hidden w-full h-px bg-slate-300 dark:bg-gray-600"></div>

              {/* Date & Reading Time */}
              <div className="text-center">
                <p
                  className="text-slate-900 dark:text-white font-semibold flex items-center gap-2 justify-center"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  <svg
                    className="w-4 h-4 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {articleDate}
                </p>
                <p
                  className="text-slate-600 dark:text-gray-400 text-sm flex items-center gap-2 justify-center mt-1"
                  style={{ fontFamily: "var(--font-roboto-slab), serif" }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {readingTime} min read
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image - Enhanced Responsive */}
        <div className="relative aspect-[16/9] sm:aspect-[16/10] lg:aspect-[16/9] mb-12 rounded-2xl overflow-hidden shadow-2xl shadow-slate-200/60 dark:shadow-gray-900/60">
          <Image
            src={article.image || "/api/placeholder/800/400"}
            alt={article.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
          />

          {/* Image Overlay for Better Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        </div>

        {/* Article Content - Enhanced Typography */}
        <article className="prose prose-lg sm:prose-xl max-w-none dark:prose-invert prose-slate">
          <div
            className="text-slate-700 dark:text-gray-300 leading-relaxed"
            style={{
              fontFamily: "var(--font-roboto-slab), serif",
              textRendering: "optimizeLegibility",
              fontFeatureSettings: '"kern" 1, "liga" 1',
            }}
          >
            {contentParagraphs.map((paragraph, index) => (
              <p
                key={index}
                className={`mb-6 sm:mb-8 text-base sm:text-lg lg:text-xl leading-relaxed ${
                  index === 0
                    ? "text-xl sm:text-2xl font-medium text-slate-800 dark:text-gray-200 border-l-4 border-blue-500 pl-6 bg-blue-50/30 dark:bg-blue-900/20 py-4 rounded-r-lg"
                    : ""
                }`}
                style={{
                  textAlign: "justify",
                  hyphens: "auto",
                  wordSpacing: "0.02em",
                  letterSpacing: "0.01em",
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </article>

        {/* Tags Section - Enhanced Mobile */}
        <footer className="mt-16 pt-8 border-t border-slate-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-3 justify-center sm:justify-start mb-8">
            {[article.category, ...(article.tags || [])].map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                style={{ fontFamily: "var(--font-roboto-slab), serif" }}
              >
                #{tag.toLowerCase()}
              </span>
            ))}
          </div>
        </footer>

        {/* Related Articles - Enhanced Mobile Grid */}
        {relatedArticles.length > 0 && (
          <section className="py-16 border-t border-slate-200 dark:border-gray-700">
            <div className="text-center mb-12">
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                You Might Also Like
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {relatedArticles.map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  href={`/news/${relatedArticle.slug}`}
                  className="group"
                >
                  <article className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/60 dark:border-gray-700/60 group-hover:-translate-y-2 h-full flex flex-col">
                    <div className="relative aspect-[16/10] mb-4 rounded-xl overflow-hidden bg-slate-100 dark:bg-gray-700">
                      <Image
                        src={relatedArticle.image || "/api/placeholder/300/200"}
                        alt={relatedArticle.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>

                    <div className="flex-grow flex flex-col">
                      <h3
                        className="font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-grow"
                        style={{
                          fontFamily: "var(--font-montserrat), sans-serif",
                        }}
                      >
                        {relatedArticle.title}
                      </h3>

                      <p
                        className="text-sm text-slate-600 dark:text-gray-400 line-clamp-3 mb-4"
                        style={{ fontFamily: "var(--font-roboto-slab), serif" }}
                      >
                        {relatedArticle.excerpt ||
                          relatedArticle.content.substring(0, 120) + "..."}
                      </p>

                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-gray-500 mt-auto">
                        <span>{relatedArticle.date || "Recent"}</span>
                        <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium group-hover:gap-2 transition-all">
                          Read more
                          <svg
                            className="w-3 h-3"
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
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Reading Progress Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if (typeof window !== 'undefined') {
              let ticking = false;
              function updateReadingProgress() {
                const scrollTop = window.pageYOffset;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = (scrollTop / docHeight) * 100;
                const progressBar = document.getElementById('reading-progress');
                if (progressBar) {
                  progressBar.style.width = Math.min(scrollPercent, 100) + '%';
                }
                ticking = false;
              }
              
              function requestTick() {
                if (!ticking) {
                  requestAnimationFrame(updateReadingProgress);
                  ticking = true;
                }
              }
              
              window.addEventListener('scroll', requestTick);
            }
          `,
        }}
      />
    </div>
  );
}
