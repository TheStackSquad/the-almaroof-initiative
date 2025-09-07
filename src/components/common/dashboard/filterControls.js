// src/components/dashboard/filterControls.js
import { getStatusButtonStyle } from "@/utils/permitUtils";
import { STATUS_DISPLAY_NAMES } from "@/components/common/permitStatus";

const FilterControls = ({
  filter,
  onFilterChange,
  statusCounts,
  totalCount,
}) => (
  <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onFilterChange("all")}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          filter === "all"
            ? "bg-blue-100 text-blue-700"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        All ({totalCount})
      </button>
      {Object.entries(statusCounts).map(
        ([status, count]) =>
          count > 0 && (
            <button
              key={status}
              onClick={() => onFilterChange(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? getStatusButtonStyle(status)
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {STATUS_DISPLAY_NAMES[status] || status.replace("_", " ")} (
              {count})
            </button>
          )
      )}
    </div>
  </div>
);
