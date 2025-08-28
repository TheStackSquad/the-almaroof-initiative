//src/components/contact/contactSectionUI/officeInfoCard.js

export default function OfficeInfoCard() {
  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl p-8 shadow-lg dark:shadow-gray-900/50">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 font-montserrat">
        Office Information
      </h3>

      <div className="space-y-4">
        <div className="flex items-start space-x-4">
          <div className="text-2xl">🏛️</div>
          <div>
            <h4 className="font-bold text-gray-800 dark:text-white mb-1 font-montserrat">
              Office Address
            </h4>
            <p className="text-gray-600 dark:text-gray-300 font-roboto">
              Alimosho Local Government Secretariat, Ikotun, Lagos.
              <br />
              Lagos State, Nigeria
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="text-2xl">⏰</div>
          <div>
            <h4 className="font-bold text-gray-800 dark:text-white mb-1 font-montserrat">
              Office Hours
            </h4>
            <p className="text-gray-600 dark:text-gray-300 font-roboto">
              Monday - Friday: 8:00 AM - 4:00 PM
              <br />
              Saturday: 9:00 AM - 1:00 PM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
