//src/coponents/project/projectCard.js

import { useFadeIn, useSlideIn } from "@/animation/aboutAnimate";
import Image from "next/image";

export const ProjectCard = ({ project }) => {
  const [ref, cardAnimation] = useSlideIn("up", 100);
  const statusColor =
        project.status === "Completed" ? "bg-green-500" : "bg-amber-500";
    
    const image = '/img/road.jpg';

  return (
    <div
      ref={ref}
      style={cardAnimation}
      className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:shadow-gray-800"
    >
      {/* Project Image */}
      <div className="h-48 w-full overflow-hidden">
        <Image
          src={project.image || "/default-project.jpg"}
          alt={project.title}
          width={400}
          height={200}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Card Body */}
      <div className="bg-white p-6 dark:bg-gray-800">
        {/* Status Badge */}
        <span
          className={`absolute -top-3 right-4 rounded-full px-3 py-1 text-xs font-bold text-white ${statusColor}`}
        >
          {project.status}
        </span>

        {/* Title */}
        <h3 className="mb-2 font-montserrat text-xl font-bold text-gray-900 dark:text-white">
          {project.title}
        </h3>

        {/* Description */}
        <p className="mb-4 font-roboto text-gray-600 dark:text-gray-300">
          {project.description}
        </p>

        {/* Category & Date */}
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs dark:bg-gray-700">
            {project.category}
          </span>
          <span className="text-xs text-gray-500">{project.date}</span>
        </div>
      </div>
    </div>
  );
};