// src/components/community/yellowPage/EmptyResults.js
import { Building2 } from "lucide-react";

export default function EmptyResults({ onClearFilters }) {
  return (
    <div className="text-center py-12">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 max-w-md mx-auto">
        <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 font-['Montserrat']">
          No businesses found
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          No businesses match your current search criteria. Try adjusting your
          filters or search term.
        </p>
        <button
          onClick={onClearFilters}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}
