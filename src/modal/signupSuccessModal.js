// src/components/modal/signupSuccessModal.js
import { useEffect } from "react";
import { X } from "lucide-react";

const SignupSuccessModal = ({ isOpen, onClose, username }) => {
  // Auto-close after 5 seconds
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden transform transition-all scale-95 animate-in fade-in-90 zoom-in-90">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close modal"
        >
          <X size={20} className="text-gray-600 dark:text-gray-300" />
        </button>

        {/* Content */}
        <div className="p-6 text-center">
          {/* Success icon */}
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <svg
              className="w-8 h-8 text-green-600 dark:text-green-400"
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

          {/* Heading */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome aboard, {username}!
          </h2>

          {/* Message */}
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            Your account has been successfully created. We&apos;ve sent a
            verification email to ensure the security of your account. Please
            check your inbox and click the verification link to complete your
            registration.
          </p>

          {/* Signature */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              Oshodi Cares
            </p>
          </div>
        </div>
      </div>

      {/* Global font style - only needs to be added once in your app */}
      <style jsx global>{`
        body {
          font-family: "Roboto", sans-serif;
        }
      `}</style>
    </div>
  );
};

export default SignupSuccessModal;
