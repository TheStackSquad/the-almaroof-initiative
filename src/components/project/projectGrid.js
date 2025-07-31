//src/coponents/project/projectCard.js
import {
  useStaggerAnimation,
  animationVariants,
} from "@/animation/aboutAnimate";
import { ProjectCard } from "./projectCard";

export const ProjectGrid = ({ projects }) => {
  const [ref, visibleItems] = useStaggerAnimation(projects.length, 150);

  return (
    <div
      ref={ref}
      className="mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
    >
      {projects.slice(0, visibleItems).map((project, index) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};
