// src/components/common/nav/mobileMenu.jsx
import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { mobileMenuVariants } from "@/animation/navbarAnimate";

export default function MobileMenu({
  menuOpen,
  setMenuOpen,
  navItems,
  isAboutOpen,
  toggleAbout,
  closeAbout,
  isCommunityOpen,
  toggleCommunity,
  closeCommunity,
}) {
  const handleMobileLinkClick = () => {
    setMenuOpen(false);
    // Close all dropdowns when a mobile link is clicked
    closeAbout();
    closeCommunity();
  };

  const renderMobileNavItem = (item) => {
    // Determine which dropdown state to use based on item label
    const isDropdownOpen =
      item.label === "About"
        ? isAboutOpen
        : item.label === "Community"
        ? isCommunityOpen
        : false;
    const toggleDropdown =
      item.label === "About"
        ? toggleAbout
        : item.label === "Community"
        ? toggleCommunity
        : null;
    const hrefBase = item.path;

    if (item.dropdown) {
      return (
        <div key={item.path} className="flex flex-col">
          {/* Main item with dropdown toggle */}
          <div className="flex items-center w-full">
            <Link
              href={item.path}
              onClick={handleMobileLinkClick}
              className="flex-1 text-left block relative group px-4 py-3 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span className="relative z-10 group-hover:text-primary transition-colors duration-300">
                {item.label}
              </span>
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (toggleDropdown) {
                  toggleDropdown();
                }
              }}
              className="p-3 mr-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label={`Toggle ${item.label} dropdown`}
            >
              <motion.div
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} />
              </motion.div>
            </button>
          </div>

          {/* Dropdown content */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pl-4 pb-2">
                  {item.dropdown.map((subItem) => (
                    <Link
                      key={subItem.id}
                      href={subItem.path || `${hrefBase}#${subItem.id}`}
                      onClick={handleMobileLinkClick}
                      className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 rounded-lg ml-2 my-1"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base">{subItem.icon}</span>
                        <span>{subItem.label}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    } else {
      // Regular nav item without dropdown
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
    <AnimatePresence>
      {menuOpen && (
        <motion.nav
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
  );
}
