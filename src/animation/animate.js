// src/animation/animate.js

// Variants for the main container (e.g., the <motion.main> element)
// This will cause the entire page content to fade in.
export const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Delay children animations
      duration: 0.8, // Overall fade-in duration for the container
      ease: "easeOut",
    },
  },
};

// Variants for individual words in the title
// Each word will fade in and slide up slightly.
export const titleWordVariants = {
  hidden: { y: 20, opacity: 0, rotateX: 90 }, // Start slightly below, invisible, and rotated
  show: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: {
      type: "spring", // Use a spring animation for a bouncy feel
      damping: 10,
      stiffness: 100,
      duration: 0.5,
    },
  },
  hover: {
    y: -5, // Lift up slightly on hover
    scale: 1.05, // Slightly enlarge on hover
    color: ["#0d6efd", "#4dabf7"], // Example color change on hover (adjust as needed)
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

// Variants for the paragraph text
// The paragraph will fade in and slide up as a whole block.
export const paragraphVariants = {
  hidden: { y: 30, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.6, // Delay after title animation
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

// Variants for buttons (if you add them later)
// Buttons will fade in and slide up.
export const buttonVariants = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 1.0, // Delay after paragraph animation
      duration: 0.7,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.05,
    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
    transition: {
      duration: 0.2,
    },
  },
  tap: {
    scale: 0.95,
  },
};

// Variants for the background glow effect
// The glow will fade in and subtly scale.
export const glowVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 0.2,
    scale: 1,
    transition: {
      delay: 0.3, // Start slightly after container begins
      duration: 1.5,
      ease: "easeOut",
    },
  },
};

// Variants for the animated background particles
// Each particle will fade in and then float around.
export const particleVariants = {
  hidden: { opacity: 0, scale: 0 },
  show: (i) => ({
    // Use a function to access custom prop 'i' for staggered animation
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.1, // Stagger particles
      duration: 0.5,
      ease: "easeOut",
    },
  }),
  float: (i) => ({
    y: [0, 10 + i * 5, 0], // Float up and down
    x: [0, 5 + i * 3, 0], // Float left and right
    opacity: [1, 0.7, 1],
    transition: {
      duration: 10 + i * 2, // Vary duration for natural look
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  }),
};
