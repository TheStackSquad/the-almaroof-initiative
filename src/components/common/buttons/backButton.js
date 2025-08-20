// src/components/common/buttons/backButton.js
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BackButton({
  href = null,
  text = "Back To Services",
  className = "",
  position = "top-right", // New prop for position
}) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const buttonClass = `
    flex items-center gap-2 text-gray-900 hover:text-blue-800
    transition-colors duration-200 font-medium mt-12 dark:text-gray-200
    ${className}
  `;

  // Define position-specific classes
  let positionClass = "";
  if (position === "top-right") {
    positionClass = "flex justify-end pr-4 mt-10";
  } else if (position === "top-left") {
    positionClass = "flex justify-start pl-4 mt-10";
  }

  const content = href ? (
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
  ) : (
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

  return <div className={positionClass}>{content}</div>;
}
