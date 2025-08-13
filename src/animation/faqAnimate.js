// src/animation/faqAnimate.js
// import { motion } from "framer-motion";

export const faqVariants = {
  open: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

export const iconVariants = {
  open: { rotate: 180 },
  closed: { rotate: 0 },
};
