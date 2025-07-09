// pages/index/@slug/+image.ts
import type { PageContext } from 'vike/types';
import type { Data } from './+data';

export default function image(pageContext: PageContext<Data>) {
    if (pageContext.data.is404) {
        // Utilisez une image par défaut relative ou une URL complète déjà connue
        return '/default-image.jpg';
    }

    // pageContext.data.image est déjà construit dans +data.ts
    return pageContext.data.image;
}