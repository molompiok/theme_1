import axios from "axios";
import { useAuthStore } from "../store/user";

export const BASE_URL  = import.meta.env.VITE_BASE_URL;
export const GOOGLE_CLIENT_ID  = import.meta.env.VITE_GOOGLE_CLIENT_ID;


export const api = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    withCredentials: true, 
  });
  
  api.interceptors.response.use(
    (response) => {
    //   console.log("🚀 ~ response:", response.status);
      return response;
    },
    (error) => {
    //   console.log("🚀 ~ error:", error.response.headers);
      if (typeof window !== "undefined" && error.response?.status === 401) {
        console.warn("Session expirée, déconnexion automatique");
        try {
          useAuthStore.getState().logout();
        } catch (err) {
          console.error("Erreur lors de la déconnexion:");
        }
      }
  
      return Promise.reject(error);
    }
  );