//src/app/community/page.js
"use client";

import { useState, useEffect } from "react";
import PublicInstitutions from "@/components/community/publicInstitutions";
import StreetsAndCouncilors from "@/components/community/streetsAndCouncilors";
import { useFadeIn } from "@/animation/aboutAnimate";
import { publicInstitutions, wardsData } from "@/data/oshodiData";

export default function CommunityPage() {
  const [theme, setTheme] = useState("light");
  const [pageRef, pageIsVisible] = useFadeIn(0);

  useEffect(() => {
    // Sync the dark class with the theme state on the html element
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <style jsx global>{`
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: "Montserrat", sans-serif;
        }
      `}</style>
      <div
        ref={pageRef}
        className={`container mx-auto p-4 transition-opacity duration-1000 ${
          pageIsVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold dark:text-white">
            Oshodi Community Directory
          </h1>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-full font-semibold transition-colors duration-300 bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Switch to {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>

        <div className="space-y-8">
          {/* We no longer need to pass the theme prop */}
          <PublicInstitutions institutions={publicInstitutions} />
          <StreetsAndCouncilors wards={wardsData} />
        </div>
      </div>
    </div>
  );
}