import React, { useEffect, useMemo, useRef, useState } from "react";
import { BsSearch, BsX, BsHeartFill } from "react-icons/bs";
import {
  HydrationBoundary,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import {
  get_favorites,
  get_features_with_values,
} from "../../../api/products.api";
import {
  ProductClient,
  ProductFavorite,
  OrderByType,
  filterOptions,
  defaultOptions,
} from "../../type";
import { DisplayPrice } from "../../../component/DisplayPrice";
import { ProductMedia } from "../../../component/ProductMedia";
import FavoriteButton from "../../../component/FavoriteButton";
import { formatSlug } from "../../../utils";
import { useSelectedFiltersStore } from "../../../store/filter";
import { useFiltersAndUrlSync } from "../../../hook/useUrlFilterManager";
import FilterPopover from "../../../component/FilterPopover";
import { useThemeSettingsStore } from "../../../store/themeSettingsStore";
import clsx from "clsx";
import ProductSearchCard from "../../../component/product/ProductSearchCard";
import { usePageContext } from "vike-react/usePageContext";

const GRID_CLASSES =
  "grid grid-cols-1 gap-4 min-[280px]:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6";

// interface Data { dehydratedState?: unknown; } // Optionnel

export default function Page() {
  // const { dehydratedState } = useData<Data>(); // Optionnel
  const pageContext = usePageContext();
  const { urlPathname } = pageContext;
  const { setSelectedFilters, selectedFilters, setFilter } =
    useSelectedFiltersStore();

  useFiltersAndUrlSync([], urlPathname, setSelectedFilters, selectedFilters);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // Le seuil de 50px est celui que vous aviez. Le top-0/mt-7 vs top-11/mt-0 se déclenchera après 50px.
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div // Header sticky externe
        className={clsx(
          "sticky inset-x-0 z-40 transition-all duration-300 backdrop-blur-xl", // z-40 de votre original, backdrop-blur du design recherche
          isScrolled
            ? "bg-white/80 border-b border-slate-200 shadow-lg mt-0 top-11 sm:top-[3.75rem]" // top-15 (15 * 0.25rem = 3.75rem)
            : "bg-white/0 border-b border-transparent shadow-sm top-0 mt-7"
        )}
      >
        <div // Conteneur interne max-width avec padding vertical de la recherche et padding horizontal dynamique
          className={clsx(
            "font-primary mx-auto max-w-[1440px] transition-all duration-300 pt-6 pb-1",
            isScrolled
              ? "px-4" // 1rem de padding horizontal quand scrollé
              : "px-4 sm:px-6 lg:px-12 xl:px-0" // Gouttières de la recherche quand non scrollé (xl:px-0 car mx-auto)
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <BsHeartFill className="text-2xl sm:text-3xl text-red-500" />
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Mes Favoris
              </h1>
            </div>
            <FilterPopover
              setFilter={setFilter}
              selectedFilters={selectedFilters}
              defaultOptions={[...defaultOptions]}
            />
          </div>
        </div>
      </div>

      <div className="font-primary mx-4 sm:mx-6 lg:mx-12 xl:mx-auto max-w-[1440px] py-8">
        {/* <HydrationBoundary state={dehydratedState}> */}
        <ProductList />
        {/* </HydrationBoundary> */}
      </div>
      <style>{styles}</style>
    </div>
  );
}

const ProductList = () => {
  const observerTarget = useRef<HTMLDivElement>(null);
  const { selectedFilters } = useSelectedFiltersStore();

  const filterNameToId = useMemo(() => {
    return filterOptions.reduce((acc, filter) => {
      acc[filter.name.toLowerCase()] = filter.id;
      return acc;
    }, {} as Record<string, string>);
  }, []);

  const orderText = selectedFilters?.order_by?.[0]?.text || "date_desc";
  const { api } = usePageContext();
  const order =
    (filterNameToId[orderText.toLowerCase()] as OrderByType) || "date_desc";

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["get_favorites", order, selectedFilters],
    queryFn: ({ pageParam = 1 }) =>
      get_favorites({ limit: 12, page: pageParam, order_by: order }, api),
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage?.meta.current_page;
      const lastPageNum = lastPage?.meta.last_page;
      return currentPage && lastPageNum && currentPage < lastPageNum
        ? currentPage + 1
        : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }
    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const allFavorites = data?.pages.flatMap((page) => page?.list || []) || [];

  if (status === "pending" && !allFavorites.length) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-gray-600">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <span className="ml-2 text-lg">Chargement des favoris...</span>
          </div>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center py-16">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-red-50 to-pink-50 border border-red-100 max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BsX className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-red-800 mb-2">Oups !</h3>
          <p className="text-red-600">
            Une erreur est survenue lors du chargement des favoris.
          </p>
        </div>
      </div>
    );
  }

  if (!allFavorites.length && status === "success") {
    return (
      <div className="text-center py-16">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BsHeartFill className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Aucun favori
          </h3>
          <p className="text-gray-600">
            Vous n'avez pas encore ajouté de produits à vos favoris.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {allFavorites.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-slate-600">
            <span className="font-semibold text-slate-800">
              {allFavorites.length}
            </span>{" "}
            favori{allFavorites.length > 1 ? "s" : ""} trouvé
            {allFavorites.length > 1 ? "s" : ""}
          </p>
        </div>
      )}

      <div className={GRID_CLASSES}>
        {allFavorites.map((favorite, index) =>
          favorite && favorite.product ? (
            <ProductSearchCard
              key={favorite.product.id}
              product={favorite.product}
              index={index}
            />
          ) : null
        )}
      </div>

      <div
        ref={observerTarget}
        className="py-8 flex justify-center min-h-[50px]"
      >
        {isFetchingNextPage ? (
          <div className="inline-flex items-center space-x-2 text-gray-600">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <span className="ml-2 text-lg">Chargement...</span>
          </div>
        ) : !hasNextPage && allFavorites.length > 0 ? (
          <p className="text-slate-500 text-sm">
            Tous vos favoris ont été chargés.
          </p>
        ) : null}
      </div>
    </div>
  );
};

function LoadingSkeleton() {
  return (
    <div className={GRID_CLASSES}>
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100"
        >
          <div className="h-48 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse"></div>
          <div className="p-6 space-y-3">
            <div className="h-4 bg-slate-200 rounded-full animate-pulse"></div>
            <div className="h-3 bg-slate-100 rounded-full animate-pulse w-3/4"></div>
            <div className="h-5 bg-slate-200 rounded-full animate-pulse w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = `
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
`;
