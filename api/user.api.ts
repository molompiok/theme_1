import axios, { AxiosInstance } from "axios";
import { build_form_data } from "./";
import { Adresse, User } from "../pages/type";
import { useAuthStore } from "../store/user";

type PhoneNumber = {
  id: string;
  user_id: string;
  phone_number: string;
  format: string;

  country_code: string;
  created_at: string;
  updated_at: string;
};

export const create_user_phone = async (params: {
  phone_number: string;
  format: string;
  country_code: string;
}, api: AxiosInstance) => {
  const formData = build_form_data(params);
  api.interceptors.request.use(config => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });
  try {
    const response = await api.post<PhoneNumber>(
      "/v1/user-phones",
      formData
    );
    return response?.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout de favoris :", error);
    return null;
  }
};

export const update_user_phone = async (params: {
  phone_number: string;
  id: string;
  format: string;
  country_code: string;
}, api: AxiosInstance) => {
  const formData = build_form_data(params);
  api.interceptors.request.use(config => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });
  try {
    const response = await api.put<PhoneNumber>(
      "/v1/user-phones/" + params.id,
      formData
    );
    return response?.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout de favoris :", error);
    return null;
  }
};

export const delete_user_phone = async (params: { id: string }, api: AxiosInstance) => {
  try {
    const response = await api.delete<PhoneNumber>(
      "/v1/user-phones/" + params.id
    );
    return response?.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout de favoris :", error);
    return null;
  }
};

export const update_user = async (params: { full_name: string }, api: AxiosInstance) => {
  const formData = build_form_data(params);
  api.interceptors.request.use(config => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });
  try {
    const response = await api.put<User>("/v1/auth/me", formData);
    // await delay(1000);
    return response?.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout de favoris :", error);
    return null;
  }
};

export const create_user_address = async (params: {
  name: string;
  longitude: string;
  latitude: string;
}, api: AxiosInstance) => {
  const formData = build_form_data(params);
  api.interceptors.request.use(config => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });
  try {
    const response = await api.post<Adresse>(
      "/v1/user-addresses",
      formData
    );
    // await delay(1000);
    return response?.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout d'adresse :", error);
    return null;
  }
};

export const update_user_address = async (params: {
  name: string;
  longitude: string;
  latitude: string;
  id: string
}, api: AxiosInstance) => {
  const formData = build_form_data(params);
  api.interceptors.request.use(config => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });
  try {
    const response = await api.put<Adresse>(
      "/v1/user-addresses/" + params.id,
      formData
    );
    // await delay(1000);
    return response?.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout de update_user_address :", error);
    return null;
  }
};


export const delete_user_address = async (params: { id: string }, api: AxiosInstance) => {
  api.interceptors.request.use(config => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });
  try {
    const response = await api.delete<Adresse>(
      "/v1/user-addresses/" + params.id
    );
    return response?.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout de favoris :", error);
    return null;
  }
};
