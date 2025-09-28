//src/components/common/buttons/shareButtons.js
"use client";

import React from "react";

export default function ShareButton({ title, excerpt }) {
  // Use the article props passed from the parent Server Component
  const articleTitle = title || "";
  const articleExcerpt = excerpt || "No excerpt available.";

  const handleShare = () => {
    if (navigator.share) {
      // The browser API logic is now safe inside a Client Component
      navigator.share({
        title: articleTitle,
        text: articleExcerpt,
        url: window.location.href, // This browser API is also safe here
      });
    } else {
      // Optional: Fallback for browsers that don't support navigator.share
      alert("Web Share API not supported on this device/browser.");
    }
  };

  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 rounded-lg hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
      onClick={handleShare} // The onClick handler is now safe
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
          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
        />
      </svg>
      <span className="hidden sm:inline">Share</span>
    </button>
  );
}
