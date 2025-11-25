import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import clsx from "clsx";
import { Filter, FilterValue, VariantType } from "../../pages/type";
import { ProductMedia } from "../ProductMedia";
import {
  FiCheck,
  FiChevronDown,
  FiList,
  FiGrid,
  FiColumns,
  FiPocket,
  FiMoreHorizontal,
  FiLayout,
  FiLayers,
  FiX,
} from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { CiSliderHorizontal } from "react-icons/ci";
import { get_filters } from "../../api/products.api";
import { usePageContext } from "vike-react/usePageContext";
import { useSelectedFiltersStore } from "../../store/filter";
import Modal from "../modal/Modal";
import { useFiltersAndUrlSync } from "../../hook/useUrlFilterManager";
import { TbTrashX } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import { useThemeSettingsStore } from "../../store/themeSettingsStore";
import PriceRangeFilter from "../PriceRangeFilter";
import { Suspense, lazy } from "react";

type LayoutMode =
  | "row"
  | "grid"
  | "bento"
  | "compact"
  | "horizontal-scroll"
  | "card"
  | "stacked-list"
  | "all";

interface FilterOptionProps {
  filterId: string;
  value: FilterValue;
  isSelected: boolean;
  onToggle: (filterId: string, value: FilterValue) => void;
  setRef: (el: HTMLButtonElement | null) => void;
  layout?: LayoutMode;
}

const getBaseButtonClasses = (layout: LayoutMode = "row") => {
  const base =
    "group transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 active:scale-95";
  switch (layout) {
    case "grid":
      return `${base} p-3 rounded-lg flex flex-col items-center justify-center text-center gap-2`;
    case "bento":
      return `${base} px-3 py-1.5 rounded-full inline-flex items-center gap-2 border`;
    case "compact":
      return `${base} w-full px-2 py-1 rounded-md flex items-center text-left gap-1`;
    case "horizontal-scroll":
      return `${base} px-3 py-1.5 rounded-full inline-flex items-center gap-2 whitespace-nowrap border`;
    case "card":
      return `${base} p-4 rounded-2xl flex flex-col items-start justify-start text-center gap-2 border bg-white shadow-md hover:shadow-lg focus-visible:ring-slate-500 w-full`; // Updated padding, radius, shadow
    case "stacked-list":
      return `${base} w-full px-4 py-3 rounded-lg flex items-center text-left gap-3 hover:bg-gray-50`;
    case "row":
    default:
      return `${base} w-full px-3 py-2 rounded-lg flex items-center text-left gap-2`;
  }
};

const selectedClasses =
  "bg-slate-50 text-slate-900 font-semibold ring-2 ring-inset ring-slate-200";
const unselectedClasses = "text-gray-700 hover:bg-gray-50 hover:text-gray-800";

const bentoSelectedClasses =
  "border-slate-500 bg-slate-100 text-slate-800 font-semibold";
const bentoUnselectedClasses =
  "border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900";

const cardSelectedClasses = "ring-2 ring-slate-500 border-slate-400 shadow-lg";
const cardUnselectedClasses = "border-gray-200 hover:border-gray-300";

const gridItemSelectedClasses =
  "bg-slate-50 border-slate-300 ring-2 ring-slate-200 shadow-sm";
const gridItemUnselectedClasses =
  "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm";

const CheckboxIndicator: React.FC<{
  isSelected: boolean;
  layout?: LayoutMode;
}> = ({ isSelected, layout = "row" }) => {
  if (
    layout === "bento" ||
    layout === "horizontal-scroll" ||
    layout === "card"
  ) {
    return null;
  }

  const checkboxSize =
    layout === "grid" || layout === "compact" ? "size-4" : "size-5";
  const checkIconSize =
    layout === "grid" || layout === "compact" ? "size-3" : "size-3.5";

  return (
    <div
      className={clsx(
        "flex-shrink-0 flex items-center justify-center rounded border-2 transition-all duration-300 group-hover:scale-110",
        isSelected
          ? "bg-slate-600 border-slate-600"
          : "border-gray-300 group-hover:border-gray-400",
        checkboxSize
      )}
    >
      {isSelected && (
        <FiCheck
          className={clsx("text-white", checkIconSize)}
          strokeWidth={3}
        />
      )}
    </div>
  );
};

