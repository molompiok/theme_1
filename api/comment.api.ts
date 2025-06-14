import { build_search_params } from ".";
import { CommentType, MetaPagination } from "../pages/type";
import { useAuthStore } from "../store/user";
import { delay } from "../utils";
import { AxiosInstance } from "axios";

export const create_comment = async (data: FormData, api: AxiosInstance) => {
  api.interceptors.request.use(config => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });
  try {
    const response = await api.post("/v1/comments", data);
    await delay(1000);
    return response?.data;
  } catch (error) {
    console.error("Erreur lors de la creation du commentaire:", error);
    return {} as { comment_id: string; product_name: string };
  }
};

export const get_comment = async (data: { order_item_id: string, with_users?: boolean }, api: AxiosInstance) => {
  const searchParams = build_search_params({
    order_item_id: data.order_item_id,
    with_users: data.with_users ? 'true' : 'false'
  });

  try {
    const response = await api.get<CommentType>("/v1/comments/for-item?" + searchParams.toString());
    await delay(1000);
    return response?.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du commentaire :", error);
    return null;
  }
};

export const get_comments = async (data: { product_id: string, page: number, limit: number, with_users?: boolean }, api: AxiosInstance) => {
  api.interceptors.request.use(config => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });
  const searchParams = build_search_params({
    product_id: data.product_id,
    page: data.page,
    limit: data.limit,
    with_users: data.with_users ? 'true' : 'false'
  });

  try {
    const response = await api.get<{ list: CommentType[], meta: MetaPagination }>("/v1/comments?" + searchParams.toString());
    await delay(1000);

    return response?.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires :", error);
    return { list: [], meta: null } as {
      list: CommentType[];
      meta: MetaPagination | null;
    };
  }
};

export const delete_comment = async (id: string, api: AxiosInstance) => {
  api.interceptors.request.use(config => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });
  try {
    const response = await api.delete<{ isDeleted: boolean }>(
      "/v1/comments/" + id
    );
    await delay(1000);
    return response?.data.isDeleted;
  } catch (error) {
    console.error("Erreur lors du retrait du commentaire :", error);
    return false;
  }
};