import { api, build_search_params } from ".";
import { CommentType, MetaPagination } from "../pages/type";
import { delay } from "../utils";

export const create_comment = async (data: FormData) => {

  try {
    const { data: comment } = await api.post("/create_comment", data);
    await delay(1000);
    return comment;
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
    const { data: comment } = await api.get<CommentType>("/get_comment?" + searchParams.toString());
    await delay(1000);
    return comment;
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
    const { data: comments } = await api.get<{list : CommentType[] , meta : MetaPagination}>("/get_comments?" + searchParams.toString());
    await delay(1000);

    return comments;
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
    const { data: comment } = await api.delete<{ isDeleted: boolean }>(
      "/delete_comment/" + id
    );
    await delay(1000);
    return comment.isDeleted;
  } catch (error) {
    console.error("Erreur lors du retrait du commentaire :", error);
    return false;
  }
};