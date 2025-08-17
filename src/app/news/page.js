// src/app/news/page.js
"use client";

import { useState } from "react";
import NewsHero from "../../components/news/newsHero";
import NewsCategories from "../../components/news/newsCategories";
import NewsTrending from "../../components/news/newsTrending";
// import NewsGrid from "../../components/news/newsGrid";
import NewsNewsletter from "../../components/news/newsLetter";

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [articles, setArticles] = useState([]);

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    // Here you would typically filter articles based on category
    // For now, we'll just update the active category
    console.log("Selected category:", category);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-500">
      {/* Hero Section */}
      <NewsHero />

      {/* Categories Section */}
      <NewsCategories
        onCategorySelect={handleCategorySelect}
        activeCategory={activeCategory}
      />

      {/* Trending Section */}
      <NewsTrending />

      {/* News Grid Section */}
      {/* <NewsGrid articles={articles} /> */}

      {/* Newsletter Section */}
      <NewsNewsletter />
    </main>
  );
}
