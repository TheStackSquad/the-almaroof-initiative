// src/components/community/yellowPage/BusinessModal.js
import {
  X,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Star,
  CheckCircle,
  Calendar,
} from "lucide-react";

const BusinessModal = ({ business, isOpen, onClose }) => {
  if (!isOpen || !business) return null;

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
    dateAdded,
  } = business;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-['Montserrat']">
              {name}
            </h2>
            {verified && <CheckCircle className="w-6 h-6 text-green-500" />}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Category and Rating */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full font-medium">
                {category}
              </span>
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                {area}
              </span>
            </div>
            {rating && (
              <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded-lg">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="font-medium text-yellow-700 dark:text-yellow-400">
                  {rating} / 5.0
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 font-['Montserrat']">
              About
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-['Roboto']">
              {description}
            </p>
          </div>

          {/* Contact Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 font-['Montserrat']">
              Contact Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">
                    Address
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">{address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">
                    Phone
                  </p>
                  <a
                    href={`tel:${phone}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {phone}
                  </a>
                </div>
              </div>

              {email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      Email
                    </p>
                    <a
                      href={`mailto:${email}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {email}
                    </a>
                  </div>
                </div>
              )}

              {website && (
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      Website
                    </p>
                    <a
                      href={`https://${website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {website}
                    </a>
                  </div>
                </div>
              )}

              {operatingHours && (
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      Operating Hours
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      {operatingHours}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">
                    Listed Since
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {formatDate(dateAdded)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <a
              href={`tel:${phone}`}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium text-center transition-colors"
            >
              Call Now
            </a>
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-3 px-4 rounded-lg font-medium text-center transition-colors"
              >
                Send Email
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessModal;
