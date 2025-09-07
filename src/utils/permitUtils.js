// src/utils/permitUtils.js
import { PERMIT_STATUS } from "@/components/common/permitStatus";

export const getStatusColor = (status) => {
  const colors = {
    [PERMIT_STATUS.PENDING_PAYMENT]: "#f59e0b",
    [PERMIT_STATUS.PAYMENT_PROCESSING]: "#3b82f6",
    [PERMIT_STATUS.PAID]: "#10b981",
    [PERMIT_STATUS.PAYMENT_FAILED]: "#ef4444",
    [PERMIT_STATUS.EXPIRED]: "#6b7280",
    [PERMIT_STATUS.REFUNDED]: "#8b5cf6",
    [PERMIT_STATUS.CANCELLED]: "#9ca3af",
  };
  return colors[status] || "#6b7280";
};

export const getStatusButtonStyle = (status) => {
  const styles = {
    [PERMIT_STATUS.PENDING_PAYMENT]: "bg-amber-100 text-amber-700",
    [PERMIT_STATUS.PAYMENT_PROCESSING]: "bg-blue-100 text-blue-700",
    [PERMIT_STATUS.PAID]: "bg-green-100 text-green-700",
    [PERMIT_STATUS.PAYMENT_FAILED]: "bg-red-100 text-red-700",
    [PERMIT_STATUS.EXPIRED]: "bg-gray-100 text-gray-700",
    [PERMIT_STATUS.REFUNDED]: "bg-purple-100 text-purple-700",
    [PERMIT_STATUS.CANCELLED]: "bg-gray-100 text-gray-700",
  };
  return styles[status] || "bg-gray-100 text-gray-700";
};

export const getStatusCounts = (permits) => {
  const counts = {};
  Object.values(PERMIT_STATUS).forEach((status) => {
    counts[status] = permits.filter((p) => p.status === status).length;
  });
  return counts;
};
