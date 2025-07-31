//src/app/project/page.js
"use client";
import { useState } from "react";
import { ProjectHeader } from "@/components/project/projectHeader";
import { ProjectFilters } from "@/components/project/projectFilters";
import { ProjectGrid } from "@/components/project/projectGrid";
import { ProjectPagination } from "@/components/project/projectPagination";

const ProjectsPage = () => {
  const [activeFilters, setActiveFilters] = useState({
    status: "All",
    category: "All",
  });

  // Sample data (replace with API call)
  const allProjects = [
    {
      id: 1,
      title: "Downtown Road Expansion",
      description:
        "Upgrading main arterial roads to reduce traffic congestion.",
      status: "Ongoing",
      category: "Infrastructure",
      date: "Jan 2024 - Dec 2025",
      image: "/road-project.jpg",
    },
    // Add more projects...
  ];

  const [currentPage, setCurrentPage] = useState(1);
  // Filter x Search logic
  const [searchQuery, setSearchQuery] = useState("");

  // Add search to filter logic
  const filteredProjects = allProjects.filter((project) => {
    const statusMatch =
      activeFilters.status === "All" || project.status === activeFilters.status;
    const categoryMatch =
      activeFilters.category === "All" ||
      project.category === activeFilters.category;
    const searchMatch =
      searchQuery === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && categoryMatch && searchMatch;
  });
    
      const projectsPerPage = 6;
      // Paginate filtered projects
      const paginatedProjects = filteredProjects.slice(
        (currentPage - 1) * projectsPerPage,
        currentPage * projectsPerPage
      );

  // Unique categories for filter dropdown
  const categories = [...new Set(allProjects.map((p) => p.category))];

  return (
    <main className="min-h-screen bg-gray-750 py-12 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <ProjectHeader
          title="Government Projects"
          description="Explore completed and ongoing initiatives for our community."
        />

        <ProjectFilters
          filters={{ categories }}
          onFilterChange={(key, value) =>
            setActiveFilters({ ...activeFilters, [key]: value })
          }
        />

        <ProjectGrid projects={filteredProjects} />
        <ProjectPagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredProjects.length / projectsPerPage)}
          onPageChange={setCurrentPage}
        />
      </div>
    </main>
  );
};

export default ProjectsPage;