export const TextFilterOption: React.FC<FilterOptionProps> = ({
  filterId,
  value,
  isSelected,
  onToggle,
  setRef,
  layout = "row",
}) => {
  console.log("🚀 ~ value:", value);
  return (
    <button
      ref={setRef}
      type="button"
      role="checkbox"
      aria-checked={isSelected}
      className={clsx(
        getBaseButtonClasses(layout),
        isSelected
          ? layout === "bento" || layout === "horizontal-scroll"
            ? bentoSelectedClasses
            : layout === "card"
              ? cardSelectedClasses
              : selectedClasses
          : layout === "bento" || layout === "horizontal-scroll"
            ? bentoUnselectedClasses
            : layout === "card"
              ? cardUnselectedClasses
              : unselectedClasses,
        !isSelected && "hover:bg-gray-50"
      )}
      onClick={(e) => {
        e.stopPropagation();
        onToggle(filterId, value);
      }}
    >
      <CheckboxIndicator isSelected={isSelected} layout={layout} />
      <span
        className={clsx(
          "leading-normal lowercase",
          layout === "grid"
            ? "text-xs"
            : layout === "bento" || layout === "horizontal-scroll"
              ? "text-xs font-medium"
              : layout === "compact"
                ? "text-xs"
                : layout === "card"
                  ? "text-sm mt-0.5 font-medium self-center"
                  : "text-sm",
          (layout === "row" ||
            layout === "compact" ||
            layout === "stacked-list") &&
          "flex-grow",
          isSelected
            ? "text-slate-900"
            : "text-gray-700 group-hover:text-gray-800" // Fallback text colors
        )}
      // style={{ color: filterSideTextColor }} // This will override Tailwind color if filterSideTextColor is set
      >
        {value.text}
      </span>
      {typeof value.product_count === "number" && (
        <span className="ml-auto text-xs font-mono text-gray-400 group-hover:text-gray-500 pl-2">
          ({value.product_count})
        </span>
      )}
    </button>
  );
};

