// src/app/community/services/page.js

"use client";
import Link from "next/link";
import LocalServices from "@/components/community/localServices";
import { useFadeIn } from "@/animation/aboutAnimate";

export default function ServicesPage() {
  // Removed theme state and toggle logic
  const [pageRef, pageIsVisible] = useFadeIn(0);

  return (
    // Apply dark classes directly
    <div className="min-h-screen transition-colors duration-300 bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <style jsx global>{`
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: "Montserrat", sans-serif;
        }
        p {
          font-family: "Roboto", sans-serif;
        }
      `}</style>

      <div
        ref={pageRef}
        className={`container mx-auto p-4 transition-opacity duration-1000 ${
          pageIsVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Header with Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-6 mb-8 space-y-4 md:space-y-0">
          <div>
            {/* Breadcrumb */}
            <nav className="mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Link
                  href="/community"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Community Hub
                </Link>
                <span>/</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  Local Services
                </span>
              </div>
            </nav>

            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              Local Services Directory
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
              Access government services online, skip the queue, and get things
              done faster. Your gateway to efficient public service delivery.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Back to Hub Button */}
            <Link
              href="/community"
              className="px-4 py-2 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 rounded-lg font-semibold hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-400 dark:hover:text-gray-900 transition-colors duration-300"
            >
              ← Back to Hub
            </Link>
            {/* Theme toggle button removed */}
          </div>
        </div>

        {/* Key Benefits Banner */}
        <div className="mb-8 p-6 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-xl border border-green-200 dark:border-green-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-green-800 dark:text-green-200 mb-2">
                🎯 Why Use Our Online Services?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-green-600 dark:text-green-400">⚡</span>
                  <span className="text-green-700 dark:text-green-300 font-roboto">
                    65% faster processing
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600 dark:text-blue-400">💰</span>
                  <span className="text-blue-700 dark:text-blue-300 font-roboto">
                    10% discount on online payments
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-purple-600 dark:text-purple-400">📱</span>
                  <span className="text-purple-700 dark:text-purple-300 font-roboto">
                    24/7 application tracking
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden md:block text-4xl">🚀</div>
          </div>
        </div>

        {/* LocalServices Component */}
        <LocalServices />

        {/* Help Section */}
        <div className="mt-12 p-6 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Need Help?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Our support team is here to assist you with any questions about
              our services.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📞</span>
                <div>
                  <div className="font-semibold font-montserrat">Call Us</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-roboto">
                    +234-803-123-4567
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">✉️</span>
                <div>
                  <div className="font-semibold font-montserrat">Email Support</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-roboto">
                    help@oshodi-isolo.gov.ng
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🕒</span>
                <div>
                  <div className="font-semibold font-montserrat">Office Hours</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-roboto">
                    Mon-Fri, 8AM-5PM
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}