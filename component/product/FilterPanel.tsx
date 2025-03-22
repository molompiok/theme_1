import { useQuery } from "@tanstack/react-query";
import { CiSliderHorizontal } from "react-icons/ci";
import { get_filters } from "../../api/products.api";
import { usePageContext } from "../../renderer/usePageContext";
import { useEffect, useState, useRef } from "react";
import { FeaturType, Filter, filterOptions } from "../../pages/type";
import { useSelectedFiltersStore } from "../../store/filter";
import Modal from "../modal/Modal";
import { IoIosArrowRoundForward } from "react-icons/io";
import gsap from "gsap";

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

function FilterModal({ filters }: { filters: Filter[] }) {
  const pageContext = usePageContext();
  const { urlPathname } = pageContext;
  const { selectedFilters, setSelectedFilters, clearFilter, toggleFilter } =
    useSelectedFiltersStore();
  const filterRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const filterIdToName = [...filters, ...filterOptions].reduce(
    (acc, filter) => {
      acc[filter.id] = filter.name.toLowerCase();
      return acc;
    },
    {} as Record<string, string>
  );

  const filterNameToId = [...filters, ...filterOptions].reduce(
    (acc, filter) => {
      acc[filter.name.toLowerCase()] = filter.id;
      return acc;
    },
    {} as Record<string, string>
  );

  useEffect(() => {
    if (!filters) return;
    const currentSearchParams = new URLSearchParams(window.location.search);
    const urlFilters: SelectedFilters = {};
    currentSearchParams.forEach((value, name) => {
      let filterId =
        name === "order_by"
          ? filterIdToName[filterNameToId[value]]
          : filterNameToId[name];
      if (filterId) {
        filterId = name === "order_by" ? "order_by" : filterId;
        urlFilters[filterId] = urlFilters[filterId] || [];
        if (!urlFilters[filterId].includes(value))
          urlFilters[filterId].push(value);
      }
    });
    if (JSON.stringify(urlFilters) !== JSON.stringify(selectedFilters)) {
      setSelectedFilters(urlFilters);
    }
  }, [filters, urlPathname]);

  useEffect(() => {
    if (!filters) return;
    const newSearchParams = new URLSearchParams();
    Object.entries(selectedFilters).forEach(([filterId, values]) => {
      const filterName =
        filterIdToName[
          filterId === "order_by" ? filterNameToId[values[0]] : filterId
        ];
      if (filterName && values.length > 0) {
        values.forEach((value) =>
          newSearchParams.append(
            filterId === "order_by" ? filterId : filterName,
            value
          )
        );
      }
    });

    const queryString = newSearchParams.toString();
    const newUrl = queryString ? `${urlPathname}?${queryString}` : urlPathname;
    if (window.location.search !== `?${queryString}`) {
      window.history.replaceState(null, "", newUrl);
    }
    filterRefs.current.forEach((ref, key) => {
      const isSelected = selectedFilters[key.split("-")[0]]?.includes(
        key.split("-")[1]
      );
      gsap.to(ref, {
        scale: isSelected ? 1.05 : 1,
        duration: 0.2,
        ease: "power1.out",
      });
    });
  }, [selectedFilters, filters, urlPathname]);

  const activeFilters = Object.entries(selectedFilters).flatMap(
    ([filterId, values]) => values.map((value) => ({ filterId, value }))
  );

  const renderFilterOption = (filter: Filter, value: string) => {
    const isSelected = (selectedFilters[filter.id] || []).includes(value);
    const filterType = filter.type || FeaturType.TEXT;
    const refKey = `${filter.id}-${value}`;

    const baseClass = `flex items-center gap-2  cursor-pointer group transition-all duration-200 ${
      isSelected ? "text-black font-bold" : "text-gray-900"
    }`;

    return (
      <div
        ref={(el) => {
          if (el) filterRefs.current.set(refKey, el);
          else filterRefs.current.delete(refKey);
        }}
        key={value}
        className={baseClass}
        onClick={() => toggleFilter(filter.id, value)}
        onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -2, duration: 0.2 })}
        onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0, duration: 0.2 })}
      >
        {filterType === FeaturType.COLOR ? (
          <div
            className={`size-7 rounded-md border ${
              isSelected
                ? "border-black scale-110"
                : "border-gray-300 group-hover:border-gray-500"
            }`}
            style={{ backgroundColor: value }}
          />
        ) : (
          <div
            className={`size-6 flex items-center justify-center rounded border-2 ${
              isSelected
                ? "border-black bg-black"
                : "border-gray-300 group-hover:border-gray-500"
            }`}
          >
            {isSelected && (
              <svg
                className="size-full text-white"
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
        )}
        <span className="text-sm">{value}</span>
      </div>
    );
  };

  return (
    <div className="p-4 mt-0 lg:mt-14 space-y-6">
      <div className="text-xl uppercase text-gray-900">Filtres</div>
      {activeFilters.filter((aF) => aF.filterId !== "order_by").length > 0 && (
        <div className="border-b border-gray-200 pb-3">
          <button
            onClick={(e) => {
              clearFilter();
              gsap.to([e.currentTarget, ".active-filter-tag"], {
                opacity: 0,
                x: -20,
                stagger: 0.05,
                duration: 0.2, 
             
              });
            }}
            className="text-gray-700 mb-2 hover:text-black underline underline-offset-2 transition duration-200"
          >
            Réinitialiser tous les filtres
          </button>

          <div className="flex flex-wrap gap-2">
            {activeFilters
              .filter((aF) => aF.filterId !== "order_by")
              .map(({ filterId, value }) => {
                if (filterId === "order_by") return null;
                return (
                  <div
                    key={`${filterId}-${value}`}
                    className="active-filter-tag flex items-center gap-1 border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-200 text-black text-sm px-2 py-1 rounded-full"
                  >
                    <span>{value}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const element = e.currentTarget.parentElement;
                        gsap.to(element, {
                          opacity: 0,
                          x: -15,
                          duration: 0.35, 
                          onComplete: () => toggleFilter(filterId, value),
                        });
                      }}
                      className="text-gray-500 hover:text-black transition-colors duration-200"
                      aria-label={`Supprimer ${value}`}
                    >
                      <svg
                        className="size-3.5 bg-gray-200 rounded-full"
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
                );
              })}
          </div>
        </div>
      )}

      <div className="pr-4 space-y-6 divide-y divide-gray-200 overflow-y-auto max-h-[calc(100vh-150px)]">
        {filters.map((filter) => (
          <div key={filter.id} className="space-y-2 pb-5">
            <h3 className="font-semibold text-gray-800 uppercase tracking-wide">
              {filter.name}
              <span className="text-xs font-normal text-gray-500">
                ({filter.values.length})
              </span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {filter.values.map((value) => renderFilterOption(filter, value))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
