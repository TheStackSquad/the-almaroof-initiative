//src/app/about/page.js

"use client";

import React from "react";
import HeroSection from "../../components/about/heroSection";
import BiographySection from "../../components/about/biographySection";
import AchievementsSection from "../../components/about/achievementsSection";
import VisionSection from "../about/visionSection";
import ContactSection from "../../components/about/contactSection";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <HeroSection />
      <BiographySection />
      <AchievementsSection />
      <VisionSection />
      <ContactSection />
    </div>
  );
}