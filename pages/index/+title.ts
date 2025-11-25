// pages/index/+title.ts
import type { Data } from './+data';

export default function title(pageContext: { data: Data }) {
    if (!pageContext.data) return "Magasin";
    return pageContext.data.title;
}

