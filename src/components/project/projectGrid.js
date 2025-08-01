// src/components/project/ProjectGrid.js
"use client";

import { useStaggerAnimation } from "@/animation/aboutAnimate";
import { ProjectCard } from "./projectCard";
import { projects } from "@/data/projectData"; // Import the mock data

export const ProjectGrid = () => {
  const [ref, visibleItems] = useStaggerAnimation(projects.length, 150);

  return (
    <div
      ref={ref}
      className="mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
    >
      {projects.slice(0, visibleItems).map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};
