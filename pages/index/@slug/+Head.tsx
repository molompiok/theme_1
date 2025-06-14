// /pages/index/@slug/+Head.tsx
import { Data } from "./+data";
import { useData } from "vike-react/useData";

export function Head() {
    const { og, canonicalUrl, ldJson, is404, description } = useData<Data>();

    if (is404) {
        return (
            <>
                <meta name="description" content={description} />
                <meta name="robots" content="noindex, nofollow" />
            </>
        );
    }

    if (!og) return null;

    return (
        <>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph (pour Facebook, etc.) */}
            <meta property="og:title" content={og.title} />
            <meta property="og:description" content={og.description} />
            <meta property="og:image" content={og.image} />
            <meta property="og:url" content={og.url} />
            <meta property="og:type" content={og.type} />
            <meta property="og:site_name" content="Le Nom De Votre Boutique" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={og.title} />
            <meta name="twitter:description" content={og.description} />
            <meta name="twitter:image" content={og.image} />

            {/* Robots */}
            <meta name="robots" content="index, follow" />

            {/* Données structurées JSON-LD pour le produit */}
            {ldJson && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
                ></script>
            )}
        </>
    );
}
