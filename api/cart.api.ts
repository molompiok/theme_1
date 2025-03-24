import { api, build_form_data, build_search_params } from ".";
import { CartResponse, CartUpdateResponse } from "../pages/type";
import { delay } from "../utils";

export const update_cart = async (params: {
    group_product_id: string;
    mode: 'increment' | 'decrement' | 'set' | 'clear' | 'max';
    value?: number;
    ignoreStock?: boolean;
  }) => {
    const formData = build_form_data(params);
    try {
      const { data } = await api.post<CartUpdateResponse>('/update_cart', formData);
      console.log('Réponse de update_cart', data); 
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
