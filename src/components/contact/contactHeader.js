// src/components/contact/ContactHeader.js

import React from "react";
import { useSlideIn, useFadeIn } from "../../animation/aboutAnimate";

const ContactHeader = () => {
  const [titleRef, titleStyle] = useSlideIn("down", 0);
  const [subtitleRef, isSubtitleVisible] = useFadeIn(300);
  const [statsRef, isStatsVisible] = useFadeIn(600);

  return (
    <div
      className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 
      text-white py-16 px-4 mb-8 overflow-hidden dark:bg-gray-800 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 dark:opacity-20">
        <div
          className="absolute top-0 left-0 w-full h-full 
          bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]
          dark:bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239CA3AF\' fill-opacity=\'0.4\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"
        ></div>
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Main Title */}
        <div ref={titleRef} style={titleStyle}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Contact
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-yellow-300 dark:to-orange-400">
              Oshodi Local Government
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <div
          ref={subtitleRef}
          className={`transition-all duration-800 ${
            isSubtitleVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-xl md:text-2xl text-blue-100 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Connect with our dedicated officials and representatives serving the
            Oshodi community
          </p>
        </div>

        {/* Quick Stats */}
        <div
          ref={statsRef}
          className={`transition-all duration-800 delay-300 ${
            isStatsVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 dark:bg-gray-700/50 dark:border-gray-600">
              <div className="text-3xl font-bold text-yellow-400 dark:text-yellow-300 mb-1">
                16
              </div>
              <div className="text-sm text-blue-100 dark:text-gray-300">
                Total Officials
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 dark:bg-gray-700/50 dark:border-gray-600">
              <div className="text-3xl font-bold text-green-400 dark:text-green-300 mb-1">
                5
              </div>
              <div className="text-sm text-blue-100 dark:text-gray-300">
                Executive Branch
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 dark:bg-gray-700/50 dark:border-gray-600">
              <div className="text-3xl font-bold text-purple-400 dark:text-purple-300 mb-1">
                11
              </div>
              <div className="text-sm text-blue-100 dark:text-gray-300">
                Councilors
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 dark:bg-gray-700/50 dark:border-gray-600">
              <div className="text-3xl font-bold text-orange-400 dark:text-orange-300 mb-1">
                24/7
              </div>
              <div className="text-sm text-blue-100 dark:text-gray-300">
                Emergency Line
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="tel:+234-700-674634"
              className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 shadow-lg dark:bg-green-700 dark:hover:bg-green-600"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Emergency: 700-OSHODI
            </a>
            <a
              href="mailto:info@oshodilg.gov.ng"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm border border-white/30 dark:bg-gray-700/50 dark:hover:bg-gray-700/70 dark:border-gray-600"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Send Email
            </a>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl dark:bg-yellow-300/20"></div>
      <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-green-400/20 rounded-full blur-xl dark:bg-green-300/20"></div>
      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-purple-400/20 rounded-full blur-lg dark:bg-purple-300/20"></div>
    </div>
  );
};

export default ContactHeader;
