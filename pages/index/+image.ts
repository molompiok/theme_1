// pages/index/+image.ts
import type { Data } from './+data';

export default function image(pageContext: { data: Data }) {
    if (!pageContext.data) return '';
    return pageContext.data.image;
}

