// https://vike.dev/data
export { data }
export type Data = Awaited<ReturnType<typeof data>>
import { dehydrate } from "@tanstack/react-query"
import { get_filters, get_products } from "../../api/products.api";
import { PageContextServer } from "vike/types";
import { get_categories } from "../../api/categories.api";
import { createQueryClient } from "../../renderer/ReactQueryProvider";
import { createApiInstances } from "../../renderer/createApiInstance";



const data = async (pageContext: PageContextServer) => {
  // const search = pageContext.urlParsed.searchAll;
  const queryClient = createQueryClient()
  const { api, baseUrl, apiUrl, serverApiUrl, storeInfo } = await createApiInstances(pageContext);
  
  await queryClient.prefetchQuery({
    queryKey: ["get_filters"],
    queryFn: () => get_filters({}, api),
  });
  await queryClient.prefetchQuery({ queryKey: ['get_products'], queryFn: () => get_products({}, api) })
  await queryClient.prefetchQuery({ queryKey: ['get_categories'], queryFn: () => get_categories({}, api) })
  
  // Récupérer les données du store pour les meta tags
  const store = storeInfo.storeInfoInitial;
  
  if (!store) {
    return {
      dehydratedState: dehydrate(queryClient),
      title: 'page produit',
      description: 'Découvrez nos produits',
      image: '',
    };
  }

  const pageTitle = store.title || store.name;
  const seoDescription = store.description
    ? store.description.substring(0, 160).replace(/\s+/g, ' ').trim()
    : `Bienvenue sur ${store.name}. Découvrez nos produits et services.`;

  // Choisir une image pertinente : la couverture en priorité, sinon le logo
  const coverImage = store.cover_image && store.cover_image[0] && typeof store.cover_image[0] === 'string' ? store.cover_image[0] : null;
  const logoImage = store.logo && store.logo[0] && typeof store.logo[0] === 'string' ? store.logo[0] : null;
  let mainImage = coverImage || logoImage || '';
  
  if (mainImage && typeof mainImage === 'string' && !mainImage.startsWith('http://') && !mainImage.startsWith('https://')) {
    // Si l'image est relative, la préfixer avec l'URL de s_server (qui sert les fichiers)
    // S'assurer que serverApiUrl utilise le bon protocole
    const isProd = process.env.NODE_ENV === "production";
    const protocol = isProd ? "https://" : "http://";
    let finalServerApiUrl = serverApiUrl;
    // Si serverApiUrl ne commence pas par http/https, ajouter le protocole approprié
    if (!finalServerApiUrl.startsWith('http://') && !finalServerApiUrl.startsWith('https://')) {
      finalServerApiUrl = `${protocol}${finalServerApiUrl.replace(/^\/\//, '')}`;
    } else if (isProd && finalServerApiUrl.startsWith('http://')) {
      // En production, forcer https si http est utilisé
      finalServerApiUrl = finalServerApiUrl.replace('http://', 'https://');
    }
    mainImage = `${finalServerApiUrl}${mainImage.startsWith('/') ? '' : '/'}${mainImage}`;
  }

  // Construire l'URL canonique absolue
  let pageUrl = baseUrl;
  if (!pageUrl.startsWith('http://') && !pageUrl.startsWith('https://')) {
    const headers = pageContext.headers || {};
    const serverUrl = headers['x-server-url'] || '';
    if (serverUrl) {
      pageUrl = `${serverUrl}${baseUrl === '/' ? '' : baseUrl}`;
    } else {
      pageUrl = store.default_domain ? `https://${store.default_domain}` : baseUrl;
    }
  }

  return {
    dehydratedState: dehydrate(queryClient),
    store,
    title: pageTitle,
    description: seoDescription,
    image: mainImage,
    canonicalUrl: pageUrl,
  }
}


