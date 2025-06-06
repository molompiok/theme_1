import React, { useEffect, useMemo, useRef, useState } from "react";
import { BsSearch, BsX, BsHeartFill } from "react-icons/bs";
// import { useData } from "../../../renderer/useData"; // Optionnel pour cette page
import {
  HydrationBoundary,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import {
  get_favorites,
  get_features_with_values,
} from "../../../api/products.api";
import { ProductClient, ProductFavorite, OrderByType, filterOptions, defaultOptions } from "../../type";
import { usePageContext } from "../../../renderer/usePageContext";
import { navigate } from "vike/client/router";
import { DisplayPrice } from "../../../component/DisplayPrice";
import { ProductMedia } from "../../../component/ProductMedia";
import FavoriteButton from "../../../component/FavoriteButton";
import { formatSlug } from "../../../utils";
import { useSelectedFiltersStore } from "../../../store/filter";
import { useFiltersAndUrlSync } from "../../../hook/useUrlFilterManager";
import FilterPopover from "../../../component/FilterPopover";
import { useThemeSettingsStore } from "../../../store/themeSettingsStore";
import clsx from "clsx";
// import Loading from "../../../component/Loading"; // Remplacé par le spinner de la recherche pour cohérence

const GRID_CLASSES =
  "grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6";

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
      get_favorites({ limit: 12, page: pageParam, order_by: order }),
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

  if (!allFavorites.length && status === 'success') {
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
        {allFavorites.map((favorite, index) => (
          favorite && favorite.product ? (
            <ProductCard
              key={favorite.product.id}
              product={favorite.product}
              index={index}
            />
          ) : null
        ))}
      </div>

      <div ref={observerTarget} className="py-8 flex justify-center min-h-[50px]">
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

function ProductCard({
  product,
  index,
}: {
  product: ProductClient;
  index: number;
}) {
  const { data: feature, isLoading } = useQuery({
    queryKey: ["get_features_with_values", product.default_feature_id],
    queryFn: () =>
      get_features_with_values({
        feature_id: product.default_feature_id,
      }),
    enabled: !!product.default_feature_id,
  });
  const settings = useThemeSettingsStore((state) => state);

  const mediaList = feature?.[0]?.values?.[0]?.views || [];
  const handleNavigation = () => navigate(`/${formatSlug(product.slug)}`);

  return (
    <article
      onClick={handleNavigation}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 cursor-pointer transform hover:-translate-y-1 hover:scale-[1.01]"
      style={{
        animationDelay: `${index * 50}ms`,
        animation: "fadeInUp 0.6s ease-out forwards",
      }}
    >
      {product.barred_price && settings.showInfoPromotion && (
        <div
          className={clsx(
            `absolute z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg`,
            settings.promotionTextPosition === "top-left" && "top-2 left-2",
            settings.promotionTextPosition === "bottom-left" && "bottom-2 left-2",
            settings.promotionTextPosition === "bottom-right" && "bottom-2 right-2",
            settings.promotionTextPosition === "top-right" && "top-2 right-2"
          )}
          style={{
            backgroundColor: settings.promotionTextBackgroundColor,
            color: settings.promotionTextColor,
          }}
        >
          {settings.promotionText}
        </div>
      )}

      <div className="relative overflow-hidden">
        {isLoading ? (
          <div className="h-48 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <ProductMedia
            mediaList={mediaList}
            productName={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <FavoriteButton product_id={product.id} />
      </div>
      <div className="p-6 space-y-4">
        <div>
          <h2 className="font-bold text-slate-800 text-lg line-clamp-2 mb-2 group-hover:text-slate-600 transition-colors duration-300">
            {product.name}
          </h2>
          <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
            {product.description || "Description non disponible"}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <DisplayPrice
            currency={product.currency}
            price={product.price ?? 0}
            product_id={product.id}
            barred_price={product.barred_price}
          />
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </article>
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