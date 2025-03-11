import { BsCheckCircle, BsInfoCircle, BsXCircle } from 'react-icons/bs';
import toast from "react-hot-toast";
import { FiAlertTriangle } from 'react-icons/fi';

type ToastType = "success" | "error" | "info" | "warning";

export const useToast = () => {
  const showToast = (message: string, type: ToastType) => {
    const icons = {
      success: <BsCheckCircle className="text-green-500" />,
      error: <BsXCircle className="text-red-500" />,
      info: <BsInfoCircle className="text-blue-500" />,
      warning: <FiAlertTriangle className="text-yellow-500" />,
    };

    const styles = {
      info: { background: "#1E293B", color: "#fff" },
      warning: { background: "#F59E0B", color: "#000" },
      success: { background: "#22C55E", color: "#fff" },
      error: { background: "#EF4444", color: "#fff" }
    };

    toast(message, {
      icon: icons[type],
      position: 'top-center',
      duration : 5000,
      style: styles[type] || {}, // Appliquer un style uniquement pour info & warning
    });
  };

  return { showToast };
};