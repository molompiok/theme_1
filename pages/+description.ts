// pages/index/@slug/+description.ts
import type { Data } from './+data';

export default function description(pageContext: { data: Data }) {
    if (!pageContext.data) return "Découvrez notre magasin en ligne.";

    // Utilise la description préparée dans +data.ts
    return pageContext.data.description;
}