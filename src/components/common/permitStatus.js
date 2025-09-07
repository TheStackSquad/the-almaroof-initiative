export const PERMIT_STATUS = {
  PENDING_PAYMENT: "pending_payment",
  PAYMENT_PROCESSING: "payment_processing",
  PAID: "paid",
  PAYMENT_FAILED: "payment_failed",
  EXPIRED: "expired",
  REFUNDED: "refunded",
  CANCELLED: "cancelled",
};

export const STATUS_DISPLAY_NAMES = {
  pending_payment: "Pending Payment",
  payment_processing: "Processing Payment",
  paid: "Paid",
  payment_failed: "Payment Failed",
  expired: "Expired",
  refunded: "Refunded",
  cancelled: "Cancelled",
};

export const RETRYABLE_STATUSES = ["pending_payment", "payment_failed"];

export const FINAL_STATUSES = ["paid", "expired", "refunded", "cancelled"];
