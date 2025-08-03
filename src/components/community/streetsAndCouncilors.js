// src/components/community/streetsAndCouncilors.js

import { useFadeIn } from "@/animation/aboutAnimate";
import Image from "next/image";

export default function StreetsAndCouncilors({ wards }) {
  const [ref, isVisible] = useFadeIn(500);

  return (
    <div
      ref={ref}
      className={`
        p-8 rounded-xl shadow-lg transition-all duration-1000 backdrop-blur-sm
        bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      `}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
          Streets and Councilors
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {wards.map((ward, index) => (
          <div
            key={index}
            className={`
              group rounded-xl overflow-hidden transition-all duration-300
              hover:scale-105 hover:-translate-y-2 border-2
              bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-600
              shadow-md hover:shadow-xl dark:shadow-lg dark:hover:shadow-2xl
            `}
          >
            {/* Image Section with Overlay */}
            {ward.image && (
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src={ward.image}
                  alt={ward.wardName}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-xl mb-1 drop-shadow-lg">
                    {ward.wardName}
                  </h3>
                </div>
              </div>
            )}

            {/* Content Section */}
            <div className="p-6">
              {!ward.image && (
                <h3 className="font-bold text-xl mb-4 text-blue-600 dark:text-blue-400">
                  {ward.wardName}
                </h3>
              )}

              <div className="mb-6 space-y-3">
                <div className="flex flex-col space-y-1">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400">
                    Councilor
                  </span>
                  <span className="font-semibold text-lg text-gray-900 dark:text-white">
                    {ward.councillorName}
                  </span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400">
                    Contact
                  </span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {ward.councillorContact}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center mb-3">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400 mr-2">
                    Streets
                  </span>
                  <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {ward.streets.map((street, streetIndex) => (
                    <div
                      key={streetIndex}
                      className="px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      {street}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
