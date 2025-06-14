// pages/index/@slug/+title.ts
import type { Data } from './+data';

export default function title(pageContext: { data: Data }) {
    // En cas d'erreur ou de 404, pageContext.data peut être undefined
    if (!pageContext.data) return "Magasin";

    // Utilise le titre préparé dans +data.ts
    return pageContext.data.title;
}