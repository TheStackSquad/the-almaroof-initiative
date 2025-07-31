// src/components/common/Header.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { NavDropdown } from "./navDropdown";
import { useDropdown } from "@/utils/hooks/useDropdown";
import {
  mobileMenuVariants,
  iconRotateVariants,
} from "@/animation/navbarAnimate";

const navItems = [
  { path: "/", label: "Home" },
  {
    path: "/about",
    label: "About",
    dropdown: [
      { id: "overview", label: "Overview", icon: "👤" },
      { id: "biography", label: "Biography", icon: "📖" },
      { id: "leadership", label: "Leadership Team", icon: "👥" },
      { id: "structure", label: "Office Structure", icon: "🏛️" },
      { id: "achievements", label: "Achievements", icon: "🏆" },
    ],
  },
  { path: "/news", label: "News" },
  { path: "/projects", label: "Projects" },
  { path: "/contact", label: "Contact" },
];

export default function Header() {
  const [theme, setTheme] = useState("light");
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownRef, isAboutOpen, toggleAbout, closeAbout] = useDropdown();
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  // Apply theme class to <html>
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
    document.documentElement.classList.toggle("dark", storedTheme === "dark");
  }, []);

  // Effect to handle clicks outside the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleMobileLinkClick = () => {
    setMenuOpen(false);
    closeAbout();
  };

  const renderDesktopNavItem = (item) => (
    <div
      key={item.path}
      className="relative"
      ref={item.dropdown ? dropdownRef : null}
    >
      {item.dropdown ? (
        <>
          <button
            onClick={toggleAbout}
            className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1"
          >
            <span className="relative z-10 group-hover:text-primary transition-colors duration-300">
              {item.label}
            </span>
            <motion.span
              animate={{ rotate: isAboutOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={16} />
            </motion.span>
            <motion.div
              className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              layoutId="desktopHover"
            />
          </button>
          <NavDropdown
            items={item.dropdown}
            isOpen={isAboutOpen}
            onClose={closeAbout}
          />
        </>
      ) : (
        <Link
          href={item.path}
          className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <span className="relative z-10 group-hover:text-primary transition-colors duration-300">
            {item.label}
          </span>
          <motion.div
            className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            layoutId="desktopHover"
          />
        </Link>
      )}
    </div>
  );

  const renderMobileNavItem = (item) => (
    <div key={item.path}>
      {item.dropdown ? (
        <>
          <button
            onClick={toggleAbout}
            className="w-full text-left block relative group px-4 py-3 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between"
          >
            <span className="relative z-10 group-hover:text-primary transition-colors duration-300">
              {item.label}
            </span>
            <motion.span
              animate={{ rotate: isAboutOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={16} />
            </motion.span>
          </button>
          <AnimatePresence>
            {isAboutOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden pl-4"
              >
                {item.dropdown.map((subItem) => (
                  <Link
                    key={subItem.id}
                    href={`/about#${subItem.id}`}
                    onClick={handleMobileLinkClick}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <span>{subItem.icon}</span>
                      <span>{subItem.label}</span>
                    </div>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <Link
          href={item.path}
          onClick={handleMobileLinkClick}
          className="block relative group px-4 py-3 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <span className="relative z-10 group-hover:text-primary transition-colors duration-300">
            {item.label}
          </span>
          <motion.div
            className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            layoutId="mobileHover"
          />
        </Link>
      )}
    </div>
  );

  return (
    <header className="w-full fixed top-0 z-50 bg-white/80 dark:bg-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="group">
          <motion.div
            className="text-xl font-display font-bold text-gray-900 dark:text-white transition-all duration-300 group-hover:text-primary group-hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Almaroof
          </motion.div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-2 font-cinzel text-gray-700 dark:text-gray-300 text-sm">
          {navItems.map(renderDesktopNavItem)}

          <motion.button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            whileTap={{ scale: 0.9 }}
            variants={iconRotateVariants}
            animate={theme === "dark" ? "open" : "closed"}
            className="ml-4 p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
        </nav>

        {/* Mobile Icons */}
        <div className="flex items-center space-x-2 lg:hidden">
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

          <motion.button
            ref={menuButtonRef}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
          >
            <motion.div
              animate={{ rotate: menuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            ref={menuRef}
            className="lg:hidden bg-white dark:bg-dark border-t border-gray-200 dark:border-gray-700 px-4 py-4 space-y-2 font-cinzel text-sm text-gray-700 dark:text-gray-300"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
          >
            {navItems.map(renderMobileNavItem)}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
