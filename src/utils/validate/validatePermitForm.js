// src/utils/validate/validatePermitForm.js

// export default function validatePermitForm(formData) {
//   const errors = {};

//   if (!formData.full_name || formData.full_name.trim() === "") {
//     errors.full_name = "Full name is required";
//   }

//   if (
//     !formData.email ||
//     !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)
//   ) {
//     errors.email = "Valid email is required";
//   }

//   if (!formData.phone || !/^\d{10,15}$/.test(formData.phone)) {
//     errors.phone = "Valid phone number is required";
//   }

//   if (!formData.permit_type || formData.permit_type !== "business-permit") {
//     errors.permit_type = "Permit type must be 'business-permit'";
//   }

//   return errors;
// }


// src/utils/validate/validatePermitForm.js
export default function validatePermitForm(formData) {
  const errors = {};
  console.log("Running validation for form data:", formData);

  if (!formData.full_name || formData.full_name.trim() === "") {
    errors.full_name = "Full name is required";
  }

  if (
    !formData.email ||
    !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)
  ) {
    errors.email = "Valid email is required";
  }

  if (!formData.phone || !/^\d{10,15}$/.test(formData.phone)) {
    errors.phone = "Valid phone number is required";
  }

  if (!formData.permit_type || formData.permit_type !== "business-permit") {
    errors.permit_type = "Permit type must be 'business-permit'";
  }

  // Log the final results before returning
  if (Object.keys(errors).length > 0) {
    console.log("Validation errors found:", errors);
  } else {
    console.log("No validation errors found. Form is valid.");
  }

  return errors;
}