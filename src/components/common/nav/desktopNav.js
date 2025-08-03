// src/components/common/nav/DesktopNav.jsx
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { NavDropdown } from "@/utils/hooks/navDropdown";
import ThemeToggle from "./themeToggle";

export default function DesktopNav({
  navItems,
  isAboutOpen,
  toggleAbout,
  closeAbout,
  aboutDropdownRef,
  isCommunityOpen,
  toggleCommunity,
  closeCommunity,
  communityDropdownRef,
  theme,
  toggleTheme,
}) {
  const renderDesktopNavItem = (item) => {
    const isDropdownOpen =
      item.label === "About" ? isAboutOpen : isCommunityOpen;
    const toggleDropdown =
      item.label === "About" ? toggleAbout : toggleCommunity;
    const closeDropdown = item.label === "About" ? closeAbout : closeCommunity;
    const dropdownRef =
      item.label === "About" ? aboutDropdownRef : communityDropdownRef;

    if (item.dropdown) {
      return (
        <div key={item.path} className="relative" ref={dropdownRef}>
          <div className="flex items-center">
            <Link
              href={item.path}
              className="relative group px-4 py-2 rounded-l-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1"
            >
              <span className="relative z-10 group-hover:text-primary transition-colors duration-300">
                {item.label}
              </span>
            </Link>
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

  return (
    <nav className="hidden lg:flex items-center space-x-2 font-cinzel text-gray-700 dark:text-gray-300 text-sm">
      {navItems.map(renderDesktopNavItem)}
      <div className="ml-4">
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>
    </nav>
  );
}
