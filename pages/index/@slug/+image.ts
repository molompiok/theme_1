// pages/index/@slug/+image.ts
import type { PageContext } from 'vike/types';
import type { Data } from './+data';
import { createApiInstances } from '../../../renderer/createApiInstance';

// Cette fonction sera appelée par Vike pour définir l'image de la page
export default async function image(pageContext: PageContext<Data>) {
    // Si la page est en 404, on peut retourner une image par défaut ou null
    const { baseUrl } = await createApiInstances(pageContext);
    if (pageContext.data.is404) {
        // Retourne l'URL ABSOLUE d'une image générique pour les erreurs
        return `${baseUrl}/default-image.jpg`;
    }

    // On retourne l'URL de l'image principale du produit
    // pageContext.data.image est déjà construit correctement dans +data.ts
    return pageContext.data.image;
}