// src/component/SimilarProductsSection.tsx

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { get_similar_products } from "../api/products.api";
import { BsX } from "react-icons/bs";
import ProductCard from "./product/ProductCard";
import { ProductClient } from "../pages/type";
import ProductSimilaire from "./product/ProductSimilaire";

interface SimilarProductsSectionProps {
  productSlug: string;
}

export function SimilarProductsSection({
  productSlug,
}: SimilarProductsSectionProps) {
  const {
    data: similarProducts,
    isLoading,
    isError,
  } = useQuery<ProductClient[]>({
    // Clé de requête unique qui inclut le slug du produit principal
    queryKey: ["similar_products", productSlug],
    queryFn: () => get_similar_products({ slug: productSlug }),
    // Ne relance pas la requête si l'utilisateur quitte et revient sur la page rapidement
    staleTime: 5 * 60 * 1000,
    // La requête ne s'exécute que si le slug est valide
    enabled: !!productSlug,
  });

  // Ne rien afficher si on charge et qu'il n'y a pas encore de données
  // ou si la requête a échoué, ou s'il n'y a aucun produit à afficher.
  // Cela évite d'afficher un titre "Vous aimerez aussi" pour rien.
  if (
    isLoading ||
    isError ||
    !similarProducts ||
    similarProducts.length === 0
  ) {
    // Si vous voulez quand même montrer un état de chargement, vous pouvez décommenter la section suivante
    if (isLoading) {
      return (
        <div className="w-full py-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            Vous aimerez aussi...
          </h2>
          <LoadingSkeletonForSection />
        </div>
      );
    }
    return null;
  }

  return (
    <section className="w-full py-12 bg-transparent border-t border-slate-100">
      <div className="font-primary mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12">
        <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-8">
          Vous aimerez aussi...
        </h2>

        {/* Conteneur avec défilement horizontal */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 sm:gap-6 pb-4 min-w-max">
            {similarProducts.map((product, index) => (
              <div key={product.id} className="flex-shrink-0 w-36 sm:w-44">
                <ProductSimilaire index={index} product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Un squelette de chargement dédié à cette section, adapté pour le défilement horizontal.
 */
function LoadingSkeletonForSection() {
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-4 sm:gap-6 pb-4 min-w-max">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-64 sm:w-72 bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100"
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
    </div>
  );
}

/**
 * Vous pourriez aussi vouloir un composant d'erreur dédié si vous le souhaitez.
 * Mais pour cette section, ne rien afficher est souvent la meilleure expérience.
 */
function ErrorState() {
  return (
    <div className="text-center py-16">
      <div className="p-8 rounded-3xl bg-gradient-to-br from-red-50 to-pink-50 border border-red-100 max-w-md mx-auto">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BsX className="w-8 h-8 text-slate-500" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">Oups !</h3>
        <p className="text-slate-600">
          Impossible de charger les produits similaires.
        </p>
      </div>
    </div>
  );
}
