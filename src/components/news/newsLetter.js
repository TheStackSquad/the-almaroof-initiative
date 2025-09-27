// src/components/news/newsNewsletter.js
'use client';

import { useState } from "react";
import { useFadeIn, useSlideIn } from "../../animation/aboutAnimate";

const NewsNewsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [containerRef, containerVisible] = useFadeIn(200);
  const [contentRef, contentStyle] = useSlideIn("up", 400);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  const greet = `Welcome Aboard!`;

  return (
    <section
      ref={containerRef}
      className={`py-20 relative overflow-hidden transition-all duration-800 ${
        containerVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 dark:from-indigo-800 dark:via-purple-800 dark:to-blue-800" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-white rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-yellow-300 rounded-full filter blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300 rounded-full filter blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div ref={contentRef} style={contentStyle}>
          {/* Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a3 3 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Stay in the Loop
          </h2>

          {/* Description */}
          <p
            className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            Get the latest news, insights, and exclusive stories delivered
            straight to your inbox. Join thousands of readers who trust us for
            quality journalism.
          </p>

          {/* Newsletter Form */}
          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-6 py-4 rounded-full text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 bg-white text-purple-600 font-bold rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Subscribe Now
                </button>
              </div>
            </form>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/30">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3
                  className="text-2xl font-bold text-white mb-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
             {greet}
                </h3>
                <p
                  className="text-white/90"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  Thank you for subscribing. You&apos;ll receive our latest updates
                  soon!
                </p>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3
                className="text-lg font-semibold text-white mb-2"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Breaking News
              </h3>
              <p
                className="text-white/80 text-sm"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                Get instant alerts for major stories
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3
                className="text-lg font-semibold text-white mb-2"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Weekly Insights
              </h3>
              <p
                className="text-white/80 text-sm"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                Deep analysis and expert commentary
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3
                className="text-lg font-semibold text-white mb-2"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Ad-Free Experience
              </h3>
              <p
                className="text-white/80 text-sm"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                Clean, focused content delivery
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsNewsletter;
