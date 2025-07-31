//src/components/project/projectPagination.js

import { useFadeIn } from "@/animation/aboutAnimate";

export const ProjectPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [ref, isVisible] = useFadeIn(200);

  return (
    <div
      ref={ref}
      className={`mt-12 flex justify-center ${
        isVisible ? "opacity-100" : "opacity-0"
      } transition-opacity duration-500`}
    >
      <div className="flex gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            className={`h-10 w-10 rounded-full ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};