import { create } from "zustand";
import { combine } from "zustand/middleware";
import { FilterValue } from "../pages/type";

export const useSelectedFiltersStore = create(
  combine(
    {
      selectedFilters: {} as Record<string, FilterValue[]>,
    },
    (set, get) => ({
      setSelectedFilters: (filters: Record<string, FilterValue[]>) =>
        set({ selectedFilters: filters }),
      toggleFilter: (filterId: string, value: FilterValue) => {
        const { selectedFilters } = get();
        const currentValues = selectedFilters[filterId] || [];
        const valueExists = currentValues.some(
          (v) => v.text === value.text && v.key === value.key
        );

        if (valueExists) {
          set({
            selectedFilters: {
              ...selectedFilters,
              [filterId]: currentValues.filter(
                (v) => !(v.text === value.text && v.key === value.key)
              ),
            },
          });
        } else {
          set({
            selectedFilters: {
              ...selectedFilters,
              [filterId]: [...currentValues, value],
            },
          });
        }
      },
      setFilter: (key: string, value: FilterValue[]) =>
        set({ selectedFilters: { ...get().selectedFilters, [key]: value } }),
      clearFilter: () => set({ selectedFilters: {} }),
    })
  )
);


const defaultOptions = ['plus recent', 'moins recent', 'prix eleve', 'prix bas'] as const;
  type OptionType = typeof defaultOptions[number];

  // export const useFilterStore = create(
  //   combine(
  //     {
  //       selectedOption: 'plus recent' as OptionType,
  //     },
  //     (set) => ({
  //       setSelectedOption: (option: OptionType) => set({ selectedOption: option }),
  //       resetFilter: () => set({ selectedOption: 'plus recent' as OptionType }),
  //     })
  //   )
  // );