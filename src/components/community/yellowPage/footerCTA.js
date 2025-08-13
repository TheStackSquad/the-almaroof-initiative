// src/components/community/yellowPage/FooterCTA.js
import { Plus } from "lucide-react";

export default function FooterCTA({ onRegister }) {
  return (
    <div className="mt-12 text-center">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 font-['Montserrat']">
          Want to list your business?
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 font-['Roboto']">
          Join our growing directory and connect with customers in Oshodi LGA.
          Registration is free and easy!
        </p>
        <button
          onClick={onRegister}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Register Your Business
        </button>
      </div>
    </div>
  );
}
