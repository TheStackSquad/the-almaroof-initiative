// src/redux/action/marriageCertificateAction.js
// Marriage Certificate Service Actions
export const registerMarriageCertificate = (marriageData) => {
  return {
    type: "REGISTER_MARRIAGE_CERTIFICATE",
    payload: marriageData,
  };
};

export const bookMarriageDate = (bookingData) => {
  return {
    type: "BOOK_MARRIAGE_DATE",
    payload: bookingData,
  };
};
