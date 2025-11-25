import { AxiosInstance } from "axios";
import { build_search_params } from ".";
import { MetaPagination, ProductFaqListResponse } from "../pages/type";

type GetProductFaqsParams = {
  product_id: string;
  group?: string;
  page?: number;
  limit?: number;
};

const EMPTY_META: MetaPagination = {
  total: 0,
  per_page: 0,
  current_page: 1,
  last_page: 1,
  first_page: 1,
  first_page_url: "",
  last_page_url: "",
  next_page_url: null,
  previous_page_url: null,
};

export const get_product_faqs = async (
  params: GetProductFaqsParams,
  api: AxiosInstance
): Promise<ProductFaqListResponse> => {
  const searchParams = build_search_params(params);
  try {
    const response = await api.get<ProductFaqListResponse>(
      "/v1/product-faqs?" + searchParams.toString()
    );
    return (
      response?.data ?? {
        list: [],
        meta: EMPTY_META,
      }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des FAQs :", error);
    throw error;
  }
};


