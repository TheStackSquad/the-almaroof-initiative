// src/components/community/yellowPage/BusinessCard.js
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Star,
  CheckCircle,
} from "lucide-react";

const BusinessCard = ({ business, onViewDetails }) => {
  const {
    name,
    category,
    address,
    phone,
    email,
    website,
    description,
    operatingHours,
    area,
    verified,
    rating,
  } = business;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden group">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white font-['Montserrat'] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {name}
              </h3>
              {verified && (
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full font-medium">
                {category}
              </span>
              <span className="text-gray-600 dark:text-gray-400">{area}</span>
            </div>
          </div>
          {rating && (
            <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                {rating}
              </span>
            </div>
          )}
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4 font-['Roboto']">
          {description}
        </p>
      </div>

      {/* Contact Info */}
      <div className="px-6 pb-4 space-y-2">
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="truncate">{address}</span>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
          <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <a
            href={`tel:${phone}`}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {phone}
          </a>
        </div>

        {email && (
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <a
              href={`mailto:${email}`}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
            >
              {email}
            </a>
          </div>
        )}

        {website && (
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
            <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <a
              href={`https://${website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
            >
              {website}
            </a>
          </div>
        )}

        {operatingHours && (
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
            <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">{operatingHours}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
        <button
          onClick={() => onViewDetails(business)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default BusinessCard;
