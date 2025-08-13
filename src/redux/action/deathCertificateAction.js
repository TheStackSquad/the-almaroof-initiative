
// src/redux/action/deathCertificateAction.js
// Death Certificate Service Actions
export const registerDeathCertificate = (deathData) => {
  return {
    type: "REGISTER_DEATH_CERTIFICATE",
    payload: deathData,
  };
};

export const verifyDeathCertificate = (verificationData) => {
  return {
    type: "VERIFY_DEATH_CERTIFICATE",
    payload: verificationData,
  };
};
