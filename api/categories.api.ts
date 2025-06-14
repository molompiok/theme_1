import { AxiosInstance } from "axios";
import { build_search_params } from ".";
import { Category, MetaPagination } from "../pages/type";

export const get_categories = async ({
  categories_id,
  search,
  slug,
  store_id,
  order_by,
  page,
  limit,
}: {
  product_id?: string;
  store_id?: string;
  search?: string;
  slug?: string;
  order_by?: "date_asc" | "date_desc" | "price_asc" | "price_desc";
  categories_id?: string[];
  page?: number;
  limit?: number;
}, api: AxiosInstance) => {
  const searchParams = build_search_params({
    categories_id,
    search,
    slug,
    store_id,
    order_by,
    page,
    limit,
  });

  try {
    const response = await api?.get<{
      list: Category[];
      meta: MetaPagination;
    }>("/v1/categories?" + searchParams.toString());
    return response?.data || {
      list: [],
      meta: {},
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :" + error);
    throw error;
  }
};
