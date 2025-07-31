//src/app/about/page.js

"use client";

import React, { useState } from "react";
import AboutNavigation from "../../components/about/aboutNavigation";
import HeroSection from "../../components/about/heroSection";
import BiographySection from "../../components/about/biographySection";
import Biography from "../../components/about/biography";
import LeadershipTeam from "../../components/about/leadershipTeam";
import OfficeStructure from "../../components/about/officeStructure";
import AchievementsSection from "../../components/about/achievementsSection";
import VisionSection from "../../components/about/visionSection";
import ContactSection from "../../components/about/contactSection";

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState("overview");

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <>
            <HeroSection />
            <BiographySection />
            <AchievementsSection />
            <VisionSection />
            <ContactSection />
          </>
        );
      case "biography":
        return <Biography />;
      case "leadership":
        return <LeadershipTeam />;
      case "structure":
        return <OfficeStructure />;
      case "achievements":
        return <AchievementsSection />;
      default:
        return (
          <>
            <HeroSection />
            <BiographySection />
            <AchievementsSection />
            <VisionSection />
            <ContactSection />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <AboutNavigation
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      {renderSection()}
    </div>
  );
}