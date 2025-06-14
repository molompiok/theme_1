// /pages/categorie/@slug/+Head.tsx
import type { Data } from "./+data";
import { useData } from "vike-react/useData";

export function Head() {
    const { og, canonicalUrl, ldJson, is404, description } = useData<Data>();

    // Pour les pages 404
    if (is404) {
        return (
            <>
                <meta name="description" content={description} />
                <meta name="robots" content="noindex, nofollow" />
            </>
        );
    }

    // Si les données ne sont pas prêtes
    if (!og) return null;

    return (
        <>
            {/* Les balises gérées ici sont celles pour le SEO et le partage, qui n'ont pas besoin de changer côté client */}
            <meta name="description" content={description} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph */}
            <meta property="og:title" content={og.title} />
            <meta property="og:description" content={og.description} />
            <meta property="og:image" content={og.image} />
            <meta property="og:url" content={og.url} />
            <meta property="og:type" content={og.type} />
            <meta property="og:site_name" content="Le Nom De Votre Boutique" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={og.title} />
            <meta name="twitter:description" content={og.description} />
            <meta name="twitter:image" content={og.image} />

            {/* Robots */}
            <meta name="robots" content="index, follow" />

            {/* Données structurées JSON-LD */}
            {ldJson && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
                ></script>
            )}
        </>
    );
}
