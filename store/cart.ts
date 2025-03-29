import { create } from "zustand";
import { combine, createJSONStorage, persist } from "zustand/middleware";
import { GroupProductType, ProductClient } from "../pages/type";

interface CartItem {
  product: ProductClient;
  group_product: GroupProductType;
  nbr: number;
  totalPrice: number;
}

export const useModalCart = create(
  persist(
    combine(
      {
        // panier: [] as CartItem[],
        showCart: false,
      },
      (set, get) => ({
        // add: (product: ProductClient, group_product: GroupProductType) => {
        //   const { panier } = get();
        //   const existingItem = panier.find(
        //     (item) => item.group_product.id === group_product.id
        //   );
        //   const price =
        //     (product.price || 0) + (group_product.additional_price || 0);

        //   if (existingItem) {
        //     set({
        //       panier: panier.map((item) =>
        //         item.group_product.id === group_product.id
        //           ? {
        //               ...item,
        //               nbr: item.nbr + 1,
        //               totalPrice: (item.nbr + 1) * price,
        //             }
        //           : item
        //       ),
        //     });
        //   } else {
        //     set({
        //       panier: [
        //         ...panier,
        //         { product, group_product, nbr: 1, totalPrice: price },
        //       ],
        //     });
        //   }
        // },
        
        // subtract: (group_product: GroupProductType, productPrice: number) => {
        //   const { panier } = get();
        //   set({
        //     panier: panier
        //       .map((item) =>
        //         item.group_product.id === group_product.id
        //           ? {
        //               ...item,
        //               nbr: item.nbr - 1,
        //               totalPrice: (item.nbr - 1) * productPrice,
        //             }
        //           : item
        //       )
        //       .filter((item) => item.nbr > 0),
        //   });
        // },

        // remove: (group_product_id: string) => {
        //   set((state) => ({
        //     panier: state.panier.filter(
        //       (item) => item.group_product.id !== group_product_id
        //     ),
        //   }));
        // },

        // clear: () => set({ panier: [] }),

        
        // setPanier: (items: CartItem[]) => {
        //   set({ panier: items });
        // },
        toggleCart: (value : boolean) => {
          set((state) => ({
            showCart: value !== undefined ? value : !state.showCart,
          }));
        },
      })
    ),
    {
      name: "panier",
      storage: createJSONStorage(() => localStorage),
    }
  )
);




export const useOrderInCart = create(
  combine(
    {
      with_delivery: null as boolean | null,
    },
    (set) => ({
      setWithDelivery: (withDelivery: boolean) =>
        set((state) => ({
          with_delivery: withDelivery ?? state.with_delivery,
        })),
    })
  )
);