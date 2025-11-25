//pages/index/@slug/+data.ts
export { data };
export type Data = Awaited<ReturnType<typeof data>>;

import { dehydrate } from "@tanstack/react-query";
import { PageContextServer } from "vike/types";
import { get_features_with_values, get_products } from "../../../api/products.api";
import { getFirstFeatureWithView } from "../../../utils"; // Assurez-vous que le chemin est correct
import { createQueryClient } from "../../../renderer/ReactQueryProvider";
import { createApiInstances } from "../../../renderer/createApiInstance";


const data = async (pageContext: PageContextServer) => {
  const queryClient = createQueryClient();
  const slug = pageContext.routeParams!.slug;
  const { api, baseUrl, storeInfo, apiUrl, serverApiUrl } = await createApiInstances(pageContext); // Je garde vos variables

  const productData = await queryClient.fetchQuery({
    queryKey: ["get_product_by_slug", slug],
    queryFn: () => get_products({ slug_product: slug }, api),
    staleTime: 1 * 60 * 60 * 1000, // 24 heures, car ces infos changent peu
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

  const store = storeInfo.storeInfoInitial;
  const mainImage = getFirstFeatureWithView(features || [])?.values[0]?.views[0];

  // Construire l'URL absolue de l'image pour les réseaux sociaux
  let imageUrl = '';
  if (mainImage) {
    // Si l'URL de l'image est déjà absolue (commence par http), on l'utilise telle quelle.
    if (mainImage.startsWith('http://') || mainImage.startsWith('https://')) {
      imageUrl = mainImage;
    } else {
      // Pour les images relatives, utiliser l'URL de l'API du store
      imageUrl = `${apiUrl}${mainImage.startsWith('/') ? '' : '/'}${mainImage}`;
    }
  } else {
    // Image par défaut : utiliser le logo du store
    const coverImage = store.cover_image && store.cover_image[0] && typeof store.cover_image[0] === 'string' ? store.cover_image[0] : null;
    const logoImage = store.logo && store.logo[0] && typeof store.logo[0] === 'string' ? store.logo[0] : null;
    const storeImage = coverImage || logoImage;
    if (storeImage && typeof storeImage === 'string') {
      if (storeImage.startsWith('http://') || storeImage.startsWith('https://')) {
        imageUrl = storeImage;
      } else {
        // Utiliser serverApiUrl (s_server) pour servir les fichiers
        imageUrl = `${serverApiUrl}${storeImage.startsWith('/') ? '' : '/'}${storeImage}`;
      }
    }
  }

  const seoDescription = product.description
    ? product.description.substring(0, 160).replace(/\s+/g, ' ').trim()
    : `Découvrez ${product.name}. Achetez maintenant sur  ${store.name}.`;

  // Construire l'URL canonique absolue
  let pageUrl = `${baseUrl}/${slug}`;
  if (!pageUrl.startsWith('http://') && !pageUrl.startsWith('https://')) {
    const headers = pageContext.headers || {};
    const serverUrl = headers['x-server-url'] || '';
    if (serverUrl) {
      pageUrl = `${serverUrl}${baseUrl === '/' ? '' : baseUrl}/${slug}`;
    } else {
      // Fallback: utiliser l'URL par défaut du store
      pageUrl = store.default_domain ? `https://${store.default_domain}/${slug}` : pageUrl;
    }
  }

  const ldJson = {
    // ... (votre JSON-LD est bon, gardez-le)
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: imageUrl,
    description: seoDescription,
    sku: product.id,
    brand: { "@type": "Brand", name: store.name },
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

    description: seoDescription,
    image: imageUrl, // Pour og:image et twitter:image
    store_name: store.name,

    // On passe uniquement les informations que Vike ne peut pas deviner
    canonicalUrl: pageUrl,
    og_extras: { // J'ai renommé en og_extras pour éviter la confusion
      type: "product",
      site_name: store.name,
      url: pageUrl
    }
  };
};