// src/components/common/user-login/formFields.js
import { User, Mail, Phone, FolderLock, Lock } from "lucide-react";

export const getFormFields = (isSignUp) => {
  const baseFields = [
    {
      name: "email",
      type: "email",
      label: "Email Address",
      placeholder: "Enter your email",
      icon: Mail,
      required: true,
    },
  ];

  if (isSignUp) {
    return [
      {
        name: "username",
        type: "text",
        label: "Username",
        placeholder: "Enter your username",
        icon: User,
        required: true,
      },
      ...baseFields,
      {
        name: "phone",
        type: "tel",
        label: "Phone Number",
        placeholder: "Enter your phone number",
        icon: Phone,
        required: true,
      },
      {
        name: "password",
        type: "password",
        label: "Password",
        placeholder: "Enter your password",
        icon: FolderLock,
        required: true,
        showToggle: true,
      },
      {
        name: "confirmPassword",
        type: "password",
        label: "Confirm Password",
        placeholder: "Confirm your password",
        icon: Lock,
        required: true,
        showToggle: true,
      },
    ];
  }

  return [
    ...baseFields,
    {
      name: "password",
      type: "password",
      label: "Password",
      placeholder: "Enter your password",
      icon: Lock,
      required: true,
      showToggle: true,
    },
  ];
};
