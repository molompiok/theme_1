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
import { get_favorites, get_features_with_values } from "../../../api/products.api";
import Loading from "../../../component/Loading";
import FavoriteButton from "../../../component/FavoriteButton";
import { ProductMedia } from "../../../component/ProductMedia";
import { ProductFavorite } from "../../type";

export default function Page() {
  const { dehydratedState } = useData<Data>()
  return (
    <div className="bg-gray-50 px-3 font-primary">
      <div className="relative w-full min-h-dvh pt-10 max-w-[1200px] mx-auto ">
        <div className="flex gap-2 items-center font-light">
          <BsHeartFill className="text-4xl text-red-500/60" />
          <h1 className="text-3xl font-semibold">Mes favoris</h1>
        </div>
        <div className="flex justify-end mb-5 border-b border-b-black/70">
          <Popover>
            <PopoverTrigger
              asChild
              className=" gap-2 justify-center items-center bg-white sm:flex hidden "
            >
              <button className="flex gap-1 mb-5 ">
                <span className="font-light">Filtrez par</span>
                <span className="cursor-pointer">Plus recents</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="z-20">
              <div className="bg-white shadow-2xl  flex flex-col gap-y-3 px-6 rounded-2xl py-2">
                {[
                  "plus recent",
                  "plus ancien",
                  "mieux mote",
                  "Prix eleve",
                  "Prix bas",
                ].map((sort, index) => {
                  return (
                    <div
                      className="text-lg capitalize underline-animation cursor-pointer"
                      key={index}
                    >
                      {sort}
                    </div>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <HydrationBoundary state={dehydratedState}>
          <ProductList />
        </HydrationBoundary>
      </div>
    </div>
  );
}

function ProductList() {
  const { data: favorites, status } = useQuery({
    queryKey: ['get_favorites'], queryFn: () => {
      return get_favorites({})
    }
  })
  if (status === 'pending') {
    <Loading />
  }
  if (!favorites || favorites.length === 0) {
    return <p className="flex size-full text-clamp-md justify-center mt-20">
      Aucun produits en favoris
    </p>
  }

  return (
    <div className="grid list-product-breakpoint-3:grid-cols-4  list-product-breakpoint-3:gap-3 list-product-breakpoint-6:grid-cols-2 grid-cols-1 gap-2">
      {favorites.map((favorite) => {
        return (
          <ProductCard key={favorite.id} favorite={favorite} />
        )
      })}
    </div>)
}

function ProductCard({ favorite }: { favorite: ProductFavorite }) {

  const { data: feature, status } = useQuery({ queryKey: ['get_features_with_values', favorite.default_feature_id], queryFn: () => get_features_with_values({ feature_id: favorite.default_feature_id }) })

  const mediaList = feature?.[0]?.views || [];
  return (
    <div className="relative overflow-hidden border font-primary border-black/15 rounded-2xl pb-4">
      <FavoriteButton product_id={favorite.product_id} />
      {status === 'pending' ? <Loading /> :
        <ProductMedia mediaList={mediaList}
          productName={favorite.name}
          className="w-full rounded-sm pb-1 object-cover aspect-square cursor-pointer transition-all duration-500 ease-in-out" />}
      <div className="w-full flex-col flex">
        <div className="max-w-full py-1">
          <DisplayPrice
            currency={favorite.currency}
            price={favorite.price ?? 0}
            barred_price={favorite.barred_price ?? undefined}
          />
          <div className="flex flex-col items-start pl-2 max-w-[99%]">
            <h1 className="px-2 text-clamp-base font-bold  line-clamp-2">
              {favorite.name}
            </h1>
            <h1 className="px-2 text-clamp-base font-light line-clamp-3 ">
              {favorite.description}
            </h1>
          </div>
        </div>

      </div>
    </div>
  );
}
