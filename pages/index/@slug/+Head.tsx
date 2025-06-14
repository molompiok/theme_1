import { Data } from "./+data";
import { useData } from "vike-react/useData";

export function Head() {
    // Vike gère déjà title, description, image, og:title, etc.
    // On récupère juste ce qui reste à faire.
    const { ldJson, canonicalUrl, og_extras, is404 } = useData<Data>();

    if (is404) {
        return <meta name="robots" content="noindex, nofollow" />;
    }

    if (!ldJson || !canonicalUrl || !og_extras) {
        return null; // Sécurité si les données ne sont pas là
    }

    return (
        <>
            {/* 
              PLUS BESOIN DE METTRE :
              - <title>
              - <meta name="description">
              - <meta property="og:title">
              - <meta property="og:description">
              - <meta property="og:image">
              - <meta name="twitter:...">
              VIKE S'EN OCCUPE !
            */}

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