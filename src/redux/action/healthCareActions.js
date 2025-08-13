// ===================================================

// src/redux/action/healthcareAction.js
// Healthcare Service Actions
export const bookHealthcareAppointment = (appointmentData) => {
  return {
    type: "BOOK_HEALTHCARE_APPOINTMENT",
    payload: appointmentData,
  };
};

export const downloadHealthRecords = (patientId) => {
  return {
    type: "DOWNLOAD_HEALTH_RECORDS",
    payload: patientId,
  };
};

