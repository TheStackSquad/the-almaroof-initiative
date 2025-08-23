//src/app/about/page.js

"use client";

import React, { useState } from "react";
import AboutNavigation from "@/components/about/aboutNavigation";
import HeroSection from "@/components/about/heroSection";
import BiographySection from "@/components/about/biographySection";
import Biography from "@/components/about/biography";
import LeadershipTeam from "@/components/about/leadershipTeam";
import OfficeStructure from "@/components/about/officeStructure";
import AchievementsSection from "@/components/about/achievementsSection";
import VisionSection from "@/components/about/visionSection";

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState("overview");

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-8 md:space-y-12 lg:space-y-16">
            <HeroSection />
            <BiographySection />
            <AchievementsSection />
            <VisionSection />
          </div>
        );
      case "biography":
        return (
          <div className="w-full">
            <Biography />
          </div>
        );
      case "leadership":
        return (
          <div className="w-full">
            <LeadershipTeam />
          </div>
        );
      case "structure":
        return (
          <div className="w-full">
            <OfficeStructure />
          </div>
        );
      case "achievements":
        return (
          <div className="w-full">
            <AchievementsSection />
          </div>
        );
      default:
        return (
          <div className="space-y-8 md:space-y-12 lg:space-y-16">
            <HeroSection />
            <BiographySection />
            <AchievementsSection />
            <VisionSection />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Navigation Container - Prevents horizontal overflow */}
      <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AboutNavigation
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>
      </div>

      {/* Main Content Container - Ensures proper containment */}
      <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <main className="pb-8 md:pb-12 lg:pb-16">{renderSection()}</main>
        </div>
      </div>
    </div>
  );
}
