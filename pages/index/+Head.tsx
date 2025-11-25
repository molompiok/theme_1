// pages/index/+Head.tsx
import React from 'react';
import type { Data } from './+data';

export default function Head({ data }: { data: Data }) {
  // Ne rien rendre si les données ne sont pas prêtes (cas d'erreur)
  if (!data) return null;

  const { store, canonicalUrl } = data;

  return (
    <>
      {/* Favicons */}
      {store?.favicon?.map((fav, index) => {
        const favUrl = typeof fav === 'string' ? fav : '';
        return favUrl ? <link key={index} rel="icon" href={favUrl} /> : null;
      })}

      {/* Lien canonique */}
      <link rel="canonical" href={canonicalUrl} />

      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="Content-Language" content="fr" />
      <meta name="robots" content="index, follow" />
      <meta name="application-name" content={store?.name} />

      <meta property="og:locale" content="fr_FR" />

      {/* Métadonnées Open Graph */}
      {data.title && <meta property="og:title" content={data.title} />}
      {data.description && <meta property="og:description" content={data.description} />}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={store?.name} />
      
      {/* S'assurer que l'image Open Graph est bien définie */}
      {data.image && (
        <>
          <meta property="og:image" content={data.image} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:type" content="image/jpeg" />
          <meta property="og:image:secure_url" content={data.image} />
        </>
      )}

      {/* Métadonnées Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      {data.title && <meta name="twitter:title" content={data.title} />}
      {data.description && <meta name="twitter:description" content={data.description} />}
      {data.image && (
        <meta name="twitter:image" content={data.image} />
      )}
    </>
  );
}

