// src/config/permitFees.js
export const PERMIT_FEES = {
  "business-permit": {
    new: 25000, // ₦250 in kobo
    renew: 15000, // ₦150 in kobo
  },
  "building-permit": {
    new: 50000, // ₦500 in kobo
    renew: 30000, // ₦300 in kobo
  },
  "event-permit": {
    new: 10000, // ₦100 in kobo
    renew: 7500, // ₦75 in kobo
  },
};

export const formatAmount = (amountInKobo) => {
  return `₦${(amountInKobo / 100).toLocaleString()}`;
};

export const getPermitFee = (permitType, applicationType) => {
  return PERMIT_FEES[permitType]?.[applicationType] || 0;
};
