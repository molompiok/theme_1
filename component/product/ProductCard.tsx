import React from "react";
import { CartButton } from "../Button";
import { GroupProductType, ProductClient } from "../../pages/type";
import { navigate } from "vike/client/router";
import { formatSlug, getFirstFeatureWithView } from "../../utils";
import { useQuery } from "@tanstack/react-query";
import { get_features_with_values } from "../../api/products.api";
import Loading from "../Loading";
import { ProductMedia } from "../ProductMedia";
import FavoriteButton from "../FavoriteButton";
import ReviewsStars from "../comment/ReviewsStars";
import { DisplayPrice } from "../DisplayPrice";
import { useThemeSettingsStore } from "../../store/themeSettingsStore";
import clsx from "clsx";

export default function ProductCard({
  product,
}: {
  product: ProductClient | undefined;
}) {
  const handleGo = () => {
    if (!product) return;
    navigate(`/${formatSlug(product.slug)}`, { keepScrollPosition: false });
  };

  const { data: feature, status } = useQuery({
    queryKey: ["get_features_with_values", product?.default_feature_id],
    queryFn: () =>
      get_features_with_values({ feature_id: product?.default_feature_id }),
    enabled: !!product,
  });

  const { setSettings, resetSettings, ...settings } = useThemeSettingsStore();

  const mediaList =
    getFirstFeatureWithView(feature || [])?.values[0].views || [];

  return (
    <article
      onClick={handleGo}
      className="group border border-gray-50 hover:border-gray-100 rounded-md
            transition-all duration-300 flex flex-col h-full cursor-pointer max-w-md"
      style={{
        backgroundColor: settings?.productCardBackgroundColor,
        color: settings?.productCardTextColor,
      }}
    >
      <div className="relative w-full h-full aspect-square overflow-hidden">
        {status === "pending" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Loading />
          </div>
        ) : (
          <ProductMedia
            mediaList={mediaList}
            productName={product?.name || ""}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        )}
        {product && (
          <FavoriteButton
            key={product.id}
            product_id={product.id}
            className={clsx(
              "absolute z-10",
              settings.favoriteIconPosition === "top-right" && "top-2 right-2",
              settings.favoriteIconPosition === "bottom-right" &&
                "bottom-2 right-2",
              settings.favoriteIconPosition === "bottom-left" &&
                "bottom-2 left-2",
              settings.favoriteIconPosition === "top-left" && "top-2 left-2"
            )}
          />
        )}
      </div>
      <div className="px-3 py-1 sm:p-4 flex flex-col flex-1">
        {settings.priceBeforeName && (
          <DisplayPrice
            product_id={product?.id || ""}
            currency={product?.currency || ""}
            price={product?.price || 0}
            barred_price={product?.barred_price}
          />
        )}
        <div className="my-1">
          <h1
            className="text-sm group-hover:text-gray-950 text-gray-800 sm:text-base/5 font-semibold line-clamp-2"
            style={{
              color: settings?.productCardTextColor,
            }}
          >
            {product?.name}
          </h1>
          {settings?.showRatingInList && (
            <div className="flex items-center gap-1 mt-1">
              <ReviewsStars
                note={product?.rating || 0}
                size={14}
                style="text-orange-500"
              />
              <span className="text-xs hidden min-[370px]:inline text-gray-600">
                ({product?.comment_count} avis)
              </span>
            </div>
          )}
        </div>
        {!settings.priceBeforeName && (
          <DisplayPrice
            product_id={product?.id || ""}
            currency={product?.currency || ""}
            price={product?.price || 0}
            barred_price={product?.barred_price}
          />
        )}
        <div className="mt-2">
          <CartButton text="Ajouter au panier" product={product} />
        </div>
      </div>
    </article>
  );
}
