import { api, build_search_params } from ".";
import { CommentType, MetaPagination } from "../pages/type";
import { delay } from "../utils";

export const create_comment = async (data: FormData) => {

  try {
    const response = await api.api?.post("/v1/comments", data);
    await delay(1000);
    return response?.data;
  } catch (error) {
    console.error("Erreur lors de la creation du commentaire:", error);
    return {} as { comment_id: string; product_name: string };
  }
};

export const get_comment =  async (data: {  order_item_id: string , with_users?: boolean}) => {
  const searchParams = build_search_params({
    order_item_id: data.order_item_id,
    with_users: data.with_users ? 'true' : 'false'
  });

  try {
    const response = await api.api?.get<CommentType>("/v1/comments/for-item?" + searchParams.toString());
    await delay(1000);
    return response?.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du commentaire :", error);
    return null;
  }
};

export const get_comments = async (data: { product_id: string , page : number , limit : number , with_users?: boolean }) => {
  const searchParams = build_search_params({
    product_id: data.product_id,
    page: data.page,
    limit: data.limit,
    with_users: data.with_users ? 'true' : 'false'
  });

  try {
    const response = await api.api?.get<{list : CommentType[] , meta : MetaPagination}>("/v1/comments?" + searchParams.toString());
    await delay(1000);

    return response?.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires :", error);
    return {list : [] ,meta : null} as  {
      list: CommentType[];
      meta: MetaPagination | null;
  };
  }
};

export const delete_comment = async (id: string) => {
  try {
    const response = await api.api?.delete<{ isDeleted: boolean }>(
      "/v1/comments/" + id
    );
    await delay(1000);
    return response?.data.isDeleted;
  } catch (error) {
    console.error("Erreur lors du retrait du commentaire :", error);
    return false;
  }
};