// store/filter.ts
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
        const { selectedFilters } = get(); // Access previous state with get()
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
      clearFilter: () => set({ selectedFilters: {} }),
    })
  )
);
