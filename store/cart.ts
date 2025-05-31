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