export const ColorFilterOption: React.FC<FilterOptionProps> = ({
  filterId,
  value,
  isSelected,
  onToggle,
  setRef,
  layout = "row",
}) => {
  const getColorSwatchSize = () => {
    switch (layout) {
      case "grid":
        return "size-8";
      case "bento":
        return "size-4";
      case "compact":
        return "size-3.5";
      case "horizontal-scroll":
        return "size-4";
      case "card":
        return "size-12 self-center";
      case "stacked-list":
        return "size-5";
      case "row":
      default:
        return "size-5";
    }
  };
  return (
    <button
      ref={setRef}
      type="button"
      role="checkbox"
      aria-checked={isSelected}
      className={clsx(
        getBaseButtonClasses(layout),
        isSelected
          ? layout === "bento" || layout === "horizontal-scroll"
            ? bentoSelectedClasses
            : layout === "card"
              ? cardSelectedClasses
              : selectedClasses
          : layout === "bento" || layout === "horizontal-scroll"
            ? bentoUnselectedClasses
            : layout === "card"
              ? cardUnselectedClasses
              : unselectedClasses,
        !isSelected && "hover:bg-gray-50"
      )}
      onClick={(e) => {
        e.stopPropagation();
        onToggle(filterId, value);
      }}
    >
      <div
        className={clsx(
          "rounded-full border border-gray-300 group-hover:border-gray-400 transition-all duration-300 flex items-center justify-center",
          "group-hover:scale-105",
          getColorSwatchSize(),
          isSelected &&
          layout !== "card" &&
          "ring-2 ring-offset-1 ring-slate-200"
        )}
        style={{ backgroundColor: value.key || "transparent" }}
      >
        {isSelected && value.key?.toLowerCase() === "#ffffff" && (
          <FiCheck className="size-3 text-gray-700" strokeWidth={3} />
        )}
        {isSelected &&
          value.key?.toLowerCase() !== "#ffffff" &&
          !value.key?.toLowerCase().includes("rgba(255,255,255") && (
            <FiCheck
              className="size-3 text-white mix-blend-difference"
              strokeWidth={3}
            />
          )}
      </div>
      {layout === "grid" || layout === "card" ? (
        <>
          <span
            className={clsx(
              "lowercase text-center leading-normal",
              layout === "grid" ? "text-xs mt-1" : "text-sm mt-1.5 font-medium",
              isSelected
                ? "text-slate-900"
                : "text-gray-700 group-hover:text-gray-800"
            )}
          >
            {value.text}
          </span>
          {typeof value.product_count === "number" && (
            <span className="ml-auto text-xs font-mono text-gray-400 group-hover:text-gray-500 pl-2">
              ({value.product_count})
            </span>
          )}
        </>
      ) : (
        <>
          <span
            className={clsx(
              "lowercase leading-normal",
              layout === "bento" || layout === "horizontal-scroll"
                ? "text-xs font-medium"
                : layout === "compact"
                  ? "text-xs"
                  : "text-sm",
              (layout === "row" ||
                layout === "compact" ||
                layout === "stacked-list") &&
              "flex-grow",
              isSelected
                ? "text-slate-900"
                : "text-gray-700 group-hover:text-gray-800"
            )}
          >
            {value.text}
          </span>
          {typeof value.product_count === "number" && (
            <span className="ml-auto text-xs font-mono text-gray-400 group-hover:text-gray-500 pl-2">
              ({value.product_count})
            </span>
          )}
        </>
      )}
    </button>
  );
};

