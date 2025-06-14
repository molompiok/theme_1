// pages/index/@slug/+Head.tsx
import React from 'react';
import type { Data } from './+data';

export default function Head({ data }: { data: Data }) {
  // Ne rien rendre si les données ne sont pas prêtes (cas d'erreur)
  if (!data) return null;

  const { store, canonicalUrl, ldJson } = data;

  return (
    <>
      {/* Favicons (exemple) */}
      {store?.favicon?.map(fav => (
        <link key={fav} rel="icon" href={fav} />
      ))}

      {/* Lien canonique */}
      <link rel="canonical" href={canonicalUrl} />

      // Dans votre +Head.tsx
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {/* Spécifie la langue de la page, très important pour le SEO */}
      <meta http-equiv="Content-Language" content="fr" />
      {/* Indique aux robots d'indexer la page et de suivre les liens. C'est le défaut, mais être explicite est une bonne pratique. */}
      <meta name="robots" content="index, follow" />
      {/* Le nom de votre marque/application */}
      <meta name="application-name" content={store?.name} />

      <meta property="og:locale" content="fr_FR" />

      {/* Métadonnées Open Graph (Facebook, LinkedIn, etc.) */}
      {/* Vike gère déjà og:title, og:description, og:image via les fichiers +title, +description, +image */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={store?.name} />

      {/* Métadonnées Twitter Card */}
      {/* Vike gère déjà twitter:title, twitter:description, twitter:image */}
      <meta name="twitter:card" content="summary_large_image" />

      {/* Données structurées JSON-LD pour Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
      />
    </>
  );
}