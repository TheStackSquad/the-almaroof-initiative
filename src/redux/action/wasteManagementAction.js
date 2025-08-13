// src/redux/action/wasteManagementAction.js
// Waste Management Service Actions
export const scheduleWastePickup = (pickupData) => {
  return {
    type: "SCHEDULE_WASTE_PICKUP",
    payload: pickupData,
  };
};

export const reportMissedCollection = (reportData) => {
  return {
    type: "REPORT_MISSED_COLLECTION",
    payload: reportData,
  };
};

// ===================================================
