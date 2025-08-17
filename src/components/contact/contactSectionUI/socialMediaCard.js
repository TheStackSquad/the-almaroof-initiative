//src/components/contact/contactSectionUI/socialMediaCard.js
"use client";

export default function SocialMediaCard() {
  const socialLinks = [
    {
      name: "Facebook",
      icon: "📘",
      handle: "@kehinde.oloyedeal",
      color: "hover:text-blue-600",
      bgColor: "hover:bg-blue-50",
    },
    {
      name: "TikTok",
      icon: "🎵",
      handle: "@kehinde.oloyedeal",
      color: "hover:text-pink-600",
      bgColor: "hover:bg-pink-50",
    },
    {
      name: "Instagram",
      icon: "📷",
      handle: "@kehinde.oloyedeal",
      color: "hover:text-purple-600",
      bgColor: "hover:bg-purple-50",
    },
    {
      name: "Twitter",
      icon: "🐦",
      handle: "@kehinde_almaroof",
      color: "hover:text-blue-400",
      bgColor: "hover:bg-blue-50",
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 font-montserrat text-center sm:text-left">
        Connect on Social Media
      </h3>

      {/* Mobile Layout - Single Column */}
      <div className="sm:hidden space-y-3">
        {socialLinks.map((social, index) => (
          <a
            key={index}
            href="#"
            className={`flex items-center justify-between p-4 rounded-xl bg-gray-50 
                       ${social.bgColor} transform hover:scale-[1.02] active:scale-[0.98] 
                       transition-all duration-300 ${social.color} group
                       border border-transparent hover:border-gray-200
                       shadow-sm hover:shadow-md`}
          >
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="text-2xl flex-shrink-0 transform group-hover:scale-110 transition-transform duration-200">
                {social.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-gray-800 text-base font-montserrat leading-tight">
                  {social.name}
                </h4>
                <p className="text-sm text-gray-600 font-roboto leading-tight mt-0.5">
                  {social.handle}
                </p>
              </div>
            </div>

            {/* Arrow indicator for mobile */}
            <div className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 ml-2">
              <svg
                className="w-4 h-4 text-gray-400 group-hover:text-current"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </a>
        ))}
      </div>

      {/* Tablet and Desktop Layout - Grid */}
      <div className="hidden sm:grid sm:grid-cols-2 gap-4">
        {socialLinks.map((social, index) => (
          <a
            key={index}
            href="#"
            className={`flex items-center space-x-3 p-4 rounded-xl bg-gray-50 
                       hover:bg-gray-100 transform hover:scale-105 transition-all 
                       duration-300 ${social.color} group
                       shadow-sm hover:shadow-md border border-transparent hover:border-gray-200`}
          >
            <div className="text-2xl transform group-hover:scale-110 transition-transform duration-200">
              {social.icon}
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-gray-800 truncate font-montserrat">
                {social.name}
              </h4>
              <p className="text-sm text-gray-600 truncate font-roboto">
                {social.handle}
              </p>
            </div>
          </a>
        ))}
      </div>

      {/* Mobile Footer Note */}
      <div className="sm:hidden mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center font-roboto">
          Tap to connect on your favorite platform
        </p>
      </div>
    </div>
  );
}
