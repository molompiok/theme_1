import { create } from "zustand";
import { combine, createJSONStorage, persist } from "zustand/middleware";
import { GroupProductType, ProductClient } from "../pages/type";

export interface ProductFeatureType {
  valueFeature: string;
  priceValue: number;
  stock: number;
}
export const useproductFeatures = create(
  combine(
    {
      selections: new Map<string, Map<string, ProductFeatureType>>(), 
      lastSelectedFeatureId: "" as string,
      lastValueId: "" as string,
    },
    (set, get) => ({
      toggleSelection: ({ 
        featureId,
        valueId,
        priceValue,
        stock,
        productId,
      }: {
        featureId: string;
        valueId: string;
        priceValue: number;
        stock: number;
        productId: string;
      }) => {
        set((state) => {
          const newSelections = new Map(state.selections);
          const existingFeatures = newSelections.get(productId)
            ? new Map(newSelections.get(productId))
            : new Map();

          const currentValue = existingFeatures.get(featureId);

          if (currentValue && currentValue.valueFeature === valueId) {
            existingFeatures.delete(featureId);
          } else {
            existingFeatures.set(featureId, { valueFeature: valueId, priceValue, stock });
          }

          newSelections.set(productId, existingFeatures);
          const updatedLastSelectedFeatureId = existingFeatures.has(featureId)
            ? featureId
            : state.lastSelectedFeatureId;
          const updatedLastValueId = existingFeatures.has(featureId)
            ? valueId
            : state.lastValueId;

          return {
            selections: newSelections,
            lastSelectedFeatureId: updatedLastSelectedFeatureId,
            lastValueId: updatedLastValueId,
          };
        });
      },
      hasSelection: (productId: string, featureId: string) => {
        return get().selections.has(productId) && get().selections.get(productId)?.has(featureId);
      },
      getSelection: (productId: string, featureId: string) => {
        return get().selections.get(productId)?.get(featureId);
      },
      clear: () => {
        set(() => {
          return { selections: new Map() };
        });
      },
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
