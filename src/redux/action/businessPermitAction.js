// src/redux/action/businessPermitAction.js
// Business Permit Service Actions
export const submitBusinessPermitApplication = (applicationData) => {
  return {
    type: "SUBMIT_BUSINESS_PERMIT_APPLICATION",
    payload: applicationData,
  };
};

export const renewBusinessPermit = (renewalData) => {
  return {
    type: "RENEW_BUSINESS_PERMIT",
    payload: renewalData,
  };
};
