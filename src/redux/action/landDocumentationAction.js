// src/redux/action/landDocumentationAction.js
// Land Documentation Service Actions
export const verifyLandOwnership = (landData) => {
  return {
    type: "VERIFY_LAND_OWNERSHIP",
    payload: landData,
  };
};

export const applyBuildingPermit = (permitData) => {
  return {
    type: "APPLY_BUILDING_PERMIT",
    payload: permitData,
  };
};
