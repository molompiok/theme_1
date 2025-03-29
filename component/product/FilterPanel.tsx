import { useQuery } from "@tanstack/react-query";
import { CiSliderHorizontal } from "react-icons/ci";
import { get_filters } from "../../api/products.api";
import { usePageContext } from "../../renderer/usePageContext";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import {  Filter, filterOptions, VariantType } from "../../pages/type";
import { useSelectedFiltersStore } from "../../store/filter";
import Modal from "../modal/Modal";
import { IoIosArrowRoundForward } from "react-icons/io";
import gsap from "gsap";
import clsx from "clsx";

type SelectedFilters = Record<string, string[]>;

export default function FilterPanel() {
  const [modalFilter, setModalFilter] = useState(false);
  const pageContext = usePageContext();
  const categorySlug = pageContext.routeParams?.slug;
  const filterPanelRef = useRef<HTMLDivElement>(null);

  const {
    data: filters,
    isLoading,
    isError,
  } = useQuery<Filter[]>({
    queryKey: ["get_filters", { slug: categorySlug }],
    queryFn: () => get_filters({ slug: categorySlug }),
  });

  const handleModalClose = () => {
    gsap.to(filterPanelRef.current, {
      x: "100%",
      duration: 0.1,
      ease: "power2.in",
      onComplete: () => {
        setModalFilter(false);
        document.body.style.overflow = "auto";
      },
    });
  };

  const handleModalOpen = () => {
    setModalFilter(true);
    document.body.style.overflow = "hidden";
    gsap.fromTo(
      filterPanelRef.current,
      { x: "100%" },
      { x: 0, duration: 0.1, ease: "power2.out" }
    );
  };

  if (isLoading)
    return <div className="text-gray-500 text-center py-4">Chargement...</div>;
  if (!filters || isError) return null;
  if (!Array.isArray(filters)) return null;

  return (
    <div className="inline">
      <div className="bg-white w-full p-0 lg:p-0">
        <div
          className="w-fit ml-auto px-2 py-1 lg:mx-0 flex items-center justify-center gap-2 border rounded-sm hover:bg-gray-100 hover:shadow-2xs border-gray-500 cursor-pointer lg:hidden"
          onClick={handleModalOpen}
        >
          <h2 className="text-sm text-gray-900">Filtres</h2>
          <CiSliderHorizontal size={20} />
        </div>
        <div className="hidden border-r min-h-dvh border-gray-200 inset-shadow-green-800 shadow-md lg:block">
          <FilterModal filters={filters} />
        </div>
      </div>

      <Modal
        styleContainer="flex items-center justify-end size-full"
        zIndex={100}
        setHide={handleModalClose}
        isOpen={modalFilter}
        animationName="translateRight"
      >
        <div
          ref={filterPanelRef}
          className="font-primary relative bg-white h-dvh w-full max-w-[90vw] sm:max-w-[400px] pt-12 overflow-y-auto"
        >
          <div className="absolute group top-2 left-2">
            <IoIosArrowRoundForward
              size={40}
              onMouseEnter={(e) =>
                gsap.to(e.currentTarget, { x: 5, duration: 0.2 })
              }
              onMouseLeave={(e) =>
                gsap.to(e.currentTarget, { x: 0, duration: 0.2 })
              }
              className="cursor-pointer text-black z-50"
              onClick={handleModalClose}
              aria-label="Fermer le panier"
            />
          </div>
          <FilterModal filters={filters} />
        </div>
      </Modal>
    </div>
  );
}

function deepEqual(obj1: any, obj2: any): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}


interface FilterOptionProps {
  filterId: string;
  value: string;
  isSelected: boolean;
  onToggle: (filterId: string, value: string) => void;
  setRef: (el: HTMLDivElement | null) => void;
}

const TextFilterOption: React.FC<FilterOptionProps> = ({ filterId, value, isSelected, onToggle, setRef }) => (
  <div
    ref={setRef}
    key={value}
    className={clsx(
      "flex items-center gap-2 cursor-pointer group transition-all duration-200",
      isSelected ? "text-black font-bold" : "text-gray-900"
    )}
    onClick={(e) => {
      e.stopPropagation();
      onToggle(filterId, value);
    }}
  >
    <div
      className={clsx(
        "group size-5 flex items-center justify-center rounded-xl border-2 transition-all duration-500",
        isSelected
          ? "border-black bg-black"
          : "border-gray-300 group-hover:bg-black/50 group-hover:border-gray-500"
      )}
    >
      <svg
        className={clsx(
          "w-3 h-3 transition-all duration-300 text-white",
          isSelected ? "inline" : "hidden group-hover:inline group-hover:opacity-45"
        )}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <span className="text-sm capitalize">{value}</span> 
  </div>
);

const ColorFilterOption: React.FC<FilterOptionProps> = ({ filterId, value, isSelected, onToggle, setRef }) => (
  <div
    ref={setRef}
    key={value}
    className={clsx(
      "flex items-center gap-2 cursor-pointer group transition-all duration-200",
      isSelected ? "text-black font-bold" : "text-gray-900"
    )}
    onClick={(e) => {
      e.stopPropagation();
      onToggle(filterId, value);
    }}
  >
    <div
      className={clsx(
        "size-7 rounded-md border transition-all duration-200",
        isSelected
          ? "border-black scale-110"
          : "border-gray-300 group-hover:border-gray-500"
      )}
      style={{ backgroundColor: value }}
    />
    <span className="text-sm capitalize">{value}</span>
  </div>
);

const IconFilterOption: React.FC<FilterOptionProps> = ({ filterId, value, isSelected, onToggle, setRef }) => (
    <div
        ref={setRef}
        key={value}
        className={clsx(
            "flex items-center gap-2 cursor-pointer group transition-all duration-200",
            isSelected ? "text-black font-bold" : "text-gray-900"
        )}
        onClick={(e) => {
            e.stopPropagation();
            onToggle(filterId, value);
        }}
    >
        <div
            className={clsx(
                "size-5 flex items-center justify-center rounded border-2 transition-all duration-200",
                isSelected
                    ? "border-black bg-black"
                    : "border-gray-300 group-hover:border-gray-500"
            )}
        >
            {isSelected && (
                <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
            )}
        </div>
        <span className="text-sm capitalize">{value}</span>
    </div>
);


const IconTextFilterOption: React.FC<FilterOptionProps> = ({ filterId, value, isSelected, onToggle, setRef }) => (
    <div
        ref={setRef}
        key={value}
        className={clsx(
            "flex items-center gap-2 cursor-pointer group transition-all duration-200",
            isSelected ? "text-black font-bold" : "text-gray-900"
        )}
        onClick={(e) => {
            e.stopPropagation();
            onToggle(filterId, value);
        }}
    >
        <div
            className={clsx(
                "size-5 flex items-center justify-center rounded-full border-2 transition-all duration-200", 
                isSelected
                    ? "border-black bg-black"
                    : "border-gray-300 group-hover:border-gray-500"
            )}
        >
             <svg
                  className={clsx("w-3 h-3", isSelected ? "text-white" : "text-gray-500 group-hover:text-gray-700")}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={isSelected ? "M5 13l4 4L19 7" : "M12 8v8m-4-4h8"}
                  />
                </svg>
        </div>
        <span className="text-sm capitalize">{value}</span>
    </div>
);


function FilterModal({ filters }: { filters: Filter[] }) {
  const pageContext = usePageContext();
  const { urlPathname } = pageContext;

  const { selectedFilters, setSelectedFilters, clearFilter, toggleFilter } =
    useSelectedFiltersStore();

  const filterOptionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const { filterIdToName, filterNameToId } = useMemo(() => {
    const idToName: Record<string, string> = {};
    const nameToId: Record<string, string> = {};
    [...filters, ...filterOptions].forEach((filter) => {
      const lowerCaseName = filter.name.toLowerCase();
      idToName[filter.id] = lowerCaseName;
      nameToId[lowerCaseName] = filter.id;
    });
    return { filterIdToName: idToName, filterNameToId: nameToId };
  }, [filters]); 

  useEffect(() => {
    if (!filters || typeof window === "undefined") return; 

    const currentSearchParams = new URLSearchParams(window.location.search);
    const urlFilters: SelectedFilters = {};

    currentSearchParams.forEach((value, name) => {
      let filterId: string | undefined;
      if (name === "order_by") {
          const sortFilterId = Object.keys(filterIdToName).find(id => filterIdToName[id] === value.toLowerCase());
          if (sortFilterId) {
              filterId = "order_by"; 
          }
      } else {
          filterId = filterNameToId[name.toLowerCase()];
      }
      if (filterId) {
        urlFilters[filterId] = urlFilters[filterId] || [];
        if (!urlFilters[filterId].includes(value)) {
          urlFilters[filterId].push(value);
        }
      }
    });
    if (!deepEqual(urlFilters, selectedFilters)) {
      setSelectedFilters(urlFilters);
    }
  }, [filters, urlPathname, setSelectedFilters, filterIdToName, filterNameToId]);

  useEffect(() => {
    if (!filters || typeof window === "undefined") return; 

    const newSearchParams = new URLSearchParams();

    Object.entries(selectedFilters).forEach(([filterId, values]) => {
      if (values.length > 0) {
        if (filterId === "order_by") {
          values.forEach((value) => {
             newSearchParams.append("order_by", value);
          });
        } else {
          const filterName = filterIdToName[filterId];
          if (filterName) {
            values.forEach((value) => {
              newSearchParams.append(filterName, value);
            });
          }
        }
      }
    });

    const queryString = newSearchParams.toString();
    const newUrl = queryString ? `${urlPathname}?${queryString}` : urlPathname;
    const currentQueryString = window.location.search.substring(1); 

    if (queryString !== currentQueryString) {
      window.history.replaceState(null, "", newUrl);
    }

    filterOptionRefs.current.forEach((ref, key) => {
        const [refFilterId, refValue] = key.split('-');
        const isSelected = selectedFilters[refFilterId]?.includes(refValue);
      gsap.to(ref, {
        scale: isSelected ? 1.05 : 1,
        duration: 0.2,
        ease: "power1.out",
      });
    });
  }, [selectedFilters, urlPathname, filterIdToName, filters]);

  const activeFilters = useMemo(() => {
    return Object.entries(selectedFilters).flatMap(([filterId, values]) =>
      values.map((value) => ({ filterId, value }))
    );
  }, [selectedFilters]);

  const setFilterOptionRef = useCallback((filterId: string, value: string) => (el: HTMLDivElement | null) => {
    const key = `${filterId}-${value}`;
    if (el) {
      filterOptionRefs.current.set(key, el);
    } else {
      filterOptionRefs.current.delete(key);
    }
  }, []);

  const RenderFilterOption = ({ filter, value }: { filter: Filter; value: string }) => {
    const isSelected = selectedFilters[filter.id]?.includes(value) ?? false;
    const filterType = filter.type || VariantType.TEXT; 
    const refCallback = setFilterOptionRef(filter.id, value);

    const optionProps: Omit<FilterOptionProps, 'setRef'> = { 
        filterId: filter.id,
        value,
        isSelected,
        onToggle: toggleFilter, 
    };

    switch (filterType) {
      case VariantType.COLOR:
        return <ColorFilterOption {...optionProps} setRef={refCallback} />;
      case VariantType.ICON:
        return <IconFilterOption {...optionProps} setRef={refCallback} />;
      case VariantType.ICON_TEXT:
        return <IconTextFilterOption {...optionProps} setRef={refCallback} />;
      case VariantType.TEXT:
      default:
        return <TextFilterOption {...optionProps} setRef={refCallback} />;
    }
  };


  const handleClearFilters = (e: React.MouseEvent<HTMLButtonElement>) => {
     const activeTags = Array.from(document.querySelectorAll(".active-filter-tag"));
    gsap.to([e.currentTarget, ...activeTags], {
      opacity: 0,
      x: -20,
      stagger: 0.05,
      duration: 0.3,
      onComplete: () => {
        clearFilter(); 
      },
    });
  };

  const handleRemoveActiveFilter = (e: React.MouseEvent<HTMLButtonElement>, filterId: string, value: string) => {
     e.stopPropagation();
     const element = e.currentTarget.closest('.active-filter-tag'); 
     if (element) {
         gsap.to(element, {
             opacity: 0,
             scale: 0.8,
             x: -15,
             duration: 0.3,
             onComplete: () => toggleFilter(filterId, value), 
         });
     } else {
         toggleFilter(filterId, value);
     }
  };


  return (
    <div className="p-4 mt-0 lg:mt-14 space-y-6">
      <div className="text-xl uppercase text-gray-900">Filtres</div>

      {activeFilters.filter((aF) => aF.filterId !== "order_by").length > 0 && (
        <div className="border-b border-gray-200 pb-4"> 
          <button
            onClick={handleClearFilters}
            className="text-sm text-gray-600 mb-3 hover:text-black underline underline-offset-2 transition duration-200" 
          >
            Réinitialiser tous les filtres
          </button>

          <div className="flex flex-wrap gap-2">
            {activeFilters
              .filter((aF) => aF.filterId !== "order_by") 
              .map(({ filterId, value }) => (
                <div
                  key={`${filterId}-${value}`}
                  className="active-filter-tag flex items-center gap-1.5 border border-gray-300 bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-200 text-black text-sm px-2.5 py-1 rounded-full" // Added background, adjusted padding/gap
                >
                  <span className="capitalize">{value}</span>
                  <button
                    onClick={(e) => handleRemoveActiveFilter(e, filterId, value)}
                    className="text-gray-500 hover:text-black transition-colors duration-200 group" 
                    aria-label={`Supprimer le filtre ${value}`}
                  >
                    <svg
                      className="size-5 p-0.5 bg-gray-200 group-hover:bg-gray-300 rounded-full transition-colors" 
                      fill="none" 
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
      )}

      <div className="pr-1 mr-[-4px] space-y-6 divide-y divide-gray-200 overflow-y-auto max-h-[calc(100vh-200px)] scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400"> 
        {filters.map((filter) => (
          <div key={filter.id} className="pt-4 space-y-3 first:pt-0"> 
            {filter.id !== 'order_by' && (
                <>
                <h3 className="font-semibold text-gray-800 uppercase tracking-wide text-sm"> 
                {filter.name}
                <span className="text-xs font-normal text-gray-500 ml-1">
                    ({filter.values.length})
                </span>
                </h3>
                <div className="flex flex-wrap gap-x-4 gap-y-2"> 
                {filter.values.map((value ,i) => {
                    return <RenderFilterOption key={`${filter.id}-${value}-${i}`} filter={filter} value={value} />;
                })}
                </div>
                </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}