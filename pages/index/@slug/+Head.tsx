// pages/index/@slug/+Head.tsx
import { Data } from "./+data";
import { useData } from "vike-react/useData";

export function Head() {
    const { ldJson, canonicalUrl, og_extras, is404 } = useData<Data>();

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
            <meta name="robots" content="index, follow" />
            {/* Données structurées JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
            ></script>
        </>
    );
}