// src/redux/action/birthCertificateAction.js
// Birth Certificate Service Actions
export const registerBirthCertificate = (certificateData) => {
  return {
    type: "REGISTER_BIRTH_CERTIFICATE",
    payload: certificateData,
  };
};

export const correctBirthCertificate = (correctionData) => {
  return {
    type: "CORRECT_BIRTH_CERTIFICATE",
    payload: correctionData,
  };
};
