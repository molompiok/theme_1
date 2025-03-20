import { create } from "zustand";
import { combine } from "zustand/middleware";

type SelectedFilters = Record<string, string[]>;

export const useSelectedFiltersStore = create(
  combine(
    {
      selectedFilters: {} as SelectedFilters,
    },
    (set, get) => ({
      setSelectedFilters: (filters: SelectedFilters) =>
        set({ selectedFilters: filters }),
      toggleFilter: (filterId: string, value: string) => {
        const { selectedFilters } = get();
        const currentValues = [...(selectedFilters[filterId] || [])];

        if (currentValues.includes(value)) {
          set({
            selectedFilters: {
              ...selectedFilters,
              [filterId]: currentValues.filter((v) => v !== value),
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
      setFilter: (key : string, value : [string]) => {
        const currentFilters = get().selectedFilters;
        set({
          selectedFilters: {
            ...currentFilters,
            [key]: value,
          },
        });
      },
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