// store/store_description.ts
// Ce fichier contient les informations par défaut sur le store
// Il sera remplacé par un appel au serveur plus tard

export interface StoreDescription {
  name: string;
  tagline?: string;
  description: {
    short: string;
    long: string;
  };
  contact: {
    whatsapp: string;
    email: string;
    address: string;
    city: string;
    country: string;
  };
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    pinterest?: string;
  };
  images: {
    logo: string;
    cover: string;
    gallery: Array<{
      src: string;
      alt: string;
    }>;
  };
  features: string[];
  about: {
    hero: {
      title: string;
      subtitle: string;
      imageUrl: string;
    };
    story: {
      title: string;
      content: string;
      imageUrl: string;
    };
    values: {
      title: string;
      items: Array<{
        icon: string;
        title: string;
        description: string;
      }>;
    };
    team: {
      title: string;
      members: Array<{
        name: string;
        role: string;
        initials: string;
        photo?: string;
      }>;
    };
    cta: {
      title: string;
      buttonText: string;
      buttonLink: string;
    };
  };
}

// Informations par défaut de la boutique "L'atelier des talentueux"
// Boutique de maisons miniatures et jouets pour enfants
export const DEFAULT_STORE_DESCRIPTION: StoreDescription = {
  name: "L'atelier des talentueux",
  tagline: "Maisons miniatures & Ateliers créatifs pour enfants",
  description: {
    short: "Découvrez nos maisons miniatures modulaires de qualité supérieure, conçues pour stimuler l'imagination des enfants et servir de magnifique décoration. Avec nos ateliers, apprenez à monter vos propres meubles et appareils connectés.",
    long: "L'atelier des talentueux est une boutique spécialisée dans les maisons miniatures modulaires de haute qualité. Nos créations sont conçues avec des matériaux de qualité supérieure et des aimants sur chaque côté permettant de superposer et d'accrocher les modules facilement. Chaque module mesure 25x25x25cm et peut être combiné pour créer des maisons uniques. Nous proposons également des poupées articulées noires (homme et femme) pour plus de possibilités de jeu. L'aspect décoratif de nos maisons miniatures en fait des cadeaux parfaits pour les adultes et des objets de décoration élégants. Nous proposons également une version connectée avec une application pour l'électronique, permettant aux enfants d'apprendre tout en s'amusant. Nos ateliers enseignent aux enfants à monter leurs propres meubles et appareils connectés pour leur maison miniature. L'application contient des histoires interactives et une version avec IA interactive est en cours de développement."
  },
  contact: {
    whatsapp: "+225 07 07 61 59 94",
    email: "atelierdestalentueux@gmail.com",
    address: "COCODY JULES VERNES, carrefour lavage JAK",
    city: "Abidjan",
    country: "Côte d'Ivoire"
  },
  social: {
    facebook: "https://m.facebook.com/story.php?story_fbid=pfbid04xFS4iJBcbYxHJfwgMdEEJmGkEaDLKUp94uueV4yP3ePVH6TNGoxehgGQzpAjsrfl&id=61552737639277",
    instagram: "https://m.facebook.com/story.php?story_fbid=pfbid04xFS4iJBcbYxHJfwgMdEEJmGkEaDLKUp94uueV4yP3ePVH6TNGoxehgGQzpAjsrfl&id=61552737639277",
    twitter: "https://m.facebook.com/story.php?story_fbid=pfbid04xFS4iJBcbYxHJfwgMdEEJmGkEaDLKUp94uueV4yP3ePVH6TNGoxehgGQzpAjsrfl&id=61552737639277",
    pinterest: "https://m.facebook.com/story.php?story_fbid=pfbid04xFS4iJBcbYxHJfwgMdEEJmGkEaDLKUp94uueV4yP3ePVH6TNGoxehgGQzpAjsrfl&id=61552737639277"
  },
  images: {
    logo: "https://server.sublymus.com/fs/1jafujten_ph1l0_stores_logo_83ae5502-f986-44f5-a775-b345db97813a.webp",
    cover: "https://server.sublymus.com/fs/1jafujtjm_20hdi0_stores_cover_image_83ae5502-f986-44f5-a775-b345db97813a.webp",
    gallery: [
      {
        src: "https://atelierdtdec2025.netlify.app/atelier%20cuisine_2025-11-12.jpg",
        alt: "Enfants en atelier cuisine"
      },
      {
        src: "https://atelierdtdec2025.netlify.app/salle%20de%20bricolage_2025-11-12.jpg",
        alt: "Enfants en bricolage"
      },
      {
        src: "https://atelierdtdec2025.netlify.app/barrière%20nature_2025-11-12.jpg",
        alt: "Maquette électronique"
      },
      {
        src: "https://atelierdtdec2025.netlify.app/CUISINE.jpg",
        alt: "Cuisine miniature"
      },
      {
        src: "https://atelierdtdec2025.netlify.app/princesse%20avec%20cadeaux_2025-11-22_21-30-57.jpg",
        alt: "Princesse avec cadeaux de Noël et maisons miniatures"
      }
    ]
  },
  features: [
    "Maisons miniatures modulaires de qualité supérieure",
    "Aimants sur chaque côté pour superposer et accrocher facilement",
    "Dimensions : 25x25x25cm par module",
    "Poupées articulées noires (homme et femme) incluses",
    "Matériaux de qualité supérieure",
    "Aspect décoratif - parfait comme cadeau pour adultes",
    "Version connectée avec application pour l'électronique",
    "Ateliers pour apprendre à monter meubles et appareils connectés",
    "Application avec histoires interactives",
    "Version avec IA interactive en cours de développement"
  ],
  about: {
    hero: {
      title: "Des maisons miniatures qui font rêver",
      subtitle: "Découvrez notre univers de créativité, où chaque module devient une pièce d'une maison unique, et où les enfants apprennent en s'amusant.",
      imageUrl: "https://server.sublymus.com/fs/1jafujtjm_20hdi0_stores_cover_image_83ae5502-f986-44f5-a775-b345db97813a.webp"
    },
    story: {
      title: "Notre Histoire",
      content: "L'atelier des talentueux est né de la passion pour l'éducation créative des enfants. Nous avons créé des maisons miniatures modulaires qui permettent aux enfants de construire, imaginer et apprendre. Chaque module est conçu avec soin, utilisant des matériaux de qualité supérieure et des aimants pour faciliter l'assemblage. Nos maisons miniatures ne sont pas seulement des jouets, ce sont aussi de magnifiques objets de décoration qui peuvent être offerts aux adultes. Nous proposons également des ateliers où les enfants apprennent à monter leurs propres meubles et appareils connectés, développant ainsi leurs compétences pratiques et leur créativité. Notre application interactive, avec ses histoires et sa future IA, complète l'expérience éducative et ludique.",
      imageUrl: "https://atelierdtdec2025.netlify.app/atelier%20cuisine_2025-11-12.jpg"
    },
    values: {
      title: "Ce qui nous guide",
      items: [
        {
          icon: "diamond",
          title: "Qualité & Excellence",
          description: "Chaque maison miniature est conçue avec des matériaux de qualité supérieure, garantissant durabilité et esthétique. Nos aimants permettent un assemblage facile et solide."
        },
        {
          icon: "heart",
          title: "Éducation & Créativité",
          description: "Nous croyons en l'apprentissage par le jeu. Nos ateliers et notre application permettent aux enfants de développer leurs compétences tout en s'amusant."
        },
        {
          icon: "handshake",
          title: "Innovation & Technologie",
          description: "Nous combinons tradition et modernité avec nos maisons connectées et notre application interactive, préparant les enfants au monde de demain."
        }
      ]
    },
    team: {
      title: "L'Équipe",
      members: [
        {
          name: "Mr. Noga",
          role: "Ingénierie et Process",
          initials: "N",
          photo: "https://yt3.ggpht.com/0lZUfVz29azypmB7KOTDA_GCNkeH2QwqqtomAEPHRPj9zITQ9J-W004LtXID-TbHj3HbOKBz=s108-c-k-c0x00ffffff-no-rj"
        },
        {
          name: "Mm. Camara",
          role: "Déco et Marketing",
          initials: "C",
          photo: "https://scontent.fabj5-2.fna.fbcdn.net/v/t39.30808-1/586927749_122233704080091254_4846865017746000356_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=107&ccb=1-7&_nc_sid=2d3e12&_nc_eui2=AeE14xUzKw-EOk5hWa1cEDXmitQ9jWR3MWyK1D2NZHcxbC7xpvdtFxvjecj0V28Czq_MXLTPlNIbAb4VCQssoWnr&_nc_ohc=8ZkwKBXEQWQQ7kNvwFXsxTC&_nc_oc=Adkoz1SYOvKet7eoB9XRwGr3zCEx5D6Rrd65zKKAxzotFT2AMaudvJXKUai00p98znQ&_nc_zt=24&_nc_ht=scontent.fabj5-2.fna&_nc_gid=q3Lup8iIA-NztgboitfbbQ&oh=00_Afg9pg0XeKrpQlnOrlKwRe4XNuyUh8iiP5Yptu9wyuihbQ&oe=69307F68"
        }
      ]
    },
    cta: {
      title: "Prêt(e) à créer votre maison miniature ?",
      buttonText: "Découvrir nos collections",
      buttonLink: "/"
    }
  }
};

// Fonction pour obtenir la description du store
// Cette fonction sera remplacée par un appel API plus tard
export function getStoreDescription(): StoreDescription {
  // TODO: Remplacer par un appel API
  return DEFAULT_STORE_DESCRIPTION;
}

