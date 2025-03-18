import axios from "axios";
import { useAuthStore } from "../store/user";
import toast from "react-hot-toast";
import { BsXCircle } from "react-icons/bs";

export const BASE_URL = import.meta.env.VITE_BASE_URL;
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  withCredentials: true,
});


export function build_search_params(params: Record<string, string | number | undefined>): URLSearchParams {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.set(key, value.toString());
    }
  });
  return searchParams;
}

export function build_form_data(params: Record<string, string | number | undefined>): FormData {
  const formData = new FormData();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value.toString());
    }
  });

  return formData;
}


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined") {
      const status = error.response?.status;
      const { wasLoggedIn, logout } = useAuthStore.getState();
      if (status === 401 && wasLoggedIn) {
        console.warn("Session expirée, déconnexion automatique");
        logout();
        // if (!localStorage.getItem("hasShownSessionExpired")) {
        //   toast.custom((t) => (
        //     <div className="flex items-center gap-3 p-4 bg-red-100 border-l-4 border-red-500 rounded-lg shadow-lg">
        //       <BsXCircle className="w-6 h-6 text-red-600" />
        //       <p className="text-red-800 font-medium">
        //         Deconexion reussie 
        //       </p>
        //     </div>
        //   ));
        //   localStorage.setItem("hasShownSessionExpired", "true");
        // }
      }
    }
    return Promise.reject(error);
  }
);
