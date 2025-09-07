export const PERMIT_FEES = {
  "business-permit": {
    new: 250000, // ₦2,500.00 (250,000 kobo)
    renew: 150000, // ₦1,500.00 (150,000 kobo)
  },
  "building-permit": {
    new: 500000, // ₦5,000.00
    renew: 300000, // ₦3,000.00
  },
  "event-permit": {
    new: 150000, // ₦1,500.00
    renew: 75000, // ₦750.00
  },
};

export const formatAmount = (amountInKobo) => {
  // Handle both integer and decimal string inputs
  const numericAmount =
    typeof amountInKobo === "string" ? parseFloat(amountInKobo) : amountInKobo;

  return `₦${(numericAmount / 100).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const getPermitFee = (permitType, applicationType) => {
  return PERMIT_FEES[permitType]?.[applicationType] || 0;
};
