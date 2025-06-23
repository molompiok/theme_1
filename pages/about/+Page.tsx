import React from "react";

// Les interfaces (definitions de type) restent les mêmes
interface HeroSection {
  title: string;
  subtitle: string;
  imageUrl: string;
}

interface StorySection {
  title: string;
  content: string;
  imageUrl: string;
}

interface ValueItem {
  icon: string;
  title: string;
  description: string;
}

interface ValuesSection {
  title: string;
  items: ValueItem[];
}

interface TeamMember {
  name: string;
  role: string;
  initials: string;
}

interface TeamSection {
  title: string;
  members: TeamMember[];
}

interface CtaSection {
  title: string;
  buttonText: string;
  buttonLink: string;
}

export interface AboutPageData {
  hero: HeroSection;
  story: StorySection;
  values: ValuesSection;
  team: TeamSection;
  cta: CtaSection;
}


// Le composant Icon est modifié pour utiliser des symboles plus évocateurs
const Icon = ({ name }: { name: string }) => {
  const iconMap: { [key: string]: string } = {
    handshake: "🤝", // Engagement
    diamond: "💎",   // Excellence / Qualité
    heart: "❤️",      // Client / Famille
  };
  return (
    <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-3xl mb-6 shadow-lg">
      {iconMap[name] || "❓"}
    </div>
  );
};

const TeamMemberCard = ({ member }: { member: TeamMember }) => {
  return (
    <div className="group text-center">
      <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full bg-gradient-to-br from-gray-900 to-gray-600 flex items-center justify-center shadow-2xl mb-6 transition-all duration-300 group-hover:scale-110 group-hover:shadow-3xl border-4 border-transparent group-hover:border-white">
        <span className="text-white text-3xl md:text-4xl font-bold tracking-wider">
          {member.initials}
        </span>
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-black mb-2 transition-colors duration-300 group-hover:text-gray-700">{member.name}</h3>
      <p className="text-gray-600 font-medium">{member.role}</p>
    </div>
  );
};

export default function Page() {
  // =======================================================================
  // DÉBUT DE LA SECTION ADAPTÉE ET AMÉLIORÉE
  // =======================================================================
  const data: AboutPageData = {
    hero: {
      // Titre plus personnel et ancré localement
      title: "Notre histoire, tissée à Abidjan.",
      // Sous-titre qui évoque la notion de "famille"
      subtitle:
        "Découvrez ce qui nous anime, notre vision et la famille derrière la marque.",
      imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c7da?auto=format&fit=crop&w=1920&q=80", // Image plus axée sur l'humain et la collaboration
    },
    story: {
      // Titre plus narratif
      title: "L'Aventure a Commencé Ici",
      // Histoire relocalisée, plus authentique et inspirante pour le marché ivoirien
      content:
        "Tout a démarré en 2021, non pas dans un garage, mais au cœur de l'effervescence de Treichville. Portés par un rêve simple : offrir à nos frères et sœurs des produits d'une qualité irréprochable, qui racontent une histoire. De quelques croquis partagés entre amis, nous avons bâti une marque qui fait la fierté de notre communauté. Aujourd'hui, nous servons tout Abidjan et la Côte d'Ivoire, en restant fidèles à notre esprit d'origine : l'authenticité, la passion et le partage.",
      imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=1920&q=80",
    },
    values: {
      // Titre plus chaleureux
      title: "Ce qui nous guide au quotidien",
      items: [
        {
          // Valeur plus forte et mémorable
          icon: "diamond",
          title: "L'Excellence, notre Gri-Gri",
          description:
            "Chaque article est une promesse. Nous y mettons tout notre savoir-faire pour une qualité et une finition qui font la différence.",
        },
        {
          // Valeur qui met l'accent sur la communauté
          icon: "heart",
          title: "Le Client est Roi, la Famille d'abord",
          description:
            "Votre sourire est notre plus grande récompense. Chez nous, vous n'êtes pas un simple client, vous faites partie de la famille.",
        },
        {
          // Valeur qui parle de responsabilité et d'impact local
          icon: "handshake",
          title: "Engagement Local & Responsable",
          description:
            "Nous sommes fiers de nos racines. Nous privilégions les talents d'ici et agissons pour avoir un impact positif sur notre environnement.",
        },
      ],
    },
    team: {
      // Titre plus valorisant
      title: "Le Cœur de l'Entreprise",
      members: [
        {
          name: "Kouassi Noga Wilfried", // Fondateur mis en avant
          role: "Fondateur & Visionnaire",
          initials: "KNW",
        },
        {
          name: "Messah Komlan Siméon",
          role: "Directeur des Opérations",
          initials: "MKS",
        },
        {
          name: "Kossonou Jean Eudes",
          role: "Responsable Marketing & Communauté",
          initials: "KJE",
        },
      ],
    },
    cta: {
      // Appel à l'action plus inclusif
      title: "Prêt(e) à faire partie de notre histoire ?",
      // Texte du bouton plus artisanal et premium
      buttonText: "Explorer nos créations",
      buttonLink: "/produits",
    },
  };
  // =======================================================================
  // FIN DE LA SECTION ADAPTÉE
  // =======================================================================


  return (
    <div className="bg-white text-gray-900 font-sans">
      {/* Section Héros */}
      <section className="relative h-screen min-h-[600px] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black">
          <img
            src={data.hero.imageUrl}
            alt="Équipe créative en discussion"
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 z-10">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
              {data.hero.title}
            </h1>
            <p className="text-xl md:text-2xl font-light opacity-90 max-w-2xl mx-auto leading-relaxed">
              {data.hero.subtitle}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Section Notre Histoire */}
      <section className="py-24 lg:py-32 relative bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="space-y-8">
              <div>
                <div className="w-20 h-1 bg-black mb-8"></div>
                <h2 className="text-4xl lg:text-5xl font-black mb-8 leading-tight">
                  {data.story.title}
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg font-light">
                {data.story.content}
              </p>
            </div>
            <div className="relative order-first lg:order-last">
              <div className="absolute -inset-4 bg-gradient-to-r from-gray-900 to-black rounded-2xl transform rotate-3 transition-transform duration-500 group-hover:rotate-1"></div>
              <img
                src={data.story.imageUrl}
                alt="Atelier de création"
                className="relative rounded-2xl shadow-2xl w-full h-auto grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section Nos Valeurs */}
      <section className="bg-gray-50 py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="w-20 h-1 bg-black mx-auto mb-8"></div>
            <h2 className="text-4xl lg:text-5xl font-black mb-8">
              {data.values.title}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {data.values.items.map((value, index) => (
              <div
                key={value.title}
                className="text-center group"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex justify-center transition-transform duration-300 group-hover:scale-110">
                  <Icon name={value.icon} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-black">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed font-light">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Équipe */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="w-20 h-1 bg-black mx-auto mb-8"></div>
            <h2 className="text-4xl lg:text-5xl font-black mb-8">
              {data.team.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-16 gap-x-8 lg:gap-16 max-w-5xl mx-auto">
            {data.team.members.map((member) => (
              <TeamMemberCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* Section Call to Action */}
      <section className="bg-black text-white py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-black to-gray-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/subtle-carbon.png')] opacity-10"></div>
        <div className="container mx-auto px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-black mb-8 leading-tight">
            {data.cta.title}
          </h2>
          <a
            href={data.cta.buttonLink}
            className="inline-block bg-white text-black font-bold py-4 px-12 text-lg rounded-md hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-gray-400"
          >
            {data.cta.buttonText}
          </a>
        </div>
      </section>
    </div>
  );
}