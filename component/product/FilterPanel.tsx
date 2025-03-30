import { useQuery } from "@tanstack/react-query";
import { CiSliderHorizontal } from "react-icons/ci";
import { IoIosArrowRoundForward } from "react-icons/io";
import { get_filters } from "../../api/products.api";
import { usePageContext } from "../../renderer/usePageContext";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Filter, FilterValue, VariantType } from "../../pages/type";
import { useSelectedFiltersStore } from "../../store/filter";
import Modal from "../modal/Modal";
import gsap from "gsap";
import clsx from "clsx";
import { ColorFilterOption, IconFilterOption, IconTextFilterOption, TextFilterOption } from "./FilterOptions";


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
  if (!filters || isError || !Array.isArray(filters)) return null;

  return (
    <div className="inline max-h-[70dvh]">
      <div className="bg-white w-full ">
        <div
          className="w-fit ml-auto px-2 py-1 lg:mx-0 flex items-center justify-center gap-2 border rounded-sm hover:bg-gray-100 hover:shadow-2xs border-gray-500 cursor-pointer lg:hidden"
          onClick={handleModalOpen}
        >
          <h2 className="text-sm text-gray-900">Filtres</h2>
          <CiSliderHorizontal size={20} />
        </div>
        <div className="hidden border-r border-gray-200 inset-shadow-green-800 shadow-md lg:block">
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
              onMouseEnter={(e) => gsap.to(e.currentTarget, { x: 5, duration: 0.2 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { x: 0, duration: 0.2 })}
              className="cursor-pointer text-black z-50"
              onClick={handleModalClose}
              aria-label="Fermer le panneau des filtres"
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
  const filterOptionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const { filterIdToName, filterNameToId } = useMemo(() => {
    const idToName: Record<string, string> = {};
    const nameToId: Record<string, string> = {};
    filters.forEach((filter) => {
      const lowerCaseName = filter.name.toLowerCase();
      idToName[filter.id] = lowerCaseName;
      nameToId[lowerCaseName] = filter.id;
    });
    return { filterIdToName: idToName, filterNameToId: nameToId };
  }, [filters]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const currentSearchParams = new URLSearchParams(window.location.search);
    const urlFilters: Record<string, FilterValue[]> = {};

    currentSearchParams.forEach((value, name) => {
      const filterId = filterNameToId[name.toLowerCase()];
      if (filterId) {
        const filterValue = filters
          .find((f) => f.id === filterId)
          ?.values.find((v) => v.text === value);
        if (filterValue) {
          urlFilters[filterId] = urlFilters[filterId] || [];
          if (!urlFilters[filterId].some((v) => v.text === value)) {
            urlFilters[filterId].push(filterValue);
          }
        }
      }
    });

    if (JSON.stringify(urlFilters) !== JSON.stringify(selectedFilters)) {
      setSelectedFilters(urlFilters);
    }
  }, [filters, urlPathname, setSelectedFilters, filterNameToId]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const newSearchParams = new URLSearchParams();
    Object.entries(selectedFilters).forEach(([filterId, values]) => {
      if (values.length > 0) {
        const filterName = filterIdToName[filterId];
        if (filterName) {
          values.forEach((value) => newSearchParams.append(filterName, value.text));
        }
      }
    });

    const queryString = newSearchParams.toString();
    const newUrl = queryString ? `${urlPathname}?${queryString}` : urlPathname;
    if (window.location.search.substring(1) !== queryString) {
      window.history.replaceState(null, "", newUrl);
    }

    filterOptionRefs.current.forEach((ref, key) => {
      const [filterId, valueText] = key.split("-");
      const isSelected = selectedFilters[filterId]?.some((v) => v.text === valueText);
      gsap.to(ref, {
        scale: isSelected ? 1.05 : 1,
        duration: 0.2,
        ease: "power1.out",
      });
    });
  }, [selectedFilters, urlPathname, filterIdToName, filters]);

  const activeFilters = useMemo(() =>
    Object.entries(selectedFilters).flatMap(([filterId, values]) =>
      values.map((value) => ({ filterId, value }))
    ), [selectedFilters]);

  const setFilterOptionRef = useCallback(
    (filterId: string, valueText: string) => (el: HTMLDivElement | null) => {
      const key = `${filterId}-${valueText}`;
      if (el) filterOptionRefs.current.set(key, el);
      else filterOptionRefs.current.delete(key);
    },
    []
  );

  const RenderFilterOption = ({ filter, value }: { filter: Filter; value: FilterValue }) => {
    const isSelected = selectedFilters[filter.id]?.some((v) => v.text === value.text) ?? false;
    const filterType = filter.type || VariantType.TEXT;
    const refCallback = setFilterOptionRef(filter.id, value.text);

    const optionProps = {
      filterId: filter.id,
      value,
      isSelected,
      onToggle: toggleFilter,
      setRef: refCallback,
    };

    switch (filterType) {
      case VariantType.COLOR:
        return <ColorFilterOption {...optionProps} />;
      case VariantType.ICON:
        return <IconFilterOption {...optionProps} />;
      case VariantType.ICON_TEXT:
        return <IconTextFilterOption {...optionProps} />;
      case VariantType.TEXT:
      default:
        return <TextFilterOption {...optionProps} />;
    }
  };

  const handleClearFilters = (e: React.MouseEvent<HTMLButtonElement>) => {
    const activeTags = Array.from(document.querySelectorAll(".active-filter-tag"));
    gsap.to([e.currentTarget, ...activeTags], {
      opacity: 0,
      x: -20,
      stagger: 0.05,
      duration: 0.3,
      onComplete: clearFilter,
    });
  };

  const handleRemoveActiveFilter = (
    e: React.MouseEvent<HTMLButtonElement>,
    filterId: string,
    value: FilterValue
  ) => {
    e.stopPropagation();
    const element = e.currentTarget.closest(".active-filter-tag");
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
    <div className="lg:mb-1 lg:pt-9 ">
      <div className="text-xl uppercase text-gray-900 pl-5 py-3">Filtres</div>
      <div className="p-4 mt-0 max-h-[85dvh] overflow-y-auto  scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 space-y-6">
        {activeFilters.length > 0 && (
          <div className="border-b border-gray-200 pb-4">
            <button
              onClick={handleClearFilters}
              className="text-sm text-gray-600 mb-3 hover:text-black underline underline-offset-2 transition duration-200"
            >
              Réinitialiser tous les filtres
            </button>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map(({ filterId, value }) => (
                <div
                  key={`${filterId}-${value.text}`}
                  className="active-filter-tag flex items-center gap-1.5 border border-gray-300 bg-gray-50 hover:border-gray-400 text-black text-sm px-2.5 py-1 rounded-full"
                >
                  <span className="capitalize">{value.text}</span>
                  <button
                    onClick={(e) => handleRemoveActiveFilter(e, filterId, value)}
                    className="text-gray-500 hover:text-black transition-colors duration-200 group"
                    aria-label={`Supprimer le filtre ${value.text}`}
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

        <div className="pr-1 space-y-6 divide-y divide-gray-200 ">
          {filters.map((filter) => (
            <div key={filter.id} className="py-4 space-y-3 last:py-8">
              <h3 className="font-semibold text-gray-800 uppercase tracking-wide text-sm">
                {filter.name}
                <span className="text-xs font-normal text-gray-500 ml-1">
                  ({filter.values.length})
                </span>
              </h3>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {filter.values.map((value, i) => (
                  <RenderFilterOption key={`${filter.id}-${value.text}-${i}`} filter={filter} value={value} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}