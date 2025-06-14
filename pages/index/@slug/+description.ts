// pages/index/@slug/+description.ts
import type { PageContext } from 'vike/types';
import type { Data } from './+data';

export default function description(pageContext: PageContext<Data>) {
    if (pageContext.data.is404) {
        return "Le produit que vous cherchez n'existe pas ou plus.";
    }

    // On utilise la description courte du produit
    return pageContext.data.description || `Découvrez ${pageContext.data.product?.name} et bien plus sur notre boutique.`;
}