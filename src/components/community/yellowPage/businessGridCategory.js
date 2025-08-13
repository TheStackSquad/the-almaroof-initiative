// src/components/community/yellowPage/businessGridCategory.js
"use client";

import CategorySection from "./categorySection";
import { groupBy } from "lodash";

export default function BusinessGridCategory({ businesses, onViewDetails }) {
  // Group businesses by category
  const businessesByCategory = groupBy(businesses, "category");

  // Sort categories alphabetically
  const sortedCategories = Object.keys(businessesByCategory).sort();

  return (
    <div className="w-full space-y-8">
      {sortedCategories.map((category) => (
        <div key={category} className="w-full">
          <CategorySection
            category={category}
            businesses={businessesByCategory[category]}
            onViewDetails={onViewDetails}
          />
        </div>
      ))}
    </div>
  );
}
