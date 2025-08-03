// src/modal/serviceModal.js

import { useEffect } from "react";

export default function ServiceModal({ isOpen, onClose, service, theme }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !service) return null;

  const modalBgClasses =
    theme === "dark"
      ? "bg-gray-800 text-gray-100 border-gray-600"
      : "bg-white text-gray-900 border-gray-300";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div
        className={`
        relative max-w-2xl w-full max-h-[90vh] overflow-y-auto
        rounded-2xl shadow-2xl border-2 transition-all duration-300
        transform scale-100 opacity-100
        ${modalBgClasses}
      `}
      >
        {/* Header */}
        <div className="sticky top-0 p-6 border-b border-gray-200 dark:border-gray-700 bg-inherit backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                {service.name}
              </h2>
              <div className="flex items-center space-x-3">
                <span
                  className={`
                  px-3 py-1 text-sm font-semibold rounded-full
                  ${
                    service.category === "Emergency Services"
                      ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                      : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                  }
                `}
                >
                  {service.category}
                </span>
                {service.hasOnlineOption && (
                  <span className="px-3 py-1 text-sm font-semibold bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                    ✅ Online Available
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Coming Soon Message */}
          <div className="text-center py-12 mb-8">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">
              Service Details Coming Soon!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              We&apos;re working hard to bring you comprehensive service details,
              online applications, and seamless digital experiences. Stay tuned!
            </p>

            {/* Basic Info Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-lg mx-auto">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Contact
                </div>
                <div className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {service.contact.phone}
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Hours
                </div>
                <div className="font-semibold">{service.hours}</div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Processing Time
                </div>
                <div className="font-semibold text-cyan-600 dark:text-cyan-400">
                  {service.processingTime}
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Fees
                </div>
                <div className="font-semibold text-green-600 dark:text-green-400">
                  {service.fees}
                </div>
              </div>
            </div>

            {/* Future Features Preview */}
            <div className="mt-8 p-4 bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-indigo-900 dark:to-cyan-900 rounded-xl">
              <h4 className="font-bold mb-3 text-indigo-700 dark:text-indigo-300">
                🔮 Coming Soon Features:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>📋 Online Application Forms</div>
                <div>💳 Digital Payment Options</div>
                <div>📱 Mobile App Integration</div>
                <div>📍 GPS Navigation</div>
                <div>🔔 Real-time Status Updates</div>
                <div>📊 Application Tracking</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-6 border-t border-gray-200 dark:border-gray-700 bg-inherit backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Need immediate assistance? Call {service.contact.phone}
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
