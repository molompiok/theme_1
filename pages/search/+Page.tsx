import React, { useEffect, useMemo, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { useData } from "../../renderer/useData";
import { Data } from "../index/+data";
import { HydrationBoundary, useQuery } from "@tanstack/react-query";
import { get_features_with_values, get_products } from "../../api/products.api";
import { ProductClient } from "../type";
import { usePageContext } from "../../renderer/usePageContext";
import { navigate, reload } from "vike/client/router";
import { DisplayPrice } from "../../component/DisplayPrice";
import { ProductMedia } from "../../component/ProductMedia";
import FavoriteButton from "../../component/FavoriteButton";
import { formatSlug } from "../../utils";

export default function Page() {
  const { dehydratedState } = useData<Data>();
  const [text, setText] = useState("");
  const { urlPathname } = usePageContext();
  
  useEffect(() => {
    const launchSearch = async () => {
      if (text) {
        window.history.replaceState(null, "", urlPathname + "?name=" + text);
        await reload();
      } else {
        window.history.replaceState(null, "", urlPathname);
      }
    };
    launchSearch();
  }, [text]);

  return (
    <div className="relative bg-gray-100 min-h-dvh w-full">
      <div className="font-primary mx-2 min-[280px]:mx-4 sm:mx-6 md:mx-8 lg:mx-12 xl:mx-auto max-w-[1440px] pt-10">
        <h1 className="text-clamp-sm font-bold my-2">Recherche des produits</h1>
        <div className="flex gap-2 items-center bg-gray-200 w-full py-3 pl-5 mb-10 rounded-xl sticky top-0">
          <BsSearch />
          <input
            className="w-full focus:border-none focus:outline-none bg-transparent"
            placeholder="Entrez le nom du produit"
            onChange={(e) => setText(e.target.value)}
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
  const { urlParsed } = usePageContext();

  const {
    data: products,
    isLoading,
    isFetching,
    isPending,
  } = useQuery({
    queryKey: ["gets_products", { name: urlParsed.search["name"] }],
    queryFn: () => get_products({ search: urlParsed.search["name"] }),
  });

  if (isLoading || isFetching || isPending) {
    return <p className="text-center py-8">Chargement.......</p>;
  }
  if (!products || products?.length === 0) {
    return <p className="text-center py-8">Aucun produit</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-2 
      min-[280px]:gap-3 
      sm:gap-4 
      md:grid-cols-3 md:gap-6
      lg:grid-cols-4 lg:gap-8
      xl:grid-cols-5 xl:gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: ProductClient }) {
  const handleGo = () => {
    navigate(`/${formatSlug(product.name)}`);
  };
  
  const { data: feature, isLoading } = useQuery({
    queryKey: ["get_features_with_values", product.default_feature_id],
    queryFn: () =>
      get_features_with_values({ feature_id: product.default_feature_id }),
  });
  
  const mediaList = feature?.[0]?.values?.[0]?.views || [];

  return (
    <div
      onClick={handleGo}
      className="relative overflow-hidden border border-gray-200 
        rounded-xl shadow-sm hover:shadow-md transition-all duration-300 
        bg-white flex flex-col h-full font-primary group"
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-[120px] min-[280px]:h-[150px] sm:h-[200px]">
          Loading...
        </div>
      ) : (
        <ProductMedia
          mediaList={mediaList}
          productName={product.name}
          className="w-full h-[120px] min-[280px]:h-[150px] sm:h-[200px] object-cover 
            rounded-t-xl group-hover:scale-[1.02] transition-transform duration-300"
        />
      )}
      <FavoriteButton 
        product_id={product.id} 
        // ="absolute top-1 right-1 min-[280px]:top-2 min-[280px]:right-2" 
        
      />
      <div className="p-1 min-[280px]:p-2 sm:p-4 flex flex-col flex-1">
        <div className="max-w-[90%] mb-1 min-[280px]:mb-2">
          <h1 className="text-xs min-[280px]:text-sm sm:text-base font-bold line-clamp-2 mb-0.5 min-[280px]:mb-1">
            {product.name}
          </h1>
          <h1 className="text-[10px] min-[280px]:text-xs sm:text-sm font-light line-clamp-2 text-gray-600">
            {product.description}
          </h1>
        </div>
        <div className="mt-auto">
          <DisplayPrice
            currency={product.currency}
            price={product.price ?? 0}
            barred_price={product.barred_price}
          />
        </div>
      </div>
    </div>
  );
}