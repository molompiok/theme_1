// Fichier : ProductSimilaire.tsx

import { useQuery } from "@tanstack/react-query";
import { ProductClient } from "../../pages/type";
import { get_features_with_values } from "../../api/products.api";
import { useThemeSettingsStore } from "../../store/themeSettingsStore";
import { formatSlug } from "../../utils";
import { navigate } from "vike/client/router";
import clsx from "clsx";
import { ProductMedia } from "../ProductMedia";
import FavoriteButton from "../FavoriteButton";
import { DisplayPrice } from "../DisplayPrice";
import { usePageContext } from "vike-react/usePageContext";

export default function ProductSimilaire({
  product,
  index,
}: {
  product: ProductClient;
  index: number;
}) {
  const { api } = usePageContext()
  const { data: feature, isLoading } = useQuery({
    queryKey: ["get_features_with_values", product.default_feature_id],
    queryFn: () =>
      get_features_with_values({
        feature_id: product.default_feature_id,
      }, api),
    enabled: !!product.default_feature_id,
  });
  const settings = useThemeSettingsStore((state) => state);

  const mediaList = feature?.[0]?.values?.[0]?.views || [];
  const handleNavigation = () => navigate(`/${formatSlug(product.slug)}`);

  return (
    <article
      onClick={handleNavigation}
      className="group relative flex flex-col bg-white rounded-lg overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
      style={{
        animationDelay: `${index * 30}ms`,
        animation: "fadeInUp 0.4s ease-out forwards",
      }}
    >
      {/* Badge promotion compact */}
      {product.barred_price && settings.showInfoPromotion && (
        <div
          className={clsx(
            `absolute z-10 text-white px-2 py-0.5 rounded text-xs font-medium shadow-sm`,
            settings.promotionTextPosition === "top-left" && "top-1 left-1",
            settings.promotionTextPosition === "bottom-left" &&
            "bottom-1 left-1",
            settings.promotionTextPosition === "bottom-right" &&
            "bottom-1 right-1",
            settings.promotionTextPosition === "top-right" && "top-1 right-1"
          )}
          style={{
            backgroundColor: settings.promotionTextBackgroundColor,
            color: settings.promotionTextColor,
          }}
        >
          {settings.promotionText}
        </div>
      )}

      {/* Image compacte avec ratio réduit */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <ProductMedia
            mediaList={mediaList}
            productName={product.name}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
        )}
      </div>

      {/* Bouton favori compact */}
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="scale-75">
          <FavoriteButton product_id={product.id} />
        </div>
      </div>

      {/* Contenu compact */}
      <div className="flex-1 flex flex-col px-3 py-2">
        <div className="flex-1 space-y-1">
          <h3 className="font-semibold text-slate-800 text-sm line-clamp-1 group-hover:text-slate-600 transition-colors duration-200">
            {product.name}
          </h3>
          <p className="text-slate-500 text-xs line-clamp-1 leading-tight">
            {product.description || "Description non disponible"}
          </p>
        </div>

        {/* Prix compact */}
        <div className="pt-2 mt-1">
          <div className="scale-90 origin-left">
            <DisplayPrice
              currency={product.currency}
              price={product.price ?? 0}
              product_id={product.id}
              barred_price={product.barred_price}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
