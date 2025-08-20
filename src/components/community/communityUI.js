// src/components/community/CommunityUI.js
"use client";

import Link from "next/link";
import { useFadeIn } from "@/animation/aboutAnimate";
import ButtonRedirect from "@/components/common/buttons/buttonRedirect";

// Client-only component for global styles
const GlobalStyles = () => (
  <style jsx global>{`
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      font-family: "Montserrat", sans-serif;
    }
  `}</style>
);

// StatCard component is now rendered here
const StatCard = ({ stat }) => (
  <div
    className={`p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-750`}
  >
    <div className="text-center">
      <div className="text-4xl mb-3">{stat.icon}</div>
      <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
        {stat.metric}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {stat.description}
      </p>
    </div>
  </div>
);

// FeatureCard component is also now rendered here
const FeatureCard = ({ card }) => (
  <Link href={card.path} className="group block">
    <div
      className={`
        p-6 rounded-xl border-2 transition-all duration-300
        hover:scale-105 hover:-translate-y-2 hover:shadow-xl
        bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-750
      `}
    >
      <div className="flex items-center mb-4">
        <div
          className={`w-12 h-12 rounded-lg bg-gradient-to-r ${card.color} flex items-center justify-center text-2xl mr-4`}
        >
          {card.icon}
        </div>
        <div>
          <h4 className="text-xl font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {card.title}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {card.stats}
          </p>
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {card.description}
      </p>
      <div className="space-y-2 mb-4">
        {card.features.map((feature, idx) => (
          <div key={idx} className="flex items-center text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <span className="text-gray-600 dark:text-gray-400">{feature}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-indigo-600 dark:text-indigo-400 font-semibold group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
          Explore →
        </span>
        <div
          className={`w-8 h-1 bg-gradient-to-r ${card.color} rounded-full`}
        ></div>
      </div>
    </div>
  </Link>
);

export default function CommunityPageClient({ communityStats, featureCards }) {
  const [pageRef, pageIsVisible] = useFadeIn(0);
  const [statsRef, statsIsVisible] = useFadeIn(500);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100 bg-gray-50 text-gray-900`}
    >
      <GlobalStyles />
      <div
        ref={pageRef}
        className={`container mx-auto p-4 transition-opacity duration-1000 ${
          pageIsVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Header and Hero Sections remain the same */}
        <div className="flex justify-between items-center mt-8">
          <div className="mb-3 mt-12">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              Oshodi Community Hub
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Your gateway to local governance and community services
            </p>
          </div>
        </div>

        <div className="relative mb-12 p-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">
              Building Stronger Communities Together
            </h2>
            <p className="text-xl opacity-90 mb-6 max-w-2xl">
              Access local government services, connect with your
              representatives, and stay informed about community developments.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/community/services"
                className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
              >
                Explore Services
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors duration-300"
              >
                Emergency Contacts
              </Link>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            <div className="text-9xl">🏛️</div>
          </div>
        </div>

        {/* Community Stats Section */}
        <div
          ref={statsRef}
          className={`mb-12 transition-all duration-1000 ${
            statsIsVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <h3 className="text-2xl font-bold text-center mb-8 dark:text-white">
            Community Impact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {communityStats.map((stat, index) => (
              <StatCard key={index} stat={stat} />
            ))}
          </div>
        </div>

        {/* Feature Cards Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-8 dark:text-white">
            Community Services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureCards.map((card, index) => (
              <FeatureCard key={index} card={card} />
            ))}
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="p-6 rounded-xl border-2 bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-center dark:text-white">
            Quick Actions
          </h3>
          <ButtonRedirect />
        </div>
      </div>
    </div>
  );
}
