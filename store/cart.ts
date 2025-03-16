import { create } from "zustand";
import { combine, createJSONStorage, persist } from "zustand/middleware";
import { GroupProductType, ProductClient } from "../pages/type";

// Define the cart item interface for better type safety
interface CartItem {
  product: ProductClient;
  group_product: GroupProductType;
  nbr: number;
  totalPrice: number;
}

// Define the state interface
interface PanierState {
  panier: CartItem[];
  showCart: boolean;
  add: (product: ProductClient, group_product: GroupProductType) => void;
  subtract: (group_product: GroupProductType, productPrice: number) => void;
  remove: (groupId: string) => void;
  clear: () => void;
  toggleCart: (val: boolean) => void;
}

export const usePanier = create<PanierState>()(
  persist(
    combine(
      {
        panier: [] as CartItem[],
        showCart: false,
      },
      (set) => ({
        add: (product: ProductClient, group_product: GroupProductType) =>
          set((state) => {
            const index = state.panier.findIndex(
              (item) => item.group_product.id === group_product.id
            );
            
            const updatedPanier = [...state.panier];
            
            if (index !== -1 && updatedPanier[index].nbr >= group_product.stock) {
              return { panier: updatedPanier };
            }

            const itemPrice = product.price + group_product.additional_price;

            if (index !== -1) {
              const newQuantity = updatedPanier[index].nbr + 1;
              updatedPanier[index] = {
                ...updatedPanier[index],
                nbr: newQuantity,
                totalPrice: newQuantity * itemPrice,
              };
            } else {
              updatedPanier.push({
                product,
                group_product,
                nbr: 1,
                totalPrice: itemPrice,
              });
            }
            
            return { panier: updatedPanier };
          }),

        subtract: (group_product: GroupProductType, productPrice: number) =>
          set((state) => {
            const index = state.panier.findIndex(
              (item) => item.group_product.id === group_product.id
            );

            if (index === -1) return state;

            const updatedPanier = [...state.panier];
            const itemPrice = productPrice + group_product.additional_price;

            if (updatedPanier[index].nbr === 1) {
              return {
                panier: updatedPanier.filter(
                  (item) => item.group_product.id !== group_product.id
                ),
              };
            }

            const newQuantity = updatedPanier[index].nbr - 1;
            updatedPanier[index] = {
              ...updatedPanier[index],
              nbr: newQuantity,
              totalPrice: newQuantity * itemPrice,
            };

            return { panier: updatedPanier };
          }),

        remove: (groupId: string) =>
          set((state) => ({
            panier: state.panier.filter(
              (item) => item.group_product.id !== groupId
            ),
          })),

        clear: () => set({ panier: [] }),

        toggleCart: (val: boolean) => set({ showCart: val }),
      })
    ),
    {
      name: "panier",
      storage: createJSONStorage(() => localStorage),
    }
  )
);