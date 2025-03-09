import { create } from "zustand";
import { combine, createJSONStorage, persist } from "zustand/middleware";
import { ProductClient } from "../pages/type";
export const useproductFeatures = create(
  combine(
    {
      productFeatures: new Map() as Map<string, Map<string, string>>,
      lastType: "" as string,
    },
    (set) => ({
      add: (id: string, typeFeature: string, valueFeature: string) => {
        set((state) => {
          const newState = state.productFeatures;

          if (!newState.has(id)) {
            const val = new Map().set(typeFeature, valueFeature);
            return {
              ...state,
              productFeatures: new Map(newState.set(id, new Map(val))),
            };
          } else {
            let oldState = newState.get(id);

            const val = oldState?.set(typeFeature, valueFeature)!;

            const newVal = newState.set(id, val);

            return {
              ...state,
              productFeatures: new Map(newVal),
              lastType: typeFeature,
            };
          }
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
      // features: [] as FeaturesType[],
    },
    (set) => ({
      setFeatureModal: (
        val: boolean,
        product?: ProductClient,
        // features?: FeaturesType[]
      ) => {
        set(() => {
          return { isVisible: val, productSelected: product };
        });
      },
      hideModalFeature: (val: boolean) =>
        set(() => {
          return {
            isVisible: val,
            productSelected: null,
            // features: [],
          };
        }),
    })
  )
);
