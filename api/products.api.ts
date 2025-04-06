import { api, build_search_params } from "./";
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
    slug,
  } = product;
  return {
    barred_price,
    description,
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
  page?: number;
  limit?: number;
  filters?: Record<string, FilterValue[]>;
}) => {
  const searchParams = build_search_params(params);
  await delay(3000);
  try {
    const { data } = await api.get<{
      list: ProductType[];
      category?: { id: string; name: string; description: string , view : string[] };
      meta: MetaPagination;
    }>("/get_products?" + searchParams.toString());
    return {
      list: data.list.map(minimize_product),
      meta: data.meta,
      category: data.category,
    };
  } catch (error : any) {
    console.error("Erreur lors de la récupération des produits :", error.message );
    return {
      list: [],
      category: null,
    };
  }
};

export const get_features_with_values = async (params: {
  product_id?: string;
  feature_id?: string;
}) => {
  
  const searchParams = build_search_params(params);
  try {
    const { data } = await api.get<Feature[]>(
      "/get_features_with_values?" + searchParams.toString()
    );
    return data;
  } catch (error) {
    throw new Error("Erreur lors de la récupération des features :" + error);
  }
};

export const get_products_by_category = async (params: {
  order_by?: string;
  slug: string;
  page?: number;
  limit?: number;
}) => {
  const searchParams = build_search_params(params);

  try {
    const { data } = await api.get<{
      list: {
        products: ProductType[];
        category: { id: string; name: string; description: string };
      };
      meta: MetaPagination;
    }>("/get_products_by_category?" + searchParams.toString());
    return data.list;
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
export const create_favorite = async (data: { product_id: string }) => {
  const formData = new FormData();
  formData.append("product_id", data.product_id);

  try {
    const { data: favorite } = await api.post<{
      favorite_id: string;
      product_name: string;
    }>("/create_favorite", formData);
    await delay(1000);
    return favorite;
  } catch (error) {
    console.error("Erreur lors de l'ajout de favoris :", error);
    return {} as { favorite_id: string; product_name: string };
  }
};

export const delete_favorite = async (id: string) => {
  try {
    const { data: favorite } = await api.delete<{ isDeleted: boolean }>(
      "/delete_favorite/" + id
    );
    await delay(1000);
    return favorite.isDeleted;
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
  page?: number;
  limit?: number;
}) => {
  const searchParams = build_search_params(params);

  try {
    const response = await api.get<{ list: ProductFavorite[] , meta : MetaPagination }>(
      `/get_favorites?${searchParams.toString()}`
    );
    await delay(3000);
    return response.data;
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

export const get_filters = async (params: { slug?: string }) => {
  const searchParams = build_search_params(params);

  try {
    const response = await api.get<Filter[]>(
      "/get_filters?" + searchParams.toString()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching feature details:", error);
    throw error;
  }
};



export const get_details = async (params: { product_id?: string  }) => {
  const searchParams = build_search_params(params);
  try {
    const response = await api.get<{list : Detail[] , meta : MetaPagination}>(
      "/get_details?" + searchParams.toString()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching feature details:", error);
    throw error;
  }
};