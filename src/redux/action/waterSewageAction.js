// src/redux/action/waterSewageAction.js
// Water & Sewage Service Actions
export const applyWaterConnection = (connectionData) => {
  return {
    type: "APPLY_WATER_CONNECTION",
    payload: connectionData,
  };
};

export const reportWaterIssue = (issueData) => {
  return {
    type: "REPORT_WATER_ISSUE",
    payload: issueData,
  };
};