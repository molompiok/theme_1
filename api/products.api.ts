import { build_search_params } from "./";
import {
  Detail,
  Feature,
  Filter,
  FilterValue,
  GroupProductType,
  MetaPagination,
  OrderByType,
  ProductClient,
  ProductFavorite,
  ProductType,
} from "../pages/type";
import { delay } from "../utils";
import { AxiosInstance } from "axios";
import { useAuthStore } from "../store/user";

function minimize_product(product: ProductType): ProductClient {
  const {
    barred_price,
    description,
    name,
    id,
    rating,
    price,
    currency,
    default_feature_id,
    categories_id,
    comment_count,
    slug,
  } = product;
  return {
    barred_price,
    description,
    comment_count,
    name,
    id,
    rating,
    categories_id,
    price,
    currency,
    default_feature_id,
    slug,
  };
}

export const get_products = async (params: {
  product_id?: string;
  store_id?: string;
  slug_product?: string;
  slug_cat?: string;
  search?: string;
  order_by?: OrderByType;
  categories_id?: string[];
  min_price?: number;
  max_price?: number;
  page?: number;
  limit?: number;
  filters?: Record<string, FilterValue[]>;
}, api: AxiosInstance) => {
  const searchParams = build_search_params(params);
  try {
    const response = await api.get<{
      list: ProductType[];
      category?: { id: string; name: string; description: string, view: string[] };
      meta: MetaPagination;
    }>("/v1/products?" + searchParams.toString());


    return {
      list: response?.data?.list?.map(minimize_product) ?? [],
      meta: response?.data?.meta ?? { page: 1, limit: 10, total: 0 }, // ou type vide si besoin
      category: response?.data?.category ?? undefined,
    };;
  } catch (error: any) {
    console.error("Erreur lors de la récupération des produits :", error.message);
    // On relance l'erreur pour que React Query la gère.
    throw error;
  }
};

export const get_similar_products = async ({ slug, api }: { slug: string, api: AxiosInstance }): Promise<ProductType[]> => {
  try {
    // On appelle la nouvelle URL
    const response = await api.get<ProductType[]>(`/v1/products/similar/${slug}`);
    return response?.data || [];
  } catch (error) {
    console.error("Failed to fetch similar products:", error);
    throw error; // L'erreur sera gérée par React Query
  }
};

export const get_features_with_values = async (params: {
  product_id?: string;
  feature_id?: string;
}, api: AxiosInstance) => {

  const searchParams = build_search_params(params);

  try {
    const response = await api.get<Feature[]>(
      "/v1/features/with-values?" + searchParams.toString()
    );
    return response?.data || [];
  } catch (error) {
    throw new Error("Erreur lors de la récupération des features :" + error);
  }
};

export const get_products_by_category = async (params: {
  order_by?: string;
  slug: string;
  page?: number;
  limit?: number;
}, api: AxiosInstance) => {
  const searchParams = build_search_params(params);

  try {
    const response = await api.get<{
      list: {
        products: ProductType[];
        category: { id: string; name: string; description: string };
      };
      meta: MetaPagination;
    }>('/v1/products?' + searchParams.toString());
    return response?.data.list;
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
    throw new Error("Erreur lors de la récupération des produits :" + error);
  }
};
// Récupérer les groupes de produits
// export const get_group_product = async (params: { group_product_id?: string; product_id?: string }) => {
//   const searchParams = build_search_params(params);

//   try {
//     const { data: features } = await api.get<{ list: GroupProductType[]; meta: MetaPagination }>(
//       "/get_group_products?" + searchParams.toString()
//     );
//     return features.list;
//   } catch (error) {
//     console.error("Erreur lors de la récupération des features :", error);
//     return [];
//   }
// };

// Gestion des favoris
export const create_favorite = async (data: { product_id: string }, api: AxiosInstance) => {

  api.interceptors.request.use(config => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });
  const formData = new FormData();
  formData.append("product_id", data.product_id);



  try {
    const response = await api.post<{ favorite: { favorite_id: string; product_name: string }, message: string }>("/v1/favorites", formData);
    return response?.data.favorite;
  } catch (error) {
    console.error("Erreur lors de l'ajout de favoris :", error);
    return {} as { favorite_id: string; product_name: string };
  }
};

export const delete_favorite = async (id: string, api: AxiosInstance) => {
  api.interceptors.request.use(config => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });
  try {
    const response = await api.delete<{ isDeleted: boolean }>(
      "/v1/favorites/" + id
    );
    return response?.data.isDeleted;
  } catch (error) {
    console.error("Erreur lors du retrait du favoris :", error);
    return false;
  }
};

export const get_favorites = async (params: {
  user_id?: string;
  label?: string;
  product_id?: string;
  order_by?: "date_asc" | "date_desc" | "price_asc" | "price_desc";
  min_price?: number;
  max_price?: number;
  page?: number;
  limit?: number;
}, api: AxiosInstance) => {
  const searchParams = build_search_params(params);
  api.interceptors.request.use(config => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });


  try {
    const response = await api.get<{ list: ProductFavorite[], meta: MetaPagination }>(
      `/v1/favorites?${searchParams.toString()}`);
    return response?.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des favoris :", error);
    throw error;
  }
};

// export const get_group_by_feature = async (params: {
//   product_id: string;
//   feature_key?: string;
//   feature_value?: string;
// }) => {
//   const searchParams = build_search_params(params);

//   try {
//     const response = await api.get<GroupProductType[]>(
//       "/get_group_by_feature?" + searchParams.toString()
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching feature details:", error);
//     throw error;
//   }
// };

export const get_filters = async (params: { slug?: string }, api: AxiosInstance) => {
  const searchParams = build_search_params(params);

  try {
    const response = await api.get<Filter[]>(
      "/v1/categories/filters?" + searchParams.toString()
    );
    return response?.data || [];
  } catch (error) {
    console.error("Error fetching feature details:", error);
    throw error;
  }
};



export const get_details = async (params: { product_id?: string }, api: AxiosInstance) => {
  const searchParams = build_search_params(params);
  try {
    const response = await api.get<{ list: Detail[], meta: MetaPagination }>(
      "/v1/details?" + searchParams.toString()
    );
    return response?.data || { list: [], meta: {} };
  } catch (error) {
    console.error("Error fetching feature details:", error);
    throw error;
  }
};