import { useMemo, useEffect } from "react";
import { Filter, FilterValue } from "../pages/type";
import { useSelectedFiltersStore } from "../store/filter";

const SPECIAL_PARAMS = {
  order_by: { isValueBased: true },
  s: { isValueBased: true },
  min_price: { isValueBased: true },
  max_price: { isValueBased: true },
};
export const useFiltersAndUrlSync = (
  filters: Filter[], 
  urlPathname: string,
  setSelectedFilters: (filters: Record<string, FilterValue[]>) => void,
  selectedFilters: Record<string, FilterValue[]>,
) => {
 

  const filterIdToName = useMemo(() => {
    const idToName: Record<string, string> = {};
    filters.forEach((filter) => {
      idToName[filter.id] = filter.name.toLowerCase();
    });
    return idToName;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const currentSearchParams = new URLSearchParams(window.location.search);
    const urlFilters: Record<string, FilterValue[]> = {};

    currentSearchParams.forEach((value, name) => {
      const isSpecialParam = Object.keys(SPECIAL_PARAMS as typeof SPECIAL_PARAMS).includes(name);    
      let filterId: string | undefined;

      if (isSpecialParam && SPECIAL_PARAMS[name as keyof typeof SPECIAL_PARAMS].isValueBased) { 
        filterId = name; 
      } else {
        filterId = Object.keys(filterIdToName).find(
          (key) => filterIdToName[key] === name
        );
      }

      if (filterId) {
        let filterValue: FilterValue | undefined;
        if (isSpecialParam && SPECIAL_PARAMS[filterId as keyof typeof SPECIAL_PARAMS].isValueBased) { 
          filterValue = { text: value, icon: [], key: null };
        } else {
          filterValue = filters
            .find((f) => f.id === filterId)
            ?.values.find((v) => v.text === value);
        }

        if (filterValue || (isSpecialParam && !SPECIAL_PARAMS[filterId as keyof typeof SPECIAL_PARAMS].isValueBased)) { 
          urlFilters[filterId] = urlFilters[filterId] || [];
          const newValue = filterValue || { text: value, icon: [], key: null };
          if (!urlFilters[filterId].some((v) => v.text === value)) {
            urlFilters[filterId].push(newValue);
          }
        }
      }
    });
    if (JSON.stringify(urlFilters) !== JSON.stringify(selectedFilters)) {
      setSelectedFilters(urlFilters);
    }
  }, [urlPathname, setSelectedFilters,filterIdToName]);
// }, [urlPathname, setSelectedFilters, filterIdToName]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const newSearchParams = new URLSearchParams();

    Object.entries(selectedFilters).forEach(([filterId, values]) => {
     
      const isSpecialParam = Object.keys(SPECIAL_PARAMS as typeof SPECIAL_PARAMS).includes(filterId);
      const filterName = isSpecialParam
        ? filterId 
        : filterIdToName[filterId as keyof typeof filterIdToName];

      if (values.length > 0 && filterName) {
        values.forEach((value) => {
          const key = (isSpecialParam && SPECIAL_PARAMS[filterId as keyof typeof SPECIAL_PARAMS].isValueBased) ? filterName : filterName;
          newSearchParams.append(key, value.text);
        });
      }
    });

    const queryString = newSearchParams.toString();
    const newUrl = queryString ? `${urlPathname}?${queryString}` : urlPathname;
    if (window.location.search.substring(1) !== queryString) {
      window.history.replaceState(null, "", newUrl);
    }
  }, [selectedFilters, urlPathname, filterIdToName]);

  return { filterIdToName };
};