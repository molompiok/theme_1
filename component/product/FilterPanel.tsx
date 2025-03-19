import { useQuery } from "@tanstack/react-query";
import { CiSliderHorizontal } from "react-icons/ci";
import { get_filters } from "../../api/products.api";
import { usePageContext } from "../../renderer/usePageContext";
import { useEffect, useState } from "react";
import { FeaturType, Filter } from "../../pages/type";
import clsx from "clsx";
import { useSelectedFiltersStore } from "../../store/filter";

type SelectedFilters = Record<string, string[]>;

export default function FilterPanel() {
  const pageContext = usePageContext();
  const categorySlug = pageContext.routeParams?.slug;
  const { urlPathname } = pageContext;
  const {
    data: filters,
    isLoading,
    isError,
  } = useQuery<Filter[]>({
    queryKey: ["get_filters", { slug: categorySlug ? categorySlug : undefined }],
    queryFn: () =>
      get_filters({ slug: categorySlug ? categorySlug : undefined }),
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {selectedFilters , setSelectedFilters ,clearFilter , toggleFilter} = useSelectedFiltersStore()

  const filterIdToName = filters?.reduce((acc, filter) => {
    acc[filter.id] = filter.name.toLowerCase();
    return acc;
  }, {} as Record<string, string>) || {};

  const filterNameToId = filters?.reduce((acc, filter) => {
    acc[filter.name.toLowerCase()] = filter.id;
    return acc;
  }, {} as Record<string, string>) || {};

  useEffect(() => {
    if (!filters) return;

    const currentSearchParams = new URLSearchParams(window.location.search);
    const urlFilters: SelectedFilters = {};

    currentSearchParams.forEach((value, name) => {
      const filterId = filterNameToId[name];
      if (filterId) {
        urlFilters[filterId] = urlFilters[filterId] || [];
        if (!urlFilters[filterId].includes(value)) {
          urlFilters[filterId].push(value);
        }
      }
    });

    const urlFiltersString = JSON.stringify(urlFilters);
    const selectedFiltersString = JSON.stringify(selectedFilters);

    if (urlFiltersString !== selectedFiltersString) {
      setSelectedFilters(urlFilters);
    }
  }, [filters, urlPathname]);

  useEffect(() => {
    if (!filters) return;

    const newSearchParams = new URLSearchParams();
    Object.entries(selectedFilters).forEach(([filterId, values]) => {
      const filterName = filterIdToName[filterId];
      if (filterName && values.length > 0) {
        values.forEach((value) => {
          newSearchParams.append(filterName, value);
        });
      }
    });

    const queryString = newSearchParams.toString();
    const newUrl = queryString ? `${urlPathname}?${queryString}` : urlPathname;

    if (
      window.location.search !== `?${queryString}` &&
      window.location.search !== queryString
    ) {
      window.history.replaceState(null, "", newUrl);
    }
  }, [selectedFilters, filters, urlPathname]);


  const activeFilters = Object.entries(selectedFilters).flatMap(
    ([filterId, values]) => values.map((value) => ({ filterId, value }))
  );

  const renderFilterOption = (filter: Filter, value: string) => {
    const isSelected = (selectedFilters[filter.id] || []).includes(value);
    const filterType = filter.type || FeaturType.TEXT;

    const baseClass = `flex items-center gap-1 cursor-pointer group transition-all duration-200 ${
      isSelected ? "text-black font-semibold" : "text-gray-600"
    }`;

    switch (filterType) {
      case FeaturType.COLOR:
        return (
          <div
            key={value}
            className={baseClass}
            onClick={(e) => {
              e.stopPropagation();
              
              toggleFilter(filter.id, value);
            }}
          >
            <div
              className={`size-7 rounded-md border transition-all duration-200 ${
                isSelected
                  ? "border-black scale-110"
                  : "border-gray-300 group-hover:border-gray-500"
              }`}
              style={{ backgroundColor: value }}
            />
            <span className="text-sm capitalize">{value}</span>
          </div>
        );

      case FeaturType.ICON:
        return (
          <div
            key={value}
            className={baseClass}
            onClick={(e) => {
              e.stopPropagation();
              
              toggleFilter(filter.id, value);
            }}
          >
            <div
              className={`size-5 flex items-center justify-center rounded border-2 transition-all duration-200 ${
                isSelected
                  ? "border-black bg-black"
                  : "border-gray-300 group-hover:border-gray-500"
              }`}
            >
              {isSelected && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span className="text-sm">{value}</span>
          </div>
        );

      case FeaturType.ICON_TEXT:
        return (
          <div
            key={value}
            className={baseClass}
            onClick={(e) => {
              e.stopPropagation();
              
              toggleFilter(filter.id, value);
            }}
          >
            <div
              className={`size-5 flex items-center justify-center rounded-full border-2 transition-all duration-200 ${
                isSelected
                  ? "border-black bg-black"
                  : "border-gray-300 group-hover:border-gray-500"
              }`}
            >
              {isSelected ? (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-3 h-3 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v8m-4-4h8"
                  />
                </svg>
              )}
            </div>
            <span className="text-sm">{value}</span>
          </div>
        );

      case FeaturType.TEXT:
      default:
        return (
          <div
            key={value}
            className={baseClass}
            onClick={(e) => {
              e.stopPropagation();
              
              toggleFilter(filter.id, value);
            }}
          >
            <div
              className={`group size-5 flex items-center justify-center rounded-xl border-2 transition-all duration-500 ${
                isSelected
                  ? "border-black bg-black"
                  : "border-gray-300 group-hover:bg-black/50 group-hover:border-gray-500"
              }`}
            >
              <svg
                className={clsx(
                  "w-3 h-3 transition-all duration-300 text-white",
                  {
                    "inline": isSelected,
                    "hidden group-hover:inline group-hover:opacity-45": !isSelected,
                  }
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span className="text-sm">{value}</span>
          </div>
        );
    }
  };

  if (isLoading)
    return <div className="text-gray-500 text-center py-4">Chargement...</div>;
  if (isError || !filters)
    return <div className="text-red-500 text-center py-4">Erreur</div>;
  if (!Array.isArray(filters)) {
    
    return <div className="text-red-500 text-center py-4">Données invalides</div>;
  }

  

  return (
    <div className="bg-white rounded-lg w-full max-w-xs md:max-w-sm">
      <div
        className={clsx(
          "p-4 border-b duration-300 overflow-auto ease-in-out transform border-gray-200",
          {
            "max-h-[100px] scale-y-100": activeFilters.length > 0,
            "max-h-0 scale-y-0": activeFilters.length === 0,
          }
        )}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            
            clearFilter();
          }}
          className="text-sm text-gray-700 mb-2 hover:text-black underline transition-colors"
        >
          Réinitialiser tous les filtres
        </button>
        <div className="flex flex-wrap gap-2 mb-2">
          {activeFilters.map(({ filterId, value }) => (
            <div
              key={`${filterId}-${value}`}
              className="flex items-center gap-1 border border-gray-300 hover:border-gray-500 transition-all duration-300 text-black text-sm px-2 py-1 rounded-full"
            >
              <span>{value}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  
                  toggleFilter(filterId, value);
                }}
                className="text-black transition-colors"
                aria-label={`Supprimer ${value}`}
              >
                <svg
                  className="size-4 bg-gray-300 rounded-2xl px-0.5"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div
        className="flex items-center justify-between p-2 border-b border-gray-200 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <h2 className="text-lg font-semibold text-black">Filtres</h2>
        <button
          className="lg:hidden p-1 text-black hover:bg-gray-100 rounded-full transition-transform duration-300"
          style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
          aria-label={isOpen ? "Fermer les filtres" : "Ouvrir les filtres"}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          <CiSliderHorizontal size={20} />
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        } lg:max-h-[1000px] lg:opacity-100`}
      >
        <div className="p-4 space-y-6">
          {filters.map((filter) => (
            <div key={filter.id} className="space-y-2">
              <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide flex items-center gap-2">
                {filter.name}
                <span className="text-xs text-gray-500">
                  ({filter.values.length})
                </span>
              </h3>
              <div className="flex gap-4 items-center">
                {filter.values.map((value) => renderFilterOption(filter, value))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}