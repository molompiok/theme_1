import { useState } from "react";
import { BsHeartFill } from "react-icons/bs";
import clsx from "clsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../component/Popover";
import { DisplayPrice } from "../../../component/DisplayPrice";
import { Data } from "./+data";
import { useData } from "../../../renderer/useData";
import { HydrationBoundary, useQuery } from "@tanstack/react-query";
import {
  get_favorites,
  get_features_with_values,
} from "../../../api/products.api";
import Loading from "../../../component/Loading";
import FavoriteButton from "../../../component/FavoriteButton";
import { ProductMedia } from "../../../component/ProductMedia";
import { ProductFavorite } from "../../type";
import { useAuthRedirect } from "../../../hook/authRedirect";
import FilterPopover from "../../../component/FilterPopover";

const sortOptions = [
  "Plus récent",
  "Plus ancien",
  "Mieux noté",
  "Prix élevé",
  "Prix bas",
];

export default function Page() {
  const { dehydratedState } = useData<Data>();
  useAuthRedirect();

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen px-4 py-8 sm:py-12 font-primary">
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-0">
            <BsHeartFill className="text-2xl sm:text-4xl text-red-500 animate-pulse" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Mes Favoris</h1>
          </div>
          <FilterPopover options={sortOptions} />
        </div>
        <HydrationBoundary state={dehydratedState}>
          <ProductList />
        </HydrationBoundary>
      </div>
    </div>
  );
}

function ProductList() {
  const {
    data: favorites,
    status,
    error,
  } = useQuery<ProductFavorite[], Error>({
    queryKey: ["get_favorites"],
    queryFn: () => get_favorites({}),
  });

  if (status === "pending") {
    return <Loading />;
  }

  if (status === "error") {
    return (
      <div className="text-center py-12 sm:py-16 bg-white rounded-lg shadow">
        <p className="text-gray-600 text-base sm:text-lg">
          Erreur : {error.message}
        </p>
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 bg-white rounded-lg shadow">
        <p className="text-gray-600 text-base sm:text-lg">Aucun favori pour le moment</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {favorites.map((favorite) => (
        <ProductCard key={favorite.id} favorite={favorite} />
      ))}
    </div>
  );
}

function ProductCard({ favorite }: { favorite: ProductFavorite }) {
  console.log("🚀 ~ ProductCard ~ favorite:", favorite)
  const { data: feature, status } = useQuery({
    queryKey: ["get_features_with_values", favorite.default_feature_id],
    queryFn: () =>
      get_features_with_values({ feature_id: favorite.default_feature_id }),
    enabled: !!favorite.default_feature_id,
  });

  const mediaList = feature?.[0]?.values[0].views || [];

  return (
    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 w-full">
      <div className="relative aspect-square">
        <FavoriteButton 
          product_id={favorite.product_id}
        />
        {status === "pending" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Loading />
          </div>
        ) : (
          <ProductMedia
            mediaList={mediaList}
            productName={favorite.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>
      
      <div className="p-2 sm:p-3">
        <h1 className="text-base/5 sm:text-lg/5 font-semibold text-gray-800 line-clamp-2 mb-1 sm:mb-2 hover:text-blue-600 transition-colors">
          {favorite.name}
        </h1>
        <p className="text-xs/5 sm:text-sm/5 text-gray-600 line-clamp-2 mb-2 sm:mb-3">
          {favorite.description}
        </p>
        <div className="flex items-center justify-between">
          <DisplayPrice
            currency={favorite.currency}
            price={favorite.price ?? 0}
            barred_price={favorite.barred_price ?? undefined}
          />
          <div className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      </div>
    </div>
  );
}