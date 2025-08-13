// src/redux/action/policeAction.js
// Police Service Actions
export const reportCrimeOnline = (crimeData) => {
  return {
    type: "REPORT_CRIME_ONLINE",
    payload: crimeData,
  };
};

export const requestPoliceReport = (requestData) => {
  return {
    type: "REQUEST_POLICE_REPORT",
    payload: requestData,
  };
};
