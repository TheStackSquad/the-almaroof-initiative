// src/animation/serviceAnimation.js (renamed from serviceAnimate.js)

// Mobile and accessibility detection
const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const animatedTextVariants = {
  initial: prefersReducedMotion
    ? {}
    : {
        y: isMobile ? 0 : 20,
        opacity: 0,
      },
  animate: prefersReducedMotion
    ? {}
    : {
        y: 0,
        opacity: 1,
        transition: {
          duration: isMobile ? 0.3 : 0.5,
          ease: "easeOut",
        },
      },
  exit: prefersReducedMotion
    ? {}
    : {
        y: isMobile ? 0 : -20,
        opacity: 0,
        transition: {
          duration: isMobile ? 0.3 : 0.5,
          ease: "easeIn",
        },
      },
};
