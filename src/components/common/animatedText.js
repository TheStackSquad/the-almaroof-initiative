// src/components/common/animatedText.js
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { animatedTextVariants } from "@/animation/serviceAnimation";

const services = [
  "You can pay for your permit here",
  "Skip the queue, get your birth certificate here",
  "Submit applications for community grants",
  "Report local issues directly to the council",
  "Bringing convenience to your fingertips",
  "Online services: safe, secure, reliable",
];

const AnimatedText = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canAnimate, setCanAnimate] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  // Progressive enhancement - enable animations after initial render
  useEffect(() => {
    const timer = setTimeout(() => setCanAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Intersection observer for performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Text rotation effect - only when visible
  useEffect(() => {
    if (!isVisible || !canAnimate) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isVisible, canAnimate]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center md:flex-row md:items-center md:justify-between p-4 bg-white
      dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200
      dark:border-gray-700 w-full max-w-4xl mx-auto space-y-4 md:space-y-0"
    >
      {/* Text container - full width on mobile, flex-1 on desktop */}
      <div className="relative w-full md:flex-1 h-12 md:h-16 overflow-hidden md:mr-8 flex items-center justify-center">
        {canAnimate ? (
          <AnimatePresence mode="wait">
            <motion.p
              key={currentIndex}
              variants={animatedTextVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute w-full text-lg md:text-xl font-bold font-body text-gray-800 dark:text-white text-center md:text-left"
              style={{ willChange: "opacity, transform" }}
            >
              {services[currentIndex]}
            </motion.p>
          </AnimatePresence>
        ) : (
          // Fallback without animation for initial render
          <p className="absolute w-full text-lg md:text-xl font-bold font-body text-gray-800 dark:text-white text-center md:text-left">
            {services[currentIndex]}
          </p>
        )}
      </div>

      {/* Button - full width on mobile, auto width on desktop */}
      <Link href="/auth-entry" className="w-full md:w-auto">
        <button className="w-full md:w-auto px-6 py-3 text-base bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
          Get Started
        </button>
      </Link>
    </div>
  );
};

export default AnimatedText;
