// pages/index/+description.ts
import type { Data } from './+data';

export default function description(pageContext: { data: Data }) {
    if (!pageContext.data) return "Découvrez notre magasin en ligne.";
    return pageContext.data.description;
}