export const IconFilterOption: React.FC<FilterOptionProps> = ({
  filterId,
  value,
  isSelected,
  onToggle,
  setRef,
  layout = "row",
}) => {
  const getIconContainerSize = () => {
    switch (layout) {
      case "grid":
        return "size-12 sm:size-14";
      case "bento":
        return "size-6";
      case "compact":
        return "size-5";
      case "horizontal-scroll":
        return "size-6";
      case "card":
        return "size-16 sm:size-20 self-center";
      case "stacked-list":
        return "size-9";
      case "row":
      default:
        return "size-9";
    }
  };

  const iconButtonClasses = () => {
    if (layout === "grid") {
      return clsx(
        getBaseButtonClasses(layout),
        "w-full aspect-square p-1.5 sm:p-2",
        isSelected ? gridItemSelectedClasses : gridItemUnselectedClasses
      );
    }
    if (layout === "card") {
      return clsx(
        getBaseButtonClasses(layout),
        isSelected ? cardSelectedClasses : cardUnselectedClasses
      );
    }
    return clsx(
      getBaseButtonClasses(layout),
      isSelected
        ? layout === "bento" || layout === "horizontal-scroll"
          ? bentoSelectedClasses
          : selectedClasses
        : layout === "bento" || layout === "horizontal-scroll"
          ? bentoUnselectedClasses
          : unselectedClasses,
      !isSelected && "hover:bg-gray-50"
    );
  };
  return (
    <button
      ref={setRef}
      type="button"
      role="checkbox"
      aria-checked={isSelected}
      className={iconButtonClasses()}
      onClick={(e) => {
        e.stopPropagation();
        onToggle(filterId, value);
      }}
    >
      <div
        className={clsx(
          "flex items-center justify-center rounded-md overflow-hidden transition-all duration-300",
          getIconContainerSize(),
          "group-hover:scale-105",
          isSelected && layout !== "grid" && layout !== "card"
            ? "ring-1 ring-offset-1 ring-slate-200"
            : ""
        )}
      >
        {Array.isArray(value.icon) && value.icon.length > 0 ? (
          <ProductMedia
            mediaList={value.icon}
            productName={value.text}
            className="size-full object-cover"
          />
        ) : (
          <svg
            className={clsx(
              "text-gray-400 group-hover:text-gray-500",
              layout === "grid"
                ? "size-7"
                : layout === "bento" || layout === "horizontal-scroll"
                  ? "w-3.5 h-3.5"
                  : layout === "compact"
                    ? "w-3.5 h-3.5"
                    : layout === "card"
                      ? "size-10"
                      : "size-7"
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        )}
      </div>
      <span
        className={clsx(
          "lowercase leading-normal",
          layout === "grid" || layout === "card"
            ? "text-xs text-center mt-1.5"
            : layout === "bento" ||
              layout === "horizontal-scroll" ||
              layout === "compact"
              ? "text-xs font-medium"
              : "text-sm",

          isSelected
            ? layout === "grid" || layout === "card"
              ? "text-slate-700 font-semibold"
              : "text-slate-900 font-medium"
            : layout === "grid" || layout === "card"
              ? "text-gray-600"
              : "text-gray-700 group-hover:text-gray-800",

          (layout === "row" ||
            layout === "compact" ||
            layout === "stacked-list") &&
          "flex-grow"
        )}
      >
        {value.text}
      </span>
      {typeof value.product_count === "number" && (
        <span className="ml-auto text-xs font-mono text-gray-400 group-hover:text-gray-500 pl-2">
          ({value.product_count})
        </span>
      )}
    </button>
  );
};

export const IconTextFilterOption: React.FC<FilterOptionProps> = ({
  filterId,
  value,
  isSelected,
  onToggle,
  setRef,
  layout = "row",
}) => {
  const getIconDisplaySize = () => {
    switch (layout) {
      case "grid":
        return "size-8";
      case "bento":
        return "w-3.5 h-3.5";
      case "compact":
        return "size-4";
      case "horizontal-scroll":
        return "w-3.5 h-3.5";
      case "card":
        return "size-10 self-center mb-1.5";
      case "stacked-list":
        return "size-5";
      case "row":
      default:
        return "size-5";
    }
  };

  const placeholderSvgSize = () => {
    switch (layout) {
      case "grid":
        return "size-5";
      case "bento":
        return "size-2.5";
      case "compact":
        return "size-3";
      case "horizontal-scroll":
        return "size-2.5";
      case "card":
        return "size-6";
      default:
        return "size-3.5";
    }
  };
  return (
    <button
      ref={setRef}
      type="button"
      role="checkbox"
      aria-checked={isSelected}
      className={clsx(
        getBaseButtonClasses(layout),
        isSelected
          ? layout === "bento" || layout === "horizontal-scroll"
            ? bentoSelectedClasses
            : layout === "card"
              ? cardSelectedClasses
              : selectedClasses
          : layout === "bento" || layout === "horizontal-scroll"
            ? bentoUnselectedClasses
            : layout === "card"
              ? cardUnselectedClasses
              : unselectedClasses,
        !isSelected && "hover:bg-gray-50"
      )}
      onClick={(e) => {
        e.stopPropagation();
        onToggle(filterId, value);
      }}
    >
      <CheckboxIndicator isSelected={isSelected} layout={layout} />
      {Array.isArray(value.icon) && value.icon.length > 0 ? (
        <ProductMedia
          mediaList={value.icon}
          productName={value.text}
          className={clsx(
            getIconDisplaySize(),
            layout === "card" ? "rounded-md" : "rounded-sm",
            "object-contain"
          )}
        />
      ) : (
        <div
          className={clsx(
            getIconDisplaySize(),
            "bg-gray-100 flex items-center justify-center",
            layout === "card" ? "rounded-md" : "rounded-sm"
          )}
        >
          <svg
            className={clsx("text-gray-400", placeholderSvgSize())}
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
        </div>
      )}

      <span
        className={clsx(
          "lowercase leading-normal",
          layout === "grid"
            ? "text-xs text-center"
            : layout === "bento" || layout === "horizontal-scroll"
              ? "text-xs font-medium"
              : layout === "compact"
                ? "text-xs"
                : layout === "card"
                  ? "text-sm text-center font-medium"
                  : "text-sm",
          (layout === "row" ||
            layout === "compact" ||
            layout === "stacked-list" ||
            layout === "grid") &&
          "flex-grow",
          layout === "card" && "self-center w-full",
          isSelected
            ? "text-slate-900"
            : "text-gray-700 group-hover:text-gray-800"
        )}
      >
        {value.text}
      </span>
      {typeof value.product_count === "number" && (
        <span className="ml-auto text-xs font-mono text-gray-400 group-hover:text-gray-500 pl-2">
          ({value.product_count})
        </span>
      )}
    </button>
  );
};

// Hook pour charger GSAP dynamiquement
const useGSAP = () => {
  const [gsap, setGsap] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!gsap && typeof window !== "undefined") {
      setIsLoading(true);
      import("gsap").then((module) => {
        setGsap(module.default);
        setIsLoading(false);
      });
    }
  }, [gsap]);

  return { gsap, isLoading };
};

export default function FilterPanel() {
  const [modalFilter, setModalFilter] = useState(false);
  const pageContext = usePageContext();
  const categorySlug = pageContext.routeParams?.slug;
  const { api } = pageContext;
  const filterPanelRef = useRef<HTMLDivElement>(null);
  const { gsap, isLoading: gsapLoading } = useGSAP();

  const {
    data: filters,
    isLoading,
    isError,
  } = useQuery<Filter[] | undefined>({
    queryKey: ["get_filters", { slug: categorySlug }],
    queryFn: () => get_filters({ slug: categorySlug }, api),
  });

  const handleModalClose = () => {
    if (!gsap || !filterPanelRef.current) {
      setModalFilter(false);
      document.body.style.overflow = "auto";
      return;
    }
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
    if (gsap && filterPanelRef.current) {
      gsap.fromTo(
        filterPanelRef.current,
        { x: "100%" },
        { x: 0, duration: 0.1, ease: "power2.out" }
      );
    }
  };

  if (isLoading)
    return (
      <div className="text-gray-600 text-center py-4 h-[70dvh]">
        Chargement...
      </div>
    );
  if (!filters || isError || !Array.isArray(filters)) return null;

  return (
    <div className="inline max-h-[70dvh]">
      <div className="bg-transparent w-full">
        <button
          className="w-full lg:hidden ml-auto px-3 py-2 flex items-center justify-center gap-2 border rounded-lg hover:bg-gray-100 hover:shadow-sm text-gray-800 border-gray-200 cursor-pointer transition-all duration-300 active:scale-95" // Unified border, text color, duration
          onClick={handleModalOpen}
          aria-haspopup="true"
          aria-expanded={modalFilter}
          aria-controls="filter-modal-content"
        >
          <CiSliderHorizontal size={22} />
          <h2 className="text-sm font-medium leading-normal">Filtres</h2>
        </button>
        <div className="hidden lg:block bg-transparent rounded-xl shadow-sm max-w-xs w-full">
          <FilterModal
            filters={filters}
            onModalClose={handleModalClose}
            isMobile={false}
          />
        </div>
      </div>

      <Modal
        styleContainer="flex items-center justify-end size-full"
        zIndex={100}
        setHide={handleModalClose}
        animationName="translateRight"
        isOpen={modalFilter}
      >
        <div
          ref={filterPanelRef}
          id="filter-modal-content"
          className="font-primary bg-white h-dvh w-full max-w-[90vw] sm:max-w-[380px] shadow-2xl flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-labelledby="filter-modal-title"
        >
          <FilterModal
            filters={filters}
            onModalClose={handleModalClose}
            isMobile={true}
          />
        </div>
      </Modal>
    </div>
  );
}

function LayoutSelector({
  currentLayout,
  filtideLayout,
  onLayoutChange,
}: {
  currentLayout: LayoutMode;
  filtideLayout: LayoutMode;
  onLayoutChange: (layout: LayoutMode) => void;
}) {
  const layouts: { key: LayoutMode; icon: React.ElementType; label: string }[] =
    [
      { key: "row", icon: FiList, label: "Liste" },
      { key: "grid", icon: FiGrid, label: "Grille" },
      { key: "bento", icon: FiColumns, label: "Pilules" },
      { key: "compact", icon: FiPocket, label: "Compact" },
      {
        key: "horizontal-scroll",
        icon: FiMoreHorizontal,
        label: "Défilement Horizontal",
      },
      { key: "card", icon: FiLayout, label: "Cartes" },
      { key: "stacked-list", icon: FiLayers, label: "Liste Détaillée" },
    ];

  return (
    <div
      className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200"
      style={{ display: filtideLayout === "all" ? "flex" : "none" }}
    >
      {layouts.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          onClick={() => onLayoutChange(key)}
          className={clsx(
            "p-2 rounded-md transition-all duration-300 active:scale-95",
            currentLayout === key
              ? "bg-slate-100 text-slate-700 border border-slate-200 shadow-sm"
              : "text-gray-500 hover:text-gray-700 hover:bg-white"
          )}
          title={label}
          aria-label={`Layout ${label}`}
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  );
}

function FilterModal({
  filters,
  onModalClose,
  isMobile,
}: {
  filters: Filter[];
  onModalClose: () => void;
  isMobile: boolean;
}) {
  const pageContext = usePageContext();
  const { urlPathname } = pageContext;
  const { setSelectedFilters, selectedFilters, clearFilter, toggleFilter } =
    useSelectedFiltersStore();
  const { gsap } = useGSAP();

  const filtideLayoutSetting =
    useThemeSettingsStore(
      (state) => state.filterSideLayout as LayoutMode | undefined
    ) ?? "row";
  const filterSideBackgroundColor = useThemeSettingsStore(
    (state) => state.filterSideBackgroundColor
  );
  const filterSideTextColor = useThemeSettingsStore(
    (state) => state.filterSideTextColor
  );
  const [filterSideLayout, setFilterSideLayout] =
    useState<LayoutMode>(filtideLayoutSetting);

  useEffect(() => {
    setFilterSideLayout(filtideLayoutSetting);
  }, [filtideLayoutSetting]);

  useFiltersAndUrlSync(
    filters,
    urlPathname,
    setSelectedFilters,
    selectedFilters
  );

  const filterOptionRefs = useRef<Map<string, HTMLElement>>(new Map());

  const activeFilters = useMemo(
    () =>
      Object.entries(selectedFilters).flatMap(([filterId, values]) =>
        values.map((value) => ({ filterId, value }))
      ),
    [selectedFilters]
  );

  const setFilterOptionRef = useCallback(
    (filterId: string, valueText: string) => (el: HTMLElement | null) => {
      const key = `${filterId}-${valueText}`;
      if (el) filterOptionRefs.current.set(key, el);
      else filterOptionRefs.current.delete(key);
    },
    []
  );

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    () => {
      const initialState: Record<string, boolean> = {};
      filters.forEach((filter) => {
        initialState[filter.id] = true; // Default to open
      });
      return initialState;
    }
  );

  const toggleCategory = (filterId: string) => {
    setOpenCategories((prev) => ({ ...prev, [filterId]: !prev[filterId] }));
  };

  const getLayoutClasses = (
    filterType: VariantType | undefined,
    layout: LayoutMode
  ) => {
    const baseGap = "gap-2";

    switch (layout) {
      case "grid":
        return `${baseGap} grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5`;
      case "bento":
        return `flex flex-wrap ${baseGap}`;
      case "compact":
        return `flex flex-col gap-1`;
      case "horizontal-scroll":
        return `flex overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 whitespace-nowrap ${baseGap} items-stretch scroll-smooth px-4`;
      case "card":
        return `grid grid-cols-2 ${baseGap}`;
      case "stacked-list":
        return `flex flex-col gap-1`;
      case "row":
      default:
        return `flex flex-col ${baseGap}`;
    }
  };

  const RenderFilterOption = ({
    filter,
    value,
  }: {
    filter: Filter;
    value: FilterValue;
  }) => {
    const isSelected =
      selectedFilters[filter.id]?.some((v) => v.text === value.text) ?? false;
    const filterType = filter.type || VariantType.TEXT;

    const refCallback = setFilterOptionRef(filter.id, value.text) as (
      el: HTMLButtonElement | null
    ) => void;

    const optionProps = {
      filterId: filter.id,
      value,
      isSelected,
      onToggle: toggleFilter,
      setRef: refCallback,
      layout: filterSideLayout,
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
    const activeTags = Array.from(
      document.querySelectorAll(".active-filter-tag")
    );
    if (gsap) {
      gsap.to([e.currentTarget, ...activeTags], {
        opacity: 0,
        x: -10,
        stagger: 0.03,
        duration: 0.25,
        ease: "circ.in",
        onComplete: clearFilter,
      });
    } else {
      clearFilter();
    }
  };

  const handleRemoveActiveFilter = (
    e: React.MouseEvent<HTMLButtonElement>,
    filterId: string,
    value: FilterValue
  ) => {
    e.stopPropagation();
    const element = e.currentTarget.closest(".active-filter-tag");
    if (element && gsap) {
      gsap.to(element, {
        opacity: 0,
        scale: 0.7,
        duration: 0.25,
        ease: "circ.in",
        onComplete: () => toggleFilter(filterId, value),
      });
    } else {
      toggleFilter(filterId, value);
    }
  };

  return (
    <>
      {isMobile && (
        <header
          // 7. Responsive et mobile / Modal mobile / Header mobile
          // 4. Optimisation des couleurs et contrastes / Bordures
          className="flex items-center justify-between p-5 border-b border-gray-200 sticky top-0 z-10" // p-4 -> p-5, unified border
          style={{
            backgroundColor: filterSideBackgroundColor || "white", // Fallback
            color: filterSideTextColor || "#374151", // text-gray-700 fallback
          }}
        >
          {/* 9. Typographie / Line heights */}
          <h2
            id="filter-modal-title"
            className="text-lg font-semibold leading-normal"
          >
            Filtres
          </h2>
          <div className="flex items-center gap-3">
            <LayoutSelector
              filtideLayout={filtideLayoutSetting}
              currentLayout={filterSideLayout}
              onLayoutChange={setFilterSideLayout}
            />
            <button
              onClick={onModalClose}
              className="text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100 active:scale-95"
              aria-label="Fermer le panneau des filtres"
            >
              <IoClose size={28} />
            </button>
          </div>
        </header>
      )}
      {!isMobile && (
        <div
          className="flex items-center justify-between px-5 pt-6 pb-3 border-b border-gray-200"
          style={{
            backgroundColor: filterSideBackgroundColor || "white",
            color: filterSideTextColor || "#1f2937",
          }}
        >
          <div className="text-lg font-bold text-slate-800 leading-normal">
            FILTRES
          </div>
          <LayoutSelector
            filtideLayout={filtideLayoutSetting}
            currentLayout={filterSideLayout}
            onLayoutChange={setFilterSideLayout}
          />
        </div>
      )}

      <div
        className="flex-grow overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 bg-gray-50 text-gray-800"
        style={{
          backgroundColor: filterSideBackgroundColor,
          color: filterSideTextColor,
        }}
      >
        <div className="p-4 space-y-4">
          <PriceRangeFilter
            title="Fourchette de prix"
            minPlaceholder="0"
            maxPlaceholder="Aucune limite"
            currencySymbol="CFA"
          />
          {activeFilters.filter(
            ({ filterId }) =>
              filterId !== "order_by" &&
              filterId !== "max_price" &&
              filterId !== "min_price" &&
              filterId !== "s"
          ).length > 0 && (
              <div className="p-4 border-b border-gray-200 bg-slate-50 border-l-4 border-l-slate-400 rounded-r-md">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-semibold text-slate-700 leading-normal">
                    Filtres Actifs
                  </h3>

                  <button
                    onClick={handleClearFilters}
                    className="text-sm font-medium transition duration-300 ease-out flex items-center gap-1 group px-3 py-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 active:scale-95"
                  >
                    <TbTrashX
                      size={20}
                      className="transition-transform group-hover:scale-110"
                    />
                    Tout effacer
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {activeFilters
                    .filter(
                      ({ filterId }) =>
                        filterId !== "order_by" &&
                        filterId !== "max_price" &&
                        filterId !== "min_price" &&
                        filterId !== "s"
                    )
                    .map(({ filterId, value }) => (
                      <div
                        key={`${filterId}-${value.text}`}
                        className="active-filter-tag flex items-center gap-1.5 bg-slate-100 text-slate-800 text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm"
                      >
                        <span className="lowercase leading-normal">
                          {value.text}
                        </span>
                        <button
                          onClick={(e) =>
                            handleRemoveActiveFilter(e, filterId, value)
                          }
                          className="text-slate-400 hover:text-slate-600 transition-colors group p-1 rounded-full hover:bg-slate-200"
                          aria-label={`Supprimer le filtre ${value.text}`}
                        >
                          <FiX size={16} strokeWidth={2.5} />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

          <div className="space-y-1">
            {filters
              .filter((filter) => filter.values && filter.values.length > 0)
              .map((filter) => (
                <div
                  key={filter.id}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  <button
                    onClick={() => toggleCategory(filter.id)}
                    className="w-full flex justify-between items-center py-4 px-1 text-left hover:bg-gray-100 rounded-md transition-colors duration-300 active:scale-95"
                    aria-expanded={openCategories[filter.id] ?? true}
                    aria-controls={`filter-options-${filter.id}`}
                  >
                    <h3
                      className="font-bold text-xs text-slate-600 leading-normal"
                      style={{ color: filterSideTextColor }}
                    >
                      {filter.name}

                      <span
                        className="font-normal ml-2 text-gray-400"
                        style={{
                          color: filterSideTextColor
                            ? filterSideTextColor + "99"
                            : undefined,
                        }}
                      >
                        ({filter.values.length})
                      </span>
                    </h3>
                    <FiChevronDown
                      className={clsx(
                        "transform transition-transform duration-300 ease-out text-gray-500",
                        openCategories[filter.id] ?? true
                          ? "rotate-180"
                          : "rotate-0"
                      )}
                      size={20}
                    />
                  </button>
                  <div
                    id={`filter-options-${filter.id}`}
                    className={clsx(
                      "transition-all duration-500 ease-in-out overflow-hidden",
                      openCategories[filter.id] ?? true
                        ? "max-h-[1500px] opacity-100 pb-3 pt-1"
                        : "max-h-0 opacity-0"
                    )}
                    style={{ backgroundColor: filterSideBackgroundColor }}
                  >
                    <div
                      className={getLayoutClasses(
                        filter.type,
                        filterSideLayout
                      )}
                      style={{
                        backgroundColor: filterSideBackgroundColor,
                        color: filterSideTextColor,
                      }}
                    >
                      {filter.values.map((value, i) => (
                        <RenderFilterOption
                          key={`${filter.id}-${value.text}-${i}`}
                          filter={filter}
                          value={value}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
