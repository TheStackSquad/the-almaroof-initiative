// src/app/page.js
"use client";

import { motion } from "framer-motion";
import {
  containerVariants,
  titleWordVariants,
//  paragraphVariants,
  glowVariants,
  particleVariants,
} from "@/animation/animate";
import AnimatedText from "@/components/common/animatedText";
import pageData from "@/data/pageData";

export default function Home() {
  const { title, description } = pageData.home;

  return (
    <motion.main
      className="min-h-screen flex flex-col items-center justify-center p-8 relative
      overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900
      dark:via-gray-800 dark:to-gray-700 transition-colors duration-300"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-blue-400 dark:bg-purple-400"
            style={{
              left: `${15 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            variants={particleVariants}
            initial="hidden"
            animate={["show", "float"]}
            custom={i}
          />
        ))}
      </div>

      <motion.div
        className="max-w-4xl mx-auto text-center relative z-20"
        style={{ perspective: "1000px" }}
      >
        <motion.div
          className="absolute -inset-8 rounded-3xl blur-3xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 dark:from-purple-500 dark:via-pink-500 dark:to-indigo-500 opacity-20"
          variants={glowVariants}
          initial="hidden"
          animate="show"
        />

        <motion.h1
          className="mt-11 text-5xl md:text-7xl font-medium mb-6 relative z-10
          text-gray-800 dark:text-white font-heading"
          style={{
            textShadow: "0 4px 20px rgba(0,0,0,0.1)",
            transformStyle: "preserve-3d",
          }}
        >
          {title.split(" ").map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-2 cursor-default"
              variants={titleWordVariants}
              whileHover="hover"
              style={{
                transformOrigin: "center bottom",
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* LCP Fix: This element is no longer animated to ensure immediate rendering */}
        <p
          className="mb-3 text-xl md:text-2xl font-bold font-body max-w-2xl mx-auto
          leading-relaxed text-gray-600 dark:text-gray-300"
        >
          {description}
        </p>

        {/* Decorative elements remain unchanged */}
        <motion.div
          className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-600 dark:to-pink-600 opacity-20 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <motion.div
          className="absolute -bottom-10 -left-10 w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 dark:from-blue-600 dark:to-indigo-600 opacity-20 blur-xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>

      <div className="mt-5 md:mt-4 relative z-20 w-[95%] sm:w-[85%] md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto">
        <AnimatedText />
      </div>

      <div
        className="absolute inset-0 opacity-5 bg-black dark:bg-white z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0),
            radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)
          `,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 10px 10px",
        }}
      />
    </motion.main>
  );
}
