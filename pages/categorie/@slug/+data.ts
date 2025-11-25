//pages/categories/@slug/+data.ts

export { data };
export type Data = Awaited<ReturnType<typeof data>>;

import { dehydrate } from "@tanstack/react-query";
import { PageContextServer } from "vike/types";
import { get_filters, get_products } from "../../../api/products.api";
import { createApiInstances } from "../../../renderer/createApiInstance";
import { createQueryClient } from "../../../renderer/ReactQueryProvider";

const data = async (pageContext: PageContextServer) => {
  const queryClient = createQueryClient();
  const slug = pageContext.routeParams!.slug;
  const queryParams = pageContext.urlParsed.search; // Pour la pagination, filtres, etc.
  const { api, apiUrl, serverApiUrl, storeInfo } = await createApiInstances(pageContext);

  // Utiliser fetchQuery est souvent plus simple que prefetch + ensure
  const productData = await queryClient.fetchQuery({
    queryKey: ["get_products", { slug_cat: slug, ...queryParams }],
    queryFn: () => get_products({ slug_cat: slug, ...queryParams }, api),
  });

  // La catégorie est probablement retournée avec les produits
  const category = productData?.category;

  // Si la catégorie n'existe pas, on peut gérer une page 404
  if (!category) {
    return {
      is404: true,
      title: "Catégorie non trouvée",
      description: "La catégorie que vous cherchez n'existe pas.",
    };
  }

  // Pré-chargement des filtres
  await queryClient.fetchQuery({
    queryKey: ["get_filters", { slug: slug }],
    queryFn: () => get_filters({ slug: slug }, api),
  });

  // Préparation des données pour le SEO
  const title = `${category.name} | Votre Boutique`;
  const description = category.description
    ? category.description.substring(0, 160)
    : `Découvrez notre sélection de produits dans la catégorie ${category.name}. Les meilleurs articles au meilleur prix.`;

  // Construire l'URL absolue de l'image pour les réseaux sociaux
  let imageUrl = '';
  if (category.view?.[0]) {
    const categoryImage = category.view[0];
    if (categoryImage.startsWith('http://') || categoryImage.startsWith('https://')) {
      imageUrl = categoryImage;
    } else {
      // Utiliser serverApiUrl (s_server) pour servir les fichiers
      imageUrl = `${serverApiUrl}${categoryImage.startsWith('/') ? '' : '/'}${categoryImage}`;
    }
  } else {
    // Image par défaut : utiliser le logo du store
    const store = storeInfo.storeInfoInitial;
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
    } else {
      imageUrl = `${serverApiUrl}/default-category-image.jpg`;
    }
  }
  
  // Construire l'URL canonique absolue
  let canonicalUrl = `${apiUrl}/categories/${slug}`;
  const headers = pageContext.headers || {};
  const serverUrl = headers['x-server-url'] || '';
  if (serverUrl && !canonicalUrl.startsWith('http://') && !canonicalUrl.startsWith('https://')) {
    canonicalUrl = `${serverUrl}/categories/${slug}`;
  } else if (!canonicalUrl.startsWith('http://') && !canonicalUrl.startsWith('https://')) {
    const store = storeInfo.storeInfoInitial;
    canonicalUrl = store.default_domain ? `https://${store.default_domain}/categories/${slug}` : canonicalUrl;
  }

  // Données structurées pour les "fils d'Ariane" (Breadcrumbs), très bon pour le SEO des catégories
  const ldJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Accueil",
      "item": apiUrl
    }, {
      "@type": "ListItem",
      "position": 2,
      "name": category.name,
      "item": canonicalUrl
    }]
  };

  return {
    // Données pour le composant React
    dehydratedState: dehydrate(queryClient),
    category: category, // Passer l'objet catégorie entier est plus propre

    // // Données pour le <head> (utilisées par +head.ts)
    title: title,
    description: description,
    canonicalUrl: canonicalUrl,
    og: {
      title: title,
      description: description,
      image: imageUrl,
      type: "website", // ou 'product.group'
      url: canonicalUrl,
    },
    ldJson: ldJson,
  };
};