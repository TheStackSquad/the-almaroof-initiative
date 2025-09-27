//src/animation/aboutAnimate.js

'use client';

import { useEffect, useRef, useState } from "react";

// Custom hook for fade-in animation
export const useFadeIn = (delay = 0) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const currentRef = ref.current; // Copy ref to variable

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [delay]);

  return [ref, isVisible];
};

// Custom hook for slide-in animation
export const useSlideIn = (direction = "up", delay = 0) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const currentRef = ref.current; // Copy ref to variable

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [delay]);

  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case "up":
          return "translateY(50px)";
        case "down":
          return "translateY(-50px)";
        case "left":
          return "translateX(50px)";
        case "right":
          return "translateX(-50px)";
        default:
          return "translateY(50px)";
      }
    }
    return "translateY(0)";
  };

  return [
    ref,
    {
      transform: getTransform(),
      opacity: isVisible ? 1 : 0,
      transition: "all 0.8s ease-out",
    },
  ];
};

// Animation variants for different components
export const animationVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  },
  card: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  },
};

// Stagger animation for lists
export const useStaggerAnimation = (itemCount, delay = 100) => {
  const [visibleItems, setVisibleItems] = useState(0);
  const ref = useRef();

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          for (let i = 0; i <= itemCount; i++) {
            setTimeout(() => {
              setVisibleItems(i);
            }, i * delay);
          }
          observer.unobserve(currentRef);
        }
      },
      { threshold: 0 }
    );

    observer.observe(currentRef);

    return () => {
      observer.disconnect();
    };
  }, [itemCount, delay]);

  return [ref, visibleItems];
};
