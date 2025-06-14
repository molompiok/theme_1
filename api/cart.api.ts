import { AxiosError, AxiosInstance } from "axios";
import { build_form_data, build_search_params } from ".";
import { CartResponse, CartUpdateResponse, MetaPagination, OrderByType, OrderByTypeOrder, UserOrder } from "../pages/type";
import { delay } from "../utils";
import { getGuestCartId, setGuestCartId } from "../utils/storeCart";
import { useAuthStore } from "../store/user";

export const update_cart = async (params: {
  product_id: string;
  mode: 'increment' | 'decrement' | 'set' | 'clear' | 'max';
  value?: number;
  ignoreStock?: boolean; // Note: le backend attend `ignore_stock`
  bind: Record<string, any>; // `bind` peut être plus complexe que Record<string, string>
}, api: AxiosInstance) => {
  api.interceptors.request.use(config => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });
  const user = useAuthStore.getState().user; // Obtenir l'état actuel de l'utilisateur
  const payload: any = { ...params };

  if (params.ignoreStock !== undefined) {
    payload.ignore_stock = params.ignoreStock; // Assurer la bonne casse pour le backend
    delete payload.ignoreStock;
  }


  if (!user) {
    const guestCartId = getGuestCartId();
    if (guestCartId) {
      payload.guest_cart_id = guestCartId;
    }
  }

  const formData = build_form_data(payload); // build_form_data doit gérer la structure de payload

  try {
    console.log('Updating cart with payload:', Object.fromEntries(formData.entries()));
    const response = await api?.post<CartUpdateResponse>('/v1/cart/update', formData);

    if (response?.data && !user && response.data.new_guest_cart_id) {
      setGuestCartId(response.data.new_guest_cart_id);
    }

    // await delay(1000); // Vous pouvez le garder si nécessaire pour le débogage
    return response?.data || {};
  } catch (error) {
    console.error('Erreur lors de update_cart_api:', error);
    // Gérer l'erreur, par exemple la logger, la transformer, ou la rejeter pour que useMutation la gère
    throw error;
  }
};

export const view_cart = async (api: AxiosInstance) => {
  api.interceptors.request.use(config => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });
  const user = useAuthStore.getState().user;
  let url = "/v1/cart";

  if (!user) {
    const guestCartId = getGuestCartId();
    if (guestCartId) {
      url += `?guest_cart_id=${guestCartId}`;
    }
  }

  try {
    const response = await api.get<CartResponse>(url);
    return response?.data || {};
  } catch (error) {
    console.error("Error fetching cart details:", error);
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
}, api: AxiosInstance) => {
  api.interceptors.request.use(config => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });
  const formData = build_form_data(params);
  try {
    const response = await api.post('/v1/orders', formData);

    return response?.data || {};

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

export const get_orders = async (params: { order_by: OrderByTypeOrder, page: number, limit: number }, api: AxiosInstance) => {
  api.interceptors.request.use(config => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });
  const searchParams = build_search_params(params);
  await delay(1000);
  try {
    const response = await api.get<{ list: UserOrder[], meta: MetaPagination }>('/v1/orders/my-orders?' + searchParams.toString());
    return response?.data || { list: [], meta: {} }
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    throw error;
  }
}