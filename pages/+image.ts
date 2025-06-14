// pages/index/@slug/+image.ts
import type { Data } from './+data';

export default function image(pageContext: { data: Data }) {
    if (!pageContext.data) return ''; // Pas d'image par défaut

    // Utilise l'image principale préparée dans +data.ts
    return pageContext.data.image;
}