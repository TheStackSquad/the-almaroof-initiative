//src/app/about/page.js

"use client";

import React, { useState, useEffect, useRef } from "react";
import AboutNavigation from "@/components/about/aboutNavigation";
import HeroSection from "@/components/about/heroSection";
import BiographySection from "@/components/about/biographySection";
import Biography from "@/components/about/biography";
import LeadershipTeam from "@/components/about/leadershipTeam";
import OfficeStructure from "@/components/about/officeStructure";
import AchievementsSection from "@/components/about/achievementsSection";
import VisionSection from "@/components/about/visionSection";

export default function AboutPage() {
  // State to track the active section, controlled by the scroll observer
  const [activeSection, setActiveSection] = useState("overview");

  // Refs for each section to enable scroll observation
  const overviewRef = useRef(null);
  const biographyRef = useRef(null);
  const leadershipRef = useRef(null);
  const structureRef = useRef(null);
  const achievementsRef = useRef(null);

  // Effect to set up the IntersectionObserver
  useEffect(() => {
    // A mapping of ref to section ID
    const sectionRefs = {
      overview: overviewRef,
      biography: biographyRef,
      leadership: leadershipRef,
      structure: structureRef,
      achievements: achievementsRef,
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Update the active section when a section enters the viewport
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null, // use the viewport as the root
        rootMargin: "-20% 0px -80% 0px", // adjust this to control when the intersection occurs
        threshold: 0, // as soon as any part of the target is visible
      }
    );

    // Observe each section
    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    // Clean up the observer on component unmount
    return () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []); // Run only once on mount

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Navigation Container - Prevents horizontal overflow */}
      <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          {/* We now pass the activeSection state to the navigation component.
              The navigation component's links should use href="#sectionId"
              to trigger native scrolling. */}
          <AboutNavigation activeSection={activeSection} />
        </div>
      </div>

      {/* Main Content Container - Ensures proper containment */}
      <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <main className="pb-8 md:pb-12 lg:pb-16">
            <div
              id="overview"
              ref={overviewRef}
              className="space-y-8 md:space-y-12 lg:space-y-16"
            >
              <HeroSection />
              <BiographySection />
              <AchievementsSection />
              <VisionSection />
            </div>
            <div id="biography" ref={biographyRef} className="w-full">
              <Biography />
            </div>
            <div id="leadership" ref={leadershipRef} className="w-full">
              <LeadershipTeam />
            </div>
            <div id="structure" ref={structureRef} className="w-full">
              <OfficeStructure />
            </div>
            <div id="achievements" ref={achievementsRef} className="w-full">
              <AchievementsSection />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

