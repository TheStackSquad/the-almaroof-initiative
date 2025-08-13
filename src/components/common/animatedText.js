// src/components/common/animatedText.js
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@nextui-org/react";
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-2 bg-white
    dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200
    dark:border-gray-700 max-w-4xl mx-auto md:p-4">
      {/* Updated parent div to use flexbox for vertical centering */}
      <div className="relative flex-1 h-12 md:h-16 overflow-hidden mb-2 md:mb-0 md:mr-8 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex}
            variants={animatedTextVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            // Removed `top-0` class
            className="absolute w-full text-lg md:text-xl font-bold font-body text-gray-800 dark:text-white text-center md:text-left"
          >
            {services[currentIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
      <Link href="/auth-entry" passHref>
        <Button
          color="secondary"
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl"
          size="lg"
        >
          Get Started
        </Button>
      </Link>
    </div>
  );
};

export default AnimatedText;