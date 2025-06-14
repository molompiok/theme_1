// pages/index/@slug/+title.ts
import type { PageContext } from 'vike/types';
import type { Data } from './+data';

// Cette fonction sera appelée par Vike pour définir le titre
export default function title(pageContext: PageContext<Data>) {
    // Si on est sur une page 404, on utilise le titre d'erreur
    if (pageContext.data.is404) {
        return "Produit non trouvé";
    }

    // Sinon, on construit le titre à partir du nom du produit
    const productName = pageContext.data.product?.name || "Détails du produit";
    return `${productName} | Votre Boutique`;
}