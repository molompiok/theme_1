import { api, build_form_data } from ".";
import { Adresse } from "../pages/type";

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
    const { data: userphone } = await api.post<PhoneNumber>(
      "/create_user_phone",
      formData
    );
    return userphone;
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
  const formData = build_form_data(params);
  try {
    const { data: userphone } = await api.put<PhoneNumber>(
      "/update_user_phone",
      formData
    );
    return userphone;
  } catch (error) {
    console.error("Erreur lors de l'ajout de favoris :", error);
    return null;
  }
};

export const delete_user_phone = async (params: { id: string }) => {
  try {
    const { data: userphone } = await api.delete<PhoneNumber>(
      "/delete_user_phone/" + params.id
    );
    return userphone;
  } catch (error) {
    console.error("Erreur lors de l'ajout de favoris :", error);
    return null;
  }
};

export const update_user = async (params: { full_name: string }) => {
  const formData = build_form_data(params);
  try {
    const { data: user } = await api.put<PhoneNumber>("/update_user", formData);
    // await delay(1000);
    return user;
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
    const { data: useradsress } = await api.post<Adresse>(
      "/create_user_address",
      formData
    );
    // await delay(1000);
    return useradsress;
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
    const { data: user_address } = await api.put<Adresse>(
      "/update_user_address",
      formData
    );
    // await delay(1000);
    return user_address;
  } catch (error) {
    console.error("Erreur lors de l'ajout de update_user_address :", error);
    return null;
  }
};


export const delete_user_address = async (params: { id: string }) => {
  try {
    const { data: userphone } = await api.delete<Adresse>(
      "/delete_user_address/" + params.id
    );
    return userphone;
  } catch (error) {
    console.error("Erreur lors de l'ajout de favoris :", error);
    return null;
  }
};