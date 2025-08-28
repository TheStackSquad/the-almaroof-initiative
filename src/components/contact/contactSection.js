//src/components/contact/contactSection.js

"use client";

import React from "react";
import { useSlideIn, useFadeIn } from "@/animation/aboutAnimate";
import ContactForm from "@/components/contact/contactSectionUI/contactForm";
import OfficeInfoCard from "@/components/contact/contactSectionUI/officeInfoCard";
import SocialMediaCard from "@/components/contact/contactSectionUI/socialMediaCard";
import EmergencyCard from "@/components/contact/contactSectionUI/emergencyCard";

export default function ContactSection() {
  const [sectionRef, sectionStyle] = useSlideIn("up", 0);
  const [titleRef, titleVisible] = useFadeIn(200);
  const [formRef, formStyle] = useSlideIn("left", 400);
  const [infoRef, infoStyle] = useSlideIn("right", 600);

  return (
    <section
      id="target-section"
      ref={sectionRef}
      style={sectionStyle}
      className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {" "}
        {/* Improved padding */}
        {/* Section Title */}
        <div
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            titleVisible
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-8"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 font-montserrat">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6 font-roboto">
            Your voice matters. Reach out to share your ideas, concerns, or
            suggestions for our community
          </p>
          <div className="w-24 h-1 bg-emerald-600 dark:bg-emerald-500 mx-auto rounded-full"></div>
        </div>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {" "}
          {/* Adjusted gap */}
          {/* Contact Form */}
          <div ref={formRef} style={formStyle}>
            <ContactForm />
          </div>
          {/* Contact Information */}
          <div
            ref={infoRef}
            style={infoStyle}
            className="space-y-6 lg:space-y-8"
          >
            {" "}
            {/* Adjusted spacing */}
            <OfficeInfoCard />
            <SocialMediaCard />
            <EmergencyCard />
          </div>
        </div>
      </div>
    </section>
  );
}
