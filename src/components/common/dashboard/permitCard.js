// src/components/dashboard/permitCard.js
import { PERMIT_STATUS, STATUS_DISPLAY_NAMES } from "@/components/common/permitStatus";
import { formatAmount } from "@/config/permitFees";

export default function PermitCard({ permit, onUpdate }) {
  const getStatusColor = (status) => {
    const colors = {
      [PERMIT_STATUS.PENDING_PAYMENT]:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 border-amber-200 dark:border-amber-800",
      [PERMIT_STATUS.PAYMENT_PROCESSING]:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      [PERMIT_STATUS.PAID]:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 border-green-200 dark:border-green-800",
      [PERMIT_STATUS.PAYMENT_FAILED]:
        "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 border-red-200 dark:border-red-800",
      [PERMIT_STATUS.EXPIRED]:
        "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700",
      [PERMIT_STATUS.REFUNDED]:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300 border-purple-200 dark:border-purple-800",
      [PERMIT_STATUS.CANCELLED]:
        "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700",
    };
    return (
      colors[status] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-montserrat truncate">
            {permit.permit_type.replace("-", " ").toUpperCase()} -{" "}
            {permit.application_type.toUpperCase()}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Reference: {permit.reference || "N/A"}
          </p>
        </div>

        <div className="flex-shrink-0">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              permit.status
            )}`}
          >
            {STATUS_DISPLAY_NAMES[permit.status] ||
              permit.status.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Amount
          </p>
          <p className="text-xl font-bold text-gray-900 dark:text-white font-roboto">
            {formatAmount(permit.amount)}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Submitted
          </p>
          <p className="text-sm text-gray-900 dark:text-white font-roboto">
            {formatDate(permit.created_at)}
          </p>
        </div>

        {permit.paid_at && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Paid At
            </p>
            <p className="text-sm text-gray-900 dark:text-white font-roboto">
              {formatDate(permit.paid_at)}
            </p>
          </div>
        )}

        {permit.expires_at &&
          permit.status === PERMIT_STATUS.PENDING_PAYMENT && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Expires
              </p>
              <p className="text-sm text-gray-900 dark:text-white font-roboto">
                {formatDate(permit.expires_at)}
              </p>
            </div>
          )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
        {permit.status === PERMIT_STATUS.PAYMENT_FAILED &&
          permit.payment_attempts < 3 && (
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
              Retry Payment
            </button>
          )}

        {permit.status === PERMIT_STATUS.PENDING_PAYMENT && (
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
            Continue Payment
          </button>
        )}

        <button className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
          View Details
        </button>
      </div>
    </article>
  );
}
