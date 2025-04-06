import { AxiosError } from "axios";
import { api, build_form_data, build_search_params } from ".";
import { CartResponse, CartUpdateResponse, MetaPagination, OrderByType, OrderByTypeOrder, UserOrder } from "../pages/type";
import { delay } from "../utils";

export const update_cart = async (params: {
  product_id: string;
  mode: 'increment' | 'decrement' | 'set' | 'clear' | 'max';
  value?: number;
  ignoreStock?: boolean;
  bind: Record<string, string>;
}) => {
  const formData = build_form_data(params);
    try {
      const { data } = await api.post<CartUpdateResponse>('/update_cart', formData);
      await delay(1000); 
      return data;
    } catch (error) {
      console.error('Erreur lors de update_cart:', error);
      throw error; 
    }
  };

export const view_cart = async () => {
  try {
    const response = await api.get<CartResponse>(
      "/view_cart"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching feature details:", error);
    throw error;
  }
};



export const create_user_order = async (params: {
  delivery_price?: number;
  total_price?: number;
  phone_number?: string;
  formatted_phone_number?: string;
  country_code?: string;
  delivery_address?: string;
  delivery_address_name?: string;
  delivery_date?: string;
  delivery_latitude?: number;
  delivery_longitude?: number;
  pickup_address?: string;
  pickup_address_name?: string;
  pickup_date?: string;
  pickup_latitude?: number;
  pickup_longitude?: number;
  with_delivery?: boolean;
}) => {
  const formData = build_form_data(params);
  try {
    const response = await api.post('/create_user_order', formData);

    return response.data;

  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    
    if (error instanceof AxiosError) {
      if (error.response?.status === 400) {
        throw new Error('Le panier est vide');
      }
      if (error.response?.status === 500) {
        throw new Error('Échec de la création de la commande');
      }
      throw new Error(error.response?.data?.message || 'Erreur lors de la création');
    }
    
    throw error;
  }
};

export const get_orders = async (params : { order_by : OrderByTypeOrder , page : number , limit : number })=>{
  const searchParams = build_search_params(params);
  await delay(1000);
  try {
    const response = await api.get<{list : UserOrder[] , meta : MetaPagination}>('/get_orders?' + searchParams.toString());
    return response.data
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    throw error;
  }
}