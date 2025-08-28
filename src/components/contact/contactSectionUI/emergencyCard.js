//src/components/contact/contactSectionUI/emergencyCard.js

export default function EmergencyCard() {
  return (
    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 rounded-2xl p-8 text-white shadow-xl dark:shadow-gray-900/70">
      <h3 className="text-xl font-bold mb-4 font-montserrat">
        Need Immediate Assistance?
      </h3>
      <p className="text-emerald-100 dark:text-emerald-200 mb-6 font-roboto">
        For urgent matters affecting our community, don&apos;t hesitate to reach
        out directly.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          className="px-6 py-3 bg-white text-emerald-700 font-bold rounded-full 
                     hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 
                     font-montserrat dark:bg-gray-100 dark:text-emerald-800 dark:hover:bg-white"
        >
          Emergency Contact
        </button>
        <button
          className="px-6 py-3 border-2 border-white text-white hover:bg-white 
                     hover:text-emerald-700 font-bold rounded-full transform 
                     hover:scale-105 transition-all duration-300 font-montserrat
                     dark:hover:text-emerald-800 dark:hover:border-gray-100"
        >
          Schedule Meeting
        </button>
      </div>
    </div>
  );
}
