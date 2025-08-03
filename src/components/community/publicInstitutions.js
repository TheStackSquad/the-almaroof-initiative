//src/components/community/publicInstitutions.js

import { useStaggerAnimation } from "@/animation/aboutAnimate";

export default function PublicInstitutions({ institutions }) {
  const [listRef, visibleItems] = useStaggerAnimation(institutions.length, 100);

  return (
    <div className="p-6 rounded-lg shadow-md transition-colors duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">
        Public Institutions
      </h2>
      <ul ref={listRef} className="space-y-4">
        {institutions.map((institution, index) => (
          <li
            key={institution.id}
            className={`
              p-4 rounded-md transition-all duration-500 ease-out border border-gray-200 dark:border-gray-700
              bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600
              ${
                index < visibleItems
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }
            `}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <h3 className="font-semibold text-xl dark:text-white">
              {institution.name}
            </h3>
            <p className="text-sm dark:text-gray-300">
              Address: {institution.address}
            </p>
            <p className="text-sm dark:text-gray-300">
              Contact: {institution.contact}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}