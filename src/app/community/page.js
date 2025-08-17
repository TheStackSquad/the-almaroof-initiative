// src/app/community/page.js

// This is a Server Component, no 'use client'
import { publicInstitutions, wardsData } from "@/data/oshodiData";
import { localServicesData } from "@/data/localServicesData";
import CommunityUI from "@/components/community/communityUI";

export default function CommunityHubServerPage() {
  const communityStats = [
    {
      metric: "88%",
      description: "Safer communities since neighbourhood watch introduction",
      icon: "🛡️",
      color: "text-green-500",
    },
    {
      metric: "1.7%",
      description: "Infant mortality rate thanks to healthcare services",
      icon: "👶",
      color: "text-blue-500",
    },
    {
      metric: "78%",
      description: "Public school graduates in higher institutions",
      icon: "🎓",
      color: "text-purple-500",
    },
    {
      metric: "65%",
      description: "Reduction in LGA office queues with online services",
      icon: "⏱️",
      color: "text-indigo-500",
    },
  ];

  const featureCards = [
    {
      title: "Local Services",
      description:
        "Access government services online - Skip the queue, save time!",
      icon: "🏢",
      path: "/yellow-page",
      stats: `${
        Object.values(localServicesData).flat().length
      } services available`,
      color: "from-indigo-500 to-cyan-500",
      features: [
        "Online Applications",
        "24/7 Emergency Services",
        "Digital Payments",
      ],
    },
    {
      title: "Streets & Councilors",
      description: "Find your ward councilor and local representatives",
      icon: "🏘️",
      path: "/contact",
      stats: `${wardsData.length} wards covered`,
      color: "from-green-500 to-teal-500",
      features: ["Ward Information", "Councilor Contacts", "Street Directory"],
    },
    {
      title: "Public Institutions",
      description: "Directory of schools, hospitals, and public facilities",
      icon: "🏫",
      path: "/community/yellow-page",
      stats: `${publicInstitutions.length} institutions listed`,
      color: "from-purple-500 to-pink-500",
      features: [
        "Schools & Hospitals",
        "Contact Information",
        "Location Details",
      ],
    },
  ];

  return (
    <CommunityUI
      communityStats={communityStats}
      featureCards={featureCards}
    />
  );
}
