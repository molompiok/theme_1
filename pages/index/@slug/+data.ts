//pages/index/@slug/+data.ts
export { data };
export type Data = Awaited<ReturnType<typeof data>>;

import { dehydrate } from "@tanstack/react-query";
import { PageContextServer } from "vike/types";
import { get_features_with_values, get_products } from "../../../api/products.api";
import { getFirstFeatureWithView } from "../../../utils"; // Assurez-vous que le chemin est correct
import { createQueryClient } from "../../../renderer/ReactQueryProvider";
import { createApiInstances } from "../../../renderer/createApiInstance";

// ... (imports)

const data = async (pageContext: PageContextServer) => {
  const queryClient = createQueryClient();
  const slug = pageContext.routeParams!.slug;
  const { api, baseUrl } = createApiInstances(pageContext); // Je garde vos variables

  const productData = await queryClient.fetchQuery({
    queryKey: ["get_product_by_slug", slug],
    queryFn: () => get_products({ slug_product: slug }, api),
  });

  const product = productData?.list?.[0];

  if (!product) {
    return {
      is404: true,
      title: "Produit non trouvé", // Vike utilisera ça pour la page 404
      description: "Le produit que vous cherchez n'existe pas ou plus.",
    };
  }

  const features = await queryClient.fetchQuery({
    queryKey: ["get_features_with_values", product.id],
    queryFn: () => get_features_with_values({ product_id: product.id }, api),
  });

  const mainImage = getFirstFeatureWithView(features || [])?.values[0]?.views[0];

  let imageUrl = `${baseUrl}/default-product-image.jpg`; // Image par défaut

  if (mainImage) {
    // Si l'URL de l'image est déjà absolue (commence par http), on l'utilise telle quelle.
    // Sinon, on la préfixe avec serverUrl.
    if (mainImage.startsWith('http') || mainImage.startsWith('https')) {
      imageUrl = mainImage;
    } else {
      imageUrl = `${baseUrl}${mainImage}`; // Pour les images relatives comme '/uploads/...'
    }
  }

  const seoDescription = product.description
    ? product.description.substring(0, 160).replace(/\s+/g, ' ').trim()
    : `Découvrez ${product.name}. Achetez maintenant sur notre boutique.`;

  const pageUrl = `${baseUrl}/${slug}`; // L'URL publique de la page

  const ldJson = {
    // ... (votre JSON-LD est bon, gardez-le)
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: imageUrl,
    description: seoDescription,
    sku: product.id,
    brand: { "@type": "Brand", name: "Le Nom De Votre Boutique" },
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: product.price,
      availability: "https://schema.org/InStock",
      url: pageUrl,
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
    product,
    dehydratedState: dehydrate(queryClient),
    ldJson,
    slug,

    // --- C'EST LA PARTIE LA PLUS IMPORTANTE ---
    // On donne ces clés à Vike pour qu'il génère les balises automatiquement
    // title: `${product.name} | Votre Boutique`,
    description: seoDescription,
    image: imageUrl, // Pour og:image et twitter:image

    // On passe uniquement les informations que Vike ne peut pas deviner
    canonicalUrl: pageUrl,
    og_extras: { // J'ai renommé en og_extras pour éviter la confusion
      type: "product",
      site_name: "Le Nom De Votre Boutique",
      url: pageUrl
    }
  };
};