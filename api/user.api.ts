import axios from "axios";
import { api, BASE_URL, build_form_data } from ".";
import { Adresse, User } from "../pages/type";

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
}) => {
  const formData = build_form_data(params);
  try {
    const response = await api.api?.post<PhoneNumber>(
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
}) => {
  console.log("🚀 ~ phone_number:", params.phone_number)
  const formData = build_form_data(params);
  try {
    const response = await api.api?.put<PhoneNumber>(
      "/v1/user-phones/" + params.id,
      formData
    );
    return response?.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout de favoris :", error);
    return null;
  }
};

export const delete_user_phone = async (params: { id: string }) => {
  try {
    const response = await api.api?.delete<PhoneNumber>(
      "/v1/user-phones/" + params.id
    );
    return response?.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout de favoris :", error);
    return null;
  }
};

export const update_user = async (params: { full_name: string }) => {
  const formData = build_form_data(params);
  try {
    const response = await api.api?.put<User>("/v1/auth/me", formData);
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
}) => {
  const formData = build_form_data(params);
  try {
    const response = await api.api?.post<Adresse>(
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
}) => {
  const formData = build_form_data(params);
  try {
    const response = await api.api?.put<Adresse>(
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


export const delete_user_address = async (params: { id: string }) => {
  try {
    const response = await api.api?.delete<Adresse>(
      "/v1/user-addresses/" + params.id
    );
    return response?.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout de favoris :", error);
    return null;
  }
};

interface Store {
  id: string;
  name: string;
  title: string;
  description: string;
  favicon: string[];
  logo: string[];
  slug: string;
  cover_image: string[];
  phone: string;
  email: string;
  address: string;
  latitude: string;
  longitude: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const get_store: () => Promise<Store> = async () => {
  try {
    const response = await axios.get(BASE_URL.serverUrl + "/stores?store_id=" + BASE_URL.apiUrl.split("/")[3]);
    console.log("🚀 ~ constget_store: ~ response?.data.list?.[0]:", response?.data.list?.[0])
    return response?.data.list?.[0];
  } catch (error) {
    console.error("Erreur lors de l'ajout de favoris :", error);
    return null;
  }
};