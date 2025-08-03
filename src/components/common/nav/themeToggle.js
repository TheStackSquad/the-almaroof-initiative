// src/components/common/nav/themeToggle.jsx
import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { iconRotateVariants } from "@/animation/navbarAnimate";

export default function ThemeToggle({ theme, toggleTheme }) {
  return (
    <motion.button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      whileTap={{ scale: 0.9 }}
      variants={iconRotateVariants}
      animate={theme === "dark" ? "open" : "closed"}
      className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </motion.button>
  );
}
