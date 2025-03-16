import { create } from "zustand";
import { combine, createJSONStorage, persist } from "zustand/middleware";
import { GroupProductType, ProductClient } from "../pages/type";

export interface FeatureValueType {
  valueFeature: string;
  priceValue: number;
  stock: number;
}
export const useproductFeatures = create(
  combine(
    {
      productFeatures: new Map<string, Map<string, FeatureValueType>>(),
      selectedFeatures: new Map<string, string>(), // Ex. { "couleur": "yellow", "ram": "16" }
      groupProducts: new Map<string, GroupProductType[]>(), // Groupes par ID
      lastGroupProductId: "" as string,
    },
    (set) => ({
      add: (
        id: string,
        typeFeature: string,
        valueFeature: string,
        priceValue: number,
        stock: number,
        groups: GroupProductType[]
      ) => {
        set((state) => {
          const newProductFeatures = new Map(state.productFeatures);
          const newGroupProducts = new Map(state.groupProducts);
          const newSelectedFeatures = new Map(state.selectedFeatures);

          const featureMap = new Map(newProductFeatures.get(id) || []);
          featureMap.set(typeFeature, { valueFeature, priceValue, stock });
          newProductFeatures.set(id, featureMap);

          newGroupProducts.set(id, groups);

          newSelectedFeatures.set(typeFeature, valueFeature);

          const matchingGroup = groups.find((gp) =>
            Array.from(newSelectedFeatures.entries()).every(
              ([key, val]) => !gp.bind[key] || gp.bind[key] === val
            )
          );

          return {
            productFeatures: newProductFeatures,
            groupProducts: newGroupProducts,
            selectedFeatures: newSelectedFeatures,
            lastGroupProductId: matchingGroup?.id || id,
          };
        });
      },
      remove: (typeFeature: string) => {
        set((state) => {
          const newSelectedFeatures = new Map(state.selectedFeatures);
          const newProductFeatures = new Map(state.productFeatures);
          const currentId = state.lastGroupProductId;

          newSelectedFeatures.delete(typeFeature);

          if (newProductFeatures.has(currentId)) {
            const featureMap = new Map(newProductFeatures.get(currentId)!);
            featureMap.delete(typeFeature);
            if (featureMap.size === 0) {
              newProductFeatures.delete(currentId);
            } else {
              newProductFeatures.set(currentId, featureMap);
            }
          }

          const groups = state.groupProducts.get(currentId) || [];
          const matchingGroup = groups.find((gp) =>
            Array.from(newSelectedFeatures.entries()).every(
              ([key, val]) => !gp.bind[key] || gp.bind[key] === val
            )
          );

          return {
            productFeatures: newProductFeatures,
            selectedFeatures: newSelectedFeatures,
            lastGroupProductId: matchingGroup?.id || (newSelectedFeatures.size > 0 ? currentId : ""),
          };
        });
      },
      clearSelections: () => set({ selectedFeatures: new Map(), lastGroupProductId: "" , groupProducts: new Map() ,productFeatures: new Map() }),
    })
  )
);

export const useProductSelectFeature = create(
  combine(
    {
      isVisible: false as boolean,
      productSelected: null as ProductClient | null,
    },
    (set) => ({
      setFeatureModal: (val: boolean, product?: ProductClient) => {
        set(() => {
          return { isVisible: val, productSelected: product };
        });
      },
      hideModalFeature: (val: boolean) =>
        set(() => {
          return {
            isVisible: val,
            productSelected: null,
          };
        }),
    })
  )
);
