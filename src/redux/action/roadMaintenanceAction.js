// src/redux/action/roadMaintenanceAction.js
// Road Maintenance Service Actions
export const reportRoadDamage = (damageData) => {
  return {
    type: "REPORT_ROAD_DAMAGE",
    payload: damageData,
  };
};

export const requestStreetLightRepair = (repairData) => {
  return {
    type: "REQUEST_STREET_LIGHT_REPAIR",
    payload: repairData,
  };
};
