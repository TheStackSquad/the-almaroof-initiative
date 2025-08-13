// src/redux/action/taxPaymentAction.js
// Tax Payment Service Actions
export const processTaxPayment = (paymentData) => {
  return {
    type: "PROCESS_TAX_PAYMENT",
    payload: paymentData,
  };
};

export const getTaxHistory = (userId) => {
  return {
    type: "GET_TAX_HISTORY",
    payload: userId,
  };
};
