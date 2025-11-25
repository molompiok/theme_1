// pages/index/@slug/+Head.tsx
import { Data } from "./+data";
import { useData } from "vike-react/useData";

export function Head() {
    const { ldJson, canonicalUrl, og_extras, is404, image } = useData<Data>();

    if (is404) {
        return <meta name="robots" content="noindex, nofollow" />;
    }

    if (!ldJson || !canonicalUrl || !og_extras) {
        return null; // Sécurité si les données ne sont pas là
    }

    return (
        <>
            {/* Ce que Vike ne fait pas automatiquement : */}
            <link rel="canonical" href={canonicalUrl} />
            <meta property="og:url" content={og_extras.url} />
            <meta property="og:type" content={og_extras.type} />
            <meta property="og:site_name" content={og_extras.site_name} />
            
            {/* S'assurer que l'image Open Graph est bien définie */}
            {image && (
                <>
                    <meta property="og:image" content={image} />
                    <meta property="og:image:width" content="1200" />
                    <meta property="og:image:height" content="630" />
                    <meta property="og:image:type" content="image/jpeg" />
                </>
            )}
            
            {/* Meta tags Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            {image && (
                <meta name="twitter:image" content={image} />
            )}
            
            <meta name="robots" content="index, follow" />
            {/* Données structurées JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
            ></script>
        </>
    );
}