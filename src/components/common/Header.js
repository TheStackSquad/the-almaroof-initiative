

// src/components/common/Header.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { NavDropdown } from "../../utils/hooks/navDropdown";
import { useDropdown } from "../../utils/hooks/useDropdown";
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
  {
    path: "/community",
    label: "Community",
    dropdown: [
      { id: "hub", label: "Community Hub", icon: "🏛️", path: "/community" },
      { id: "services", label: "Local Services", icon: "🏢", path: "/community/services" },
      { id: "streets", label: "Streets & Councilors", icon: "🏘️", path: "/community/streets-councilors" },
      { id: "institutions", label: "Public Institutions", icon: "🏫", path: "/community/yellow-page" },
    ],
  },
  { path: "/contact", label: "Contact" },
];

export default function Header() {
  const [theme, setTheme] = useState("light");
  const [menuOpen, setMenuOpen] = useState(false);

  // Use separate hooks for each dropdown
  const [aboutDropdownRef, isAboutOpen, toggleAbout, closeAbout] =
    useDropdown();
  const [communityDropdownRef, isCommunityOpen, toggleCommunity, closeCommunity] =
    useDropdown();

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

  // Corrected: Move the function definition to the parent scope
  const handleMobileLinkClick = () => {
    setMenuOpen(false);
    // Close all dropdowns when a mobile link is clicked
    closeAbout();
    closeCommunity();
  };

  const renderDesktopNavItem = (item) => {
    const isDropdownOpen = item.label === "About" ? isAboutOpen : isCommunityOpen;
    const toggleDropdown = item.label === "About" ? toggleAbout : toggleCommunity;
    const closeDropdown = item.label === "About" ? closeAbout : closeCommunity;
    const dropdownRef = item.label === "About" ? aboutDropdownRef : communityDropdownRef;

    if (item.dropdown) {
      return (
        <div key={item.path} className="relative" ref={dropdownRef}>
          <div className="flex items-center">
            {/* The main link that redirects */}
            <Link
              href={item.path}
              className="relative group px-4 py-2 rounded-l-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1"
            >
              <span className="relative z-10 group-hover:text-primary transition-colors duration-300">
                {item.label}
              </span>
            </Link>

            {/* The dropdown toggle button */}
            <button
              onClick={toggleDropdown}
              className="relative group px-2 py-2 rounded-r-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label={`Toggle ${item.label} dropdown`}
            >
              <motion.span
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="relative z-10"
              >
                <ChevronDown size={16} />
              </motion.span>
              <motion.div
                className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                layoutId="desktopHover"
              />
            </button>
          </div>
          <NavDropdown
            items={item.dropdown}
            isOpen={isDropdownOpen}
            onClose={closeDropdown}
            basePath={item.path}
          />
        </div>
      );
    } else {
      return (
        <div key={item.path}>
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
        </div>
      );
    }
  };

  const renderMobileNavItem = (item) => {
    // Determine which dropdown state and functions to use
    const isDropdownOpen = item.label === "About" ? isAboutOpen : isCommunityOpen;
    const toggleDropdown = item.label === "About" ? toggleAbout : toggleCommunity;
    const closeDropdown = item.label === "About" ? closeAbout : closeCommunity;
    const hrefBase = item.path;

    if (item.dropdown) {
      return (
        <div key={item.path} className="flex flex-col">
          <div className="flex justify-between items-center w-full">
            <Link
              href={item.path}
              onClick={handleMobileLinkClick}
              className="w-full text-left block relative group px-4 py-3 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between"
            >
              <span className="relative z-10 group-hover:text-primary transition-colors duration-300">
                {item.label}
              </span>
            </Link>
            <button
              onClick={toggleDropdown}
              className="p-2 -ml-8 rounded-lg"
              aria-label={`Toggle ${item.label} dropdown`}
            >
              <motion.span
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} />
              </motion.span>
            </button>
          </div>
          <AnimatePresence>
            {isDropdownOpen && (
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
                    href={subItem.path || `${hrefBase}#${subItem.id}`}
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
        </div>
      );
    } else {
      return (
        <Link
          key={item.path}
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
      );
    }
  };

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