import { create } from "zustand";
import { combine } from "zustand/middleware";
import { CommentType, ProductClient, ProductFeature } from "../pages/type";

export const useModalStore = create(
  combine(
    {
      isModalOpen: false,
    },
    (set) => ({
      setModalOpen: (open: boolean) => set({ isModalOpen: open }),
    })
  )
);


export const useModalCommentStore = create(
  combine(
    {
      isModalOpen: false,
      product: null as {
        product_id: string;
        name : string,
        order_item_id: string;
        user_id: string;
      } | null,
    },
    (set) => ({
      setModalOpen: (open: boolean , product?: {
        product_id: string;
        name : string,
        order_item_id: string;
        user_id: string;
      }) => set({ isModalOpen: open , product: open && product ? product : null }),
    })
  )
);



export const useModalReview = create(
  combine(
    {
      isModalOpen: false,
      comment: null as Partial<CommentType> | null,
    },
    (set) => ({
      setModalOpen: (open: boolean , comment?: Partial<CommentType>) => set({ isModalOpen: open , comment: open && comment ? comment : null }),
    })
  )
);

