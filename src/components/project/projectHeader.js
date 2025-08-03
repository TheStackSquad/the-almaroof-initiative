// src/components/project/ProjectHeader.js
"use client";

import { useSlideIn } from "@/animation/aboutAnimate";
import PropTypes from "prop-types"; // For prop type checking

export const ProjectHeader = ({ title, description }) => {
  const [ref, animation] = useSlideIn("down", 0);

  return (
    <div ref={ref} style={animation} className="mb-12 mt-8 text-center">
      {/* Main Title */}
      <h1 className="mb-4 font-montserrat text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
        {title || "Our Projects"} {/* Fallback title */}
      </h1>

      {/* Description */}
      <p className="mx-auto max-w-2xl font-roboto text-lg text-gray-600 dark:text-gray-300">
        {description ||
          "Explore our portfolio of completed and ongoing initiatives"}{" "}
        {/* Fallback description */}
      </p>
    </div>
  );
};

// Prop type validation
ProjectHeader.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
};

// Default props
ProjectHeader.defaultProps = {
  title: "Our Projects",
  description: "Explore our portfolio of completed and ongoing initiatives",
};
