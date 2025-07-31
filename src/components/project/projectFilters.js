//src/coponents/project/projectFilters.js
import { useSlideIn } from "@/animation/aboutAnimate";

export const ProjectFilters = ({ filters, onFilterChange, onSearch }) => {
  const [ref, filterAnimation] = useSlideIn("down", 50);

  return (
    <div
      ref={ref}
      style={filterAnimation}
      className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search projects..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 sm:w-64 dark:border-gray-600 dark:bg-gray-700"
      />

      {/* Status + Category Filters */}
      <div className="flex flex-wrap gap-4">
        <select
          onChange={(e) => onFilterChange("status", e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
        >
          <option value="All">All Projects</option>
          <option value="Completed">Completed</option>
          <option value="Ongoing">Ongoing</option>
        </select>

        <select
          onChange={(e) => onFilterChange("category", e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
        >
          <option value="All">All Categories</option>
          {filters.categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};