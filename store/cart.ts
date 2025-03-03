import { create } from "zustand";
import { combine, createJSONStorage, persist } from "zustand/middleware";
import { ProductClient } from "../pages/type";
export const usePanier = create(
  persist(
    combine(
      {
        panier: [] as {
          product: ProductClient;
          nbr: number;
          totalPrice: number;
        }[],
        showCart: false as boolean,
      },
      (set) => ({
        add: (product: ProductClient , stock: number) =>
          set((state) => {
            const index = state.panier.findIndex(
              (item) => item.product.id === product.id
            );
            const updatedPanier = [...state.panier];
            if (updatedPanier[index]?.nbr >= stock) {
              return { panier: updatedPanier };
            }
            if (index !== -1) {
              updatedPanier[index] = {
                ...updatedPanier[index],
                nbr: updatedPanier[index].nbr + 1,
                totalPrice: (updatedPanier[index].nbr + 1) * product.price,
              };
              return { panier: updatedPanier };
            } else {
              return {
                panier: [
                  ...state.panier,
                  { product, nbr: 1, totalPrice: product.price },
                ],
              };
            }
          }),
        substrat: (productId: string, price: number) =>
          set((state) => {
            const index = state.panier.findIndex(
              (item) => item.product.id === productId
            );
            if (index !== -1) {
              const updatedPanier = [...state.panier];
              if (updatedPanier[index].nbr === 1) {
                return {
                  panier: updatedPanier.filter(
                    (item) => item.product.id !== productId
                  ),
                };
              }
              updatedPanier[index] = {
                ...updatedPanier[index],
                nbr: updatedPanier[index].nbr - 1,
                totalPrice: (updatedPanier[index].nbr - 1) * price,
              };
              return { panier: updatedPanier };
            } else {
              return state;
            }
          }),
        remove: (productId: string) =>
          set((state) => ({
            panier: state.panier.filter(
              (item) => item.product.id !== productId
            ),
          })),
        clear: () => set({ panier: [] }),
        toggleCart: (val: boolean) =>
          set(() => {
            return { showCart: val };
          }),
      })
    ),
    {
      name: "panier",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
