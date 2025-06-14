// Fichier : ProductSearchCard.tsx (ou ProductCard.tsx pour la réutilisabilité)

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

export default function ProductSearchCard({
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
      // On garde la base qui est excellente
      className="group relative flex flex-col min-h-[200px] bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
      style={{
        animationDelay: `${index * 50}ms`,
        animation: "fadeInUp 0.6s ease-out forwards",
      }}
    >
      {/* Promotion Badge - Pas de changement nécessaire ici */}
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

      {/* ===== MODIFICATION 1 : Le conteneur média devient flexible ===== */}
      <div className="relative w-full aspect-square overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <ProductMedia
            mediaList={mediaList}
            productName={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <FavoriteButton product_id={product.id} />
      </div>

      <div className="flex-1 flex flex-col px-4 py-2 sm:px-5">
        <div className="flex-1 space-y-2">
          <h2 className="font-bold text-slate-800 text-base/4 sm:text-lg line-clamp-2 group-hover:text-slate-600 transition-colors duration-300">
            {product.name}
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 leading-relaxed">
            {product.description || "Description non disponible"}
          </p>
        </div>

        <div className="pt-3 mt-3 border-t border-slate-100">
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
