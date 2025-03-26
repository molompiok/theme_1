import React from "react";
import { CartButton } from "../Button";
import { GroupProductType, ProductClient } from "../../pages/type";
import { navigate } from "vike/client/router";
import { formatSlug, getFirstFeatureWithView } from "../../utils";
import { useQuery } from "@tanstack/react-query";
import {
  get_features_with_values,
} from "../../api/products.api";
import Loading from "../Loading";
import { ProductMedia } from "../ProductMedia";
import FavoriteButton from "../FavoriteButton";
import ReviewsStars from "../comment/ReviewsStars";
import { DisplayPrice } from "../DisplayPrice";

export default function ProductCard({ product  }: { product: ProductClient }) {
  const handleGo = () => {
    navigate(`/${formatSlug(product.slug)}`);
  };

  const { data: feature, status } = useQuery({
    queryKey: ["get_features_with_values", product.default_feature_id],
    queryFn: () =>
      get_features_with_values({ feature_id: product.default_feature_id }),
  });

  const mediaList = getFirstFeatureWithView(feature || [])?.values[0].views || [];
  return (
    <div
      onClick={handleGo}
      className="group bg-white border border-gray-50 hover:border-gray-100  rounded-md
            transition-all duration-300 flex flex-col h-full cursor-pointer overflow-hidden max-w-md"
    >
      <div className="relative w-full aspect-square overflow-hidden">
        {status === "pending" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Loading />
          </div>
        ) : (
          <ProductMedia
            mediaList={mediaList}
            productName={product.name}
            className="w-full h-full object-cover group-hover:scale-[1.02]  transition-transform duration-300"
          />
        )}
        <FavoriteButton key={product.id} product_id={product.id} />
      </div>
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <div className="mb-2">
          <h1 className="text-sm group-hover:text-gray-950  text-gray-800  sm:text-base/5 font-semibold line-clamp-2 mb-1">
            {product.name}
          </h1>
          <div className="flex items-center gap-1">
            <ReviewsStars note={4.6} size={14} style="text-orange-500" />
            <span className="text-xs hidden min-[370px]:inline text-gray-600">
              (280 avis)
            </span>
          </div>
        </div>

        <div className="">
          <DisplayPrice
            currency={product.currency}
            price={product.price ?? 0}
            barred_price={product.barred_price}
          />
        </div>

        <div className="mt-auto">
          <CartButton
            text="Ajouter au panier"
            product={product}
            // group_product={group_product}
          />
        </div>
      </div>
    </div>
  );
}
