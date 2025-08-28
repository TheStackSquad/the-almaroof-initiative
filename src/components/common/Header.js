// src/components/common/Header.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useDropdown } from "@/utils/hooks/useDropdown";
// Import the new sub-components
import DesktopNav from "./nav/desktopNav";
import MobileMenu from "./nav/mobileMenu";
import ThemeToggle from "./nav/themeToggle";

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
      {
        id: "services",
        label: "Local Services",
        icon: "🏢",
        path: "/community/services",
      },
      {
        id: "institutions",
        label: "Public Institutions",
        icon: "🏫",
        path: "/community/yellow-page",
      },
    ],
  },
  { path: "/contact", label: "Contact" },
];

export default function Header() {
  const [theme, setTheme] = useState("light");
  const [menuOpen, setMenuOpen] = useState(false);

  // Desktop dropdown states
  const [aboutDropdownRef, isAboutOpen, toggleAbout, closeAbout] =
    useDropdown();
  const [
    communityDropdownRef,
    isCommunityOpen,
    toggleCommunity,
    closeCommunity,
  ] = useDropdown();

  // Mobile dropdown states (separate from desktop)
  const [, isMobileAboutOpen, toggleMobileAbout, closeMobileAbout] =
    useDropdown();
  const [, isMobileCommunityOpen, toggleMobileCommunity, closeMobileCommunity] =
    useDropdown();

  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
    document.documentElement.classList.toggle("dark", storedTheme === "dark");
  }, []);

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
        // Close mobile dropdowns when menu closes
        closeMobileAbout();
        closeMobileCommunity();
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen, closeMobileAbout, closeMobileCommunity]);

  // Close mobile dropdowns when menu closes
  useEffect(() => {
    if (!menuOpen) {
      closeMobileAbout();
      closeMobileCommunity();
    }
  }, [menuOpen, closeMobileAbout, closeMobileCommunity]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleMenuToggle = () => {
    const newMenuOpen = !menuOpen;
    setMenuOpen(newMenuOpen);

    // Close all dropdowns when closing menu
    if (!newMenuOpen) {
      closeMobileAbout();
      closeMobileCommunity();
      closeAbout();
      closeCommunity();
    }
  };

  return (
    <header className="w-full fixed top-0 z-50 bg-white/80 dark:bg-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group">
          <motion.div
            className="text-xl font-display font-bold text-gray-900 dark:text-white transition-all duration-300 group-hover:text-primary group-hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Almaroof
          </motion.div>
        </Link>

        {/* Desktop: Nav + Theme + Language grouped together */}
        <div className="hidden lg:flex items-center gap-6">
          <DesktopNav
            navItems={navItems}
            isAboutOpen={isAboutOpen}
            toggleAbout={toggleAbout}
            closeAbout={closeAbout}
            aboutDropdownRef={aboutDropdownRef}
            isCommunityOpen={isCommunityOpen}
            toggleCommunity={toggleCommunity}
            closeCommunity={closeCommunity}
            communityDropdownRef={communityDropdownRef}
          />

          {/* Theme and Language switcher grouped closely */}
          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </div>

        {/* Mobile Icons: Language + Theme + Menu */}
        <div className="flex items-center space-x-2 lg:hidden">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <motion.button
            ref={menuButtonRef}
            onClick={handleMenuToggle}
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
      <div ref={menuRef}>
        <MobileMenu
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          navItems={navItems}
          isAboutOpen={isMobileAboutOpen}
          toggleAbout={toggleMobileAbout}
          closeAbout={closeMobileAbout}
          isCommunityOpen={isMobileCommunityOpen}
          toggleCommunity={toggleMobileCommunity}
          closeCommunity={closeMobileCommunity}
        />
      </div>
    </header>
  );
}
