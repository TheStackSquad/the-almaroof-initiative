// src/components/common/toastAlert/toast.js
import { toast } from "react-toastify";

export const showToast = (message, type = "success") => {
  switch (type) {
    case "error":
      toast.error(message);
      break;
    case "info":
      toast.info(message);
      break;
    case "warn":
      toast.warn(message);
      break;
    case "success":
    default:
      toast.success(message);
      break;
  }
};
