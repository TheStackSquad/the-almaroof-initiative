// src/components/dashboard/statusSummary.js
import { getStatusColor } from "@/utils/permitUtils";
import { STATUS_DISPLAY_NAMES } from "@/components/common/permitStatus";

const StatusSummary = ({ statusCounts }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    {Object.entries(statusCounts).map(([status, count]) => (
      <div
        key={status}
        className="bg-white rounded-xl p-4 shadow-sm border-l-4"
        style={{ borderLeftColor: getStatusColor(status) }}
      >
        <div className="text-2xl font-bold text-gray-900">{count}</div>
        <div className="text-sm text-gray-600 capitalize">
          {STATUS_DISPLAY_NAMES[status] || status.replace("_", " ")}
        </div>
      </div>
    ))}
  </div>
);
