// src/components/common/LanguageSwitcher.jsx
"use client";

import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en"); // Default language
  const dropdownRef = useRef(null);

  const languages = [
    { code: "en", name: "English" },
    { code: "yo", name: "Yorùbá" },
    { code: "pcm", name: "Pidgin" },
  ];

  useEffect(() => {
    // Ensure i18n is initialized
    if (i18n) {
      setCurrentLang(i18n.language || "en");
    }
  }, [i18n]);

  const changeLanguage = (lang) => {
    if (i18n) {
      i18n.changeLanguage(lang);
      setCurrentLang(lang);
    }
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Change language"
      >
        <Globe className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {currentLang.toUpperCase()}
        </span>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                currentLang === lang.code
                  ? "bg-gray-100 dark:bg-gray-700 font-medium"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {lang.name}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
