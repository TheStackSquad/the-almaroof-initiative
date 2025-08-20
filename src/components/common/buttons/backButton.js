// src/components/common/buttons/BackButton.js
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BackButton({
  href = null,
  text = "Back",
  className = "",
}) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const buttonClass = `
    flex items-center gap-2 text-blue-600 hover:text-blue-800 
    transition-colors duration-200 font-medium
    ${className}
  `;

  // If href is provided, use Link for specific navigation
  if (href) {
    return (
      <Link href={href} className={buttonClass}>
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
        {text}
      </Link>
    );
  }

  // Otherwise use router.back()
  return (
    <button onClick={handleBack} className={buttonClass}>
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
          d="M15 19l-7-7 7-7"
        />
      </svg>
      {text}
    </button>
  );
}
