//pages/index/@slug/+data.ts
export { data };
export type Data = Awaited<ReturnType<typeof data>>;

import { dehydrate } from "@tanstack/react-query";
import { PageContextServer } from "vike/types";
import { get_features_with_values, get_products } from "../../../api/products.api";
import { getFirstFeatureWithView } from "../../../utils"; // Assurez-vous que le chemin est correct
import { createQueryClient } from "../../../renderer/ReactQueryProvider";
import useStoreInfo from "../../../hook/query/store/useGetStore";
import { createApiInstances } from "../../../renderer/createApiInstance";

const data = async (pageContext: PageContextServer) => {
  const queryClient = createQueryClient() // Utilisez une nouvelle instance pour chaque requête serveur
  const slug = pageContext.routeParams!.slug;
  const { api, apiUrl, serverUrl } = createApiInstances(pageContext);
  // Pré-chargement de la requête produit
  const productData = await queryClient.fetchQuery({
    queryKey: ["get_product_by_slug", slug], // Clé plus spécifique
    queryFn: () => get_products({ slug_product: slug }, api),
  });

  const product = productData?.list?.[0];

  // Si le produit n'existe pas, on peut gérer une page 404 ici
  if (!product) {
    return {
      product: null,
      dehydratedState: dehydrate(queryClient),
      // Vike peut intercepter `is404` pour rendre une page d'erreur
      is404: true,
      // Méta-données pour la page 404
      title: "Produit non trouvé",
      meta: {
        description: "Le produit que vous cherchez n'existe pas ou plus.",
        robots: "noindex, nofollow" // Important pour le SEO des pages d'erreur
      }
    };
  }

  // Pré-chargement des features pour obtenir l'image
  const features = await queryClient.fetchQuery({
    queryKey: ["get_features_with_values", product.id],
    queryFn: () => get_features_with_values({ product_id: product.id }, api),
  });

  // const { data: infoStore } = useStoreInfo(api, serverUrl, apiUrl)

  // Logique pour obtenir l'image principale
  const mainImage = getFirstFeatureWithView(features || [])?.values[0]?.views[0];
  const imageUrl = mainImage ? `${apiUrl}${mainImage}` : `${apiUrl}/default-product-image.jpg`; // Ayez une image par défaut

  // Création d'une description SEO concise
  const seoDescription = product.description
    ? product.description.substring(0, 160)
    : `Découvrez ${product.name}. Achetez maintenant sur notre boutique et profitez de la meilleure qualité.`;

  // Préparation des données structurées (JSON-LD)
  const ldJson = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: imageUrl,
    description: seoDescription,
    sku: product.id,
    brand: {
      "@type": "Brand",
      // name: infoStore?.name, // À remplacer par la vraie marque si disponible
    },
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: product.price,
      availability: "https://schema.org/InStock", // ou OutOfStock
      url: `${apiUrl}/${slug}`,
    },
    ...(product.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.comment_count,
      },
    }),
  };

  return {
    product, // On passe directement le produit pour éviter un re-fetch
    dehydratedState: dehydrate(queryClient),

    title: `${product.name} | Votre Boutique`,
    description: seoDescription,
    slug,
    canonicalUrl: `${apiUrl}/${slug}`,
    og: {
      title: `${product.name} | Votre Boutique`,
      description: seoDescription,
      image: imageUrl,
      type: "product",
      url: `${apiUrl}/${slug}`,
    },
    ldJson: ldJson,
  };
};