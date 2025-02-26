import { FeaturesType, ProductType } from "./../S1_data";
import { create } from "zustand";
import { combine, createJSONStorage, persist } from "zustand/middleware";
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
            console.log(newVal);

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
      productSelected: null as ProductType | null,
      features: [] as FeaturesType[],
    },
    (set) => ({
      setFeatureModal: (
        val: boolean,
        product?: ProductType,
        features?: FeaturesType[]
      ) => {
        console.log(';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;');
        
        set(() => {
          return { isVisible: val, productSelected: product, features };
        });
      },
      hideModalFeature: (val: boolean) =>
        set(() => {
          return {
            isVisible: val,
            productSelected: null,
            features: [],
          };
        }),
    })
  )
);
