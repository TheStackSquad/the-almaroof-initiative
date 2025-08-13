// src/components/community/yellowPage/businessCard.js
"use client";

import { useState } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  Star, 
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock
} from "lucide-react";

const BusinessCardCollapse = ({ business, onViewDetails }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { name, description, rating, verified, address, phone, email, website, operatingHours } = business;

  return (
    <div className="w-full mb-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header - Always visible */}
      <div 
        className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 cursor-pointer w-full"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {name}
            </h3>
            {verified && (
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
            {description}
          </p>
        </div>
        
        <div className="flex items-center gap-3 ml-4">
          {rating && (
            <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">
                {rating}
              </span>
            </div>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </div>
      
      {/* Collapsible content */}
      {isExpanded && (
        <div className="w-full p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="space-y-3">
              {address && (
                <div className="flex items-start w-full">
                  <MapPin className="w-4 h-4 mt-0.5 mr-2 text-gray-600 dark:text-gray-300 flex-shrink-0" />
                  <span className="text-sm dark:text-gray-300 break-words">
                    {address}
                  </span>
                </div>
              )}
              {phone && (
                <div className="flex items-center w-full">
                  <Phone className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-300 flex-shrink-0" />
                  <a
                    href={`tel:${phone}`}
                    className="text-sm dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 break-all"
                  >
                    {phone}
                  </a>
                </div>
              )}
              {email && (
                <div className="flex items-center w-full">
                  <Mail className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-300 flex-shrink-0" />
                  <a
                    href={`mailto:${email}`}
                    className="text-sm dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 break-all"
                  >
                    {email}
                  </a>
                </div>
              )}
            </div>
            <div className="space-y-3">
              {website && (
                <div className="flex items-center w-full">
                  <Globe className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-300 flex-shrink-0" />
                  <a
                    href={website.startsWith('http') ? website : `https://${website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 break-all"
                  >
                    {website}
                  </a>
                </div>
              )}
              {operatingHours && (
                <div className="flex items-center w-full">
                  <Clock className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-300 flex-shrink-0" />
                  <span className="text-sm dark:text-gray-300">
                    {operatingHours}
                  </span>
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(business);
                }}
                className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
              >
                View Full Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessCardCollapse;