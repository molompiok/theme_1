import React, { useEffect, useCallback, useState } from "react";
import { BsSearch, BsFilter, BsX } from "react-icons/bs";
import { useData } from "../../renderer/useData";
import { HydrationBoundary, useQuery } from "@tanstack/react-query";
import { get_features_with_values, get_products } from "../../api/products.api";
import { ProductClient } from "../type";
import { usePageContext } from "../../renderer/usePageContext";
import { navigate } from "vike/client/router";
import { DisplayPrice } from "../../component/DisplayPrice";
import { ProductMedia } from "../../component/ProductMedia";
import FavoriteButton from "../../component/FavoriteButton";
import { debounce, formatSlug } from "../../utils";
import { Data } from "./+data";
import { useSelectedFiltersStore } from "../../store/filter";
import { useFiltersAndUrlSync } from "../../hook/useUrlFilterManager";
import FilterPopover from "../../component/FilterPopover";
import { useThemeSettingsStore } from "../../store/themeSettingsStore";
import clsx from "clsx";

const DEBOUNCE_DELAY = 400;
const GRID_CLASSES =
  "grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6";

export default function Page() {
  const { dehydratedState } = useData<Data>();
  const [searchText, setSearchText] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { urlPathname } = usePageContext();
  const { setSelectedFilters, selectedFilters, setFilter } =
    useSelectedFiltersStore();

  useFiltersAndUrlSync([], urlPathname, setSelectedFilters, selectedFilters);

  const launchSearch = useCallback(() => {
    setFilter(
      "s",
      searchText
        ? [{ text: searchText, icon: [], key: null, product_count: 0 }]
        : []
    );
  }, [searchText, setFilter]);

  const debouncedSearch = useCallback(debounce(launchSearch, DEBOUNCE_DELAY), [
    launchSearch,
  ]);

  const clearSearch = () => {
    setSearchText("");
    setFilter("s", []);
  };

  useEffect(() => {
    debouncedSearch();
    return () => {
      debouncedSearch();
      setFilter("s", []);
    };
  }, [searchText, debouncedSearch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/0 border-b border-white/20 shadow-sm">
        <div className="font-primary mx-4 sm:mx-6 lg:mx-12 xl:mx-auto max-w-[1440px] pt-6 pb-1">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-sm sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Découvrir nos produits
            </h1>
            <FilterPopover
              setFilter={setFilter}
              selectedFilters={selectedFilters}
            />
          </div>

          <div
            className={`relative transition-all duration-300 ${
              isSearchFocused ? "transform scale-[1.02]" : ""
            }`}
          >
            <div
              className={`flex items-center bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 ${
                isSearchFocused
                  ? "border-gray-500 shadow-gray-500/20 shadow-2xl"
                  : "border-transparent hover:shadow-xl"
              }`}
            >
              <div className="flex items-center px-6 py-2">
                <BsSearch
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isSearchFocused ? "text-gray-500" : "text-gray-400"
                  }`}
                />
              </div>
              <input
                className="flex-1 py-3 pr-4 text-sm placeholder-gray-400 bg-transparent border-none outline-none"
                placeholder="Rechercher un produit..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                aria-label="Rechercher un produit"
              />
              {searchText && (
                <button
                  onClick={clearSearch}
                  className="p-2 mr-4 rounded-full hover:bg-slate-100 transition-colors duration-200"
                >
                  <BsX className="w-5 h-5 text-slate-400" />
                </button>
              )}
            </div>

            {searchText && (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="w-8 h-1 bg-gradient-to-r from-gray-500 to-gray-200 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="font-primary mx-4 sm:mx-6 lg:mx-12 xl:mx-auto max-w-[1440px] py-8">
        <HydrationBoundary state={dehydratedState}>
          <ListProductSearchCard searchText={searchText} />
        </HydrationBoundary>
      </div>
    </div>
  );
}

function ListProductSearchCard({ searchText }: { searchText: string }) {
  const { selectedFilters } = useSelectedFiltersStore();

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["get_products", selectedFilters],
    queryFn: async () => {
      const response = await get_products({
        search: selectedFilters["s"]?.[0]?.text
          ? selectedFilters["s"]?.[0]?.text
          : "",
        max_price: selectedFilters["max_price"]?.[0]?.text
          ? parseFloat(selectedFilters["max_price"]?.[0]?.text)
          : undefined,
        min_price: selectedFilters["min_price"]?.[0]?.text
          ? parseFloat(selectedFilters["min_price"]?.[0]?.text)
          : undefined,
        limit: 24,
      });
      return response.list;
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
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
            <span className="ml-2 text-lg">Recherche en cours...</span>
          </div>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-red-50 to-pink-50 border border-red-100 max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BsX className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-red-800 mb-2">Oups !</h3>
          <p className="text-red-600">
            Une erreur est survenue lors du chargement
          </p>
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-16">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BsSearch className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Aucun résultat
          </h3>
          <p className="text-gray-600">
            {searchText
              ? `Aucun produit trouvé pour "${searchText}"`
              : "Aucun produit disponible"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-slate-600">
          <span className="font-semibold text-slate-800">
            {products.length}
          </span>{" "}
          produit{products.length > 1 ? "s" : ""} trouvé
          {products.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className={GRID_CLASSES}>
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className={GRID_CLASSES}>
      {[...Array(12)].map((_, i) => (
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
            `absolute  z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg`,
            settings.promotionTextPosition === "top-left" && "top-2 left-2",
            settings.promotionTextPosition === "bottom-left" &&
              "bottom-2 left-2",
            settings.promotionTextPosition === "bottom-right" &&
              "bottom-2 right-2",
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
