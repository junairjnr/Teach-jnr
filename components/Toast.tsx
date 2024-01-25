import toast from "react-hot-toast";
import "../app/globals.css";

export function showSuccess(message = "") {
  toast.success(message, { className: " text-white" });
}

export function showError(message = "") {
  toast.error(message, { className: " text-white" });
}