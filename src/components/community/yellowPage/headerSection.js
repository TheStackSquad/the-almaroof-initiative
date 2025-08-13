// src/components/community/yellowPage/HeaderSection.js

import { Plus } from "lucide-react";

export default function HeaderSection({ onRegister }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl mt-12 font-bold text-gray-900 dark:text-white font-['Montserrat']">
              Oshodi Business Directory
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300 font-['Roboto']">
              Your comprehensive guide to businesses and institutions in Oshodi
              LGA
            </p>
          </div>
          <button
            onClick={onRegister}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Register Business
          </button>
        </div>
      </div>
    </div>
  );
}
