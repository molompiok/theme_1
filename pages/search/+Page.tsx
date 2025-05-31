import React, { useEffect, useCallback, useState } from "react";
import { BsSearch } from "react-icons/bs";
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

const DEBOUNCE_DELAY = 600; 
const GRID_CLASSES = "grid grid-cols-2 gap-2 min-[280px]:gap-3 sm:gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8 xl:grid-cols-5 xl:gap-8";

export default function Page() {
  const { dehydratedState } = useData<Data>();
  const [searchText, setSearchText] = useState("");
  const { urlPathname } = usePageContext();
  const { setSelectedFilters, selectedFilters, setFilter } = useSelectedFiltersStore();

  useFiltersAndUrlSync([], urlPathname, setSelectedFilters, selectedFilters);

  const launchSearch = useCallback(() => {

    setFilter("s", searchText 
      ? [{ text: searchText, icon: [], key: null }]
      : []
    );
  }, [searchText, setFilter]);

  const debouncedSearch = useCallback(
    debounce(launchSearch, DEBOUNCE_DELAY),
    [launchSearch]
  );

  useEffect(() => {
    debouncedSearch();
    return () => {
      debouncedSearch()
      setFilter("s", []);
    };
  }, [searchText, debouncedSearch]);

  return (
    <div className="relative bg-gray-50 min-h-dvh w-full">
      <div className="font-primary mx-2 min-[280px]:mx-4 sm:mx-6 md:mx-8 lg:mx-12 xl:mx-auto max-w-[1440px] sm:px-4 pt-10">
        <h1 className="text-clamp-sm font-bold my-2">Recherche des produits</h1>
        <div className="relative flex items-center bg-gray-200 w-full py-3 pl-5 mb-10 rounded-xl  top-0">
          <BsSearch className="text-gray-500" />
          <input
            className="w-full pl-2 focus:outline-none bg-transparent placeholder-gray-500"
            placeholder="Entrez le nom du produit"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            aria-label="Rechercher un produit"
          />
        </div>
        <HydrationBoundary state={dehydratedState}>
          <ListProductSearchCard />
        </HydrationBoundary>
      </div>
    </div>
  );
}

function ListProductSearchCard() {
  const { selectedFilters } = useSelectedFiltersStore();

  const { 
    data: products = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ["get_products", selectedFilters],
    queryFn: async () => {
      const response = await get_products({ 
        search: selectedFilters["s"]?.[0]?.text ? selectedFilters["s"]?.[0]?.text : "",
        max_price: selectedFilters["max_price"]?.[0]?.text ? parseFloat(selectedFilters["max_price"]?.[0]?.text) : undefined,
        min_price: selectedFilters["min_price"]?.[0]?.text ? parseFloat(selectedFilters["min_price"]?.[0]?.text) : undefined,
        limit:3
      });
      return response.list;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Chargement des produits...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Une erreur est survenue lors du chargement</p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Aucun produit trouvé</p>
      </div>
    );
  }

  return (
    <div className={GRID_CLASSES}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: ProductClient }) {
  const { data: feature, isLoading } = useQuery({
    queryKey: ["get_features_with_values", product.default_feature_id],
    queryFn: () => get_features_with_values({ 
      feature_id: product.default_feature_id 
    }),
    enabled: !!product.default_feature_id,
  });

  const mediaList = feature?.[0]?.values?.[0]?.views || [];
  const handleNavigation = () => navigate(`/${formatSlug(product.name)}`);

  return (
    <article
      onClick={handleNavigation}
      className="relative overflow-hidden border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-white flex flex-col h-full font-primary group cursor-pointer"
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-[120px] min-[280px]:h-[150px] sm:h-[200px] text-gray-500">
          Chargement...
        </div>
      ) : (
        <ProductMedia
          mediaList={mediaList}
          productName={product.name}
          className="w-full h-[120px] min-[280px]:h-[150px] sm:h-[200px] object-cover rounded-t-xl group-hover:scale-[1.02] transition-transform duration-300"
        />
      )}
      <FavoriteButton product_id={product.id} />
      <div className="p-1 min-[280px]:p-2 sm:p-4 flex flex-col flex-1">
        <div className="max-w-[90%] mb-1 min-[280px]:mb-2">
          <h1 className="text-xs min-[280px]:text-sm/4 sm:text-base/4 font-bold line-clamp-2 mb-0.5 min-[280px]:mb-1">
            {product.name}
          </h1>
          <p className="text-[10px] min-[280px]:text-xs/4 sm:text-sm/4 font-light line-clamp-2 text-gray-600">
            {product.description || "Description non disponible"}
          </p>
        </div>
        <div className="mt-auto">
          <DisplayPrice
            currency={product.currency}
            price={product.price ?? 0}
            product_id={product.id}
            barred_price={product.barred_price}
          />
        </div>
      </div>
    </article>
  );
}