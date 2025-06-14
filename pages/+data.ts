// pages/index/@slug/+data.ts  (ou pages/index/+data.ts pour la page d'accueil)

import { dehydrate } from "@tanstack/react-query";
import type { PageContextServer } from "vike/types";
import { get_store } from "../api/user.api"; // Assurez-vous que le chemin est correct
import { createQueryClient } from "../renderer/ReactQueryProvider";
import { createApiInstances } from "../renderer/createApiInstance";


// Exporter le type `Data` est une bonne pratique pour l'utiliser dans les autres fichiers
export type Data = Awaited<ReturnType<typeof data>>;
export { data };

const data = async (pageContext: PageContextServer) => {
    const queryClient = createQueryClient();
    // `slug` est disponible si votre route est dynamique.
    // Si c'est la page d'accueil, vous n'en aurez peut-être pas besoin ici.

    const { api, baseUrl, apiUrl, serverUrl } = createApiInstances(pageContext);

    // 1. Récupérer les informations du magasin (Store)
    const store = await queryClient.fetchQuery({
        queryKey: ["store-info"],
        queryFn: () => get_store(api, serverUrl, apiUrl), // Simplifié si les autres args ne sont pas nécessaires
        staleTime: 24 * 60 * 60 * 1000, // 24 heures, car ces infos changent peu
    });

    // 2. Gérer le cas où le magasin n'est pas trouvé
    if (!store) {
        return {
            is404: true,
            // Ces métadonnées seront utilisées par Vike pour la page 404
            title: "Magasin non trouvé",
            description: "Les informations de ce magasin n'ont pas pu être chargées.",
        };
    }

    // 3. Préparer les données pour le SEO et les métadonnées
    // Vike utilisera ces clés directement si vous créez les fichiers correspondants (+title.ts, etc.)

    const pageTitle = store.title || store.name;
    const seoDescription = store.description
        ? store.description.substring(0, 160).replace(/\s+/g, ' ').trim()
        : `Bienvenue sur ${store.name}. Découvrez nos produits et services.`;

    // Choisir une image pertinente : la couverture en priorité, sinon le logo
    const mainImage = (store.cover_image && store.cover_image[0]) || (store.logo && store.logo[0]) || '';

    const pageUrl = baseUrl; // L'URL canonique de la page d'accueil/du magasin

    // 4. Préparer les données structurées (JSON-LD) pour le SEO
    // Dans votre +data.ts, enrichissez votre ldJson
    const ldJson = {
        "@context": "https://schema.org",
        "@type": "Store", // Plus précis que "Organization"
        "name": store.name,
        "url": pageUrl,
        "logo": store.logo[0] || '',
        "image": mainImage, // L'image principale de la boutique
        "description": seoDescription,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": store.address,
            // Ajoutez ces champs si vous les avez :
            "addressLocality": "Abidjan",
            "postalCode": "22300",
            "addressCountry": "Côte d'Ivoire"
        },
        "geo": { // Google adore ça pour les recherches locales
            "@type": "GeoCoordinates",
            "latitude": store.latitude,
            "longitude": store.longitude
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": store.phone,
            "contactType": "customer service"
        },
        // Liens vers vos réseaux sociaux
        "sameAs": [
            "https://www.facebook.com/votrestore",
            "https://www.twitter.com/votrestore",
            "https://www.instagram.com/votrestore"
        ]
    };

    // 5. Retourner l'objet de données complet
    return {
        store, // On passe l'objet store complet pour l'utiliser dans le composant de la page
        dehydratedState: dehydrate(queryClient),

        // --- Données pour les métadonnées de Vike ---
        title: pageTitle,
        description: seoDescription,
        image: mainImage,
        canonicalUrl: pageUrl,
        ldJson: ldJson,
        // Vous pouvez ajouter d'autres données ici si nécessaire
    };
};