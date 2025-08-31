// src/config/permitFees.js
export const PERMIT_FEES = {
  "business-permit": {
    new: 2500, // ₦250 in kobo - final amount should be two thousand, five hundred naira in figure, the same goes for others
    renew: 1500, // ₦150 in kobo
  },
  "building-permit": {
    new: 5000, // ₦500 in kobo
    renew: 3000, // ₦300 in kobo
  },
  "event-permit": {
    new: 1000, // ₦100 in kobo
    renew: 750, // ₦75 in kobo
  },
};

export const formatAmount = (amountInKobo) => {
  return `₦${(amountInKobo / 100).toFixed(2)}`;
};

export const getPermitFee = (permitType, applicationType) => {
  return PERMIT_FEES[permitType]?.[applicationType] || 0;
};
