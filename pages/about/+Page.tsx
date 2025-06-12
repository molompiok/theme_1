import React from "react";
import { Link } from "../../component/Link";

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
  icon: string; // ou un type plus complexe si vous utilisez une lib d'icônes
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
  imageUrl: string;
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

const Icon = ({ name }: { name: string }) => {
  // Remplacez ceci par votre logique d'icônes (ex: Heroicons, FontAwesome)
  const iconMap: { [key: string]: string } = {
    leaf: "🌿",
    sparkles: "✨",
    users: "👥",
  };
  return <span className="text-4xl mb-4">{iconMap[name] || "❓"}</span>;
};

export default function Page() {
  const data: AboutPageData = {
    hero: {
      title: "Plus qu'une boutique, une passion.",
      subtitle:
        "Découvrez l'histoire et les valeurs qui animent notre marque chaque jour.",
      imageUrl:
        "https://images.unsplash.com/photo-1556742502-ec7c0e2f34b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    },
    story: {
      title: "Notre Histoire",
      content:
        "Tout a commencé en 2021 dans un petit garage, avec une simple idée : rendre les produits de haute qualité accessibles à tous. Animés par la passion de l'artisanat et l'amour du design, nous avons lancé notre première collection. Aujourd'hui, nous sommes fiers de servir des milliers de clients satisfaits à travers le monde, tout en restant fidèles à nos racines et à notre mission initiale.",
      imageUrl:
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    values: {
      title: "Nos Valeurs Fondamentales",
      items: [
        {
          icon: "leaf",
          title: "Durabilité",
          description:
            "Nous nous engageons à utiliser des matériaux éco-responsables et à minimiser notre empreinte carbone.",
        },
        {
          icon: "sparkles",
          title: "Qualité Exceptionnelle",
          description:
            "Chaque produit est conçu avec le plus grand soin pour garantir une qualité et une durabilité irréprochables.",
        },
        {
          icon: "users",
          title: "Satisfaction Client",
          description:
            "Votre bonheur est notre priorité. Notre équipe est toujours là pour vous accompagner.",
        },
      ],
    },
    team: {
      title: "Rencontrez l'Équipe",
      members: [
        {
          name: "Alice Dubois",
          role: "Fondatrice & CEO",
          imageUrl:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
        },
        {
          name: "Marc Petit",
          role: "Directeur des Opérations",
          imageUrl:
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80",
        },
        {
          name: "Chloé Martin",
          role: "Responsable Marketing",
          imageUrl:
            "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
        },
      ],
    },
    cta: {
      title: "Prêt à nous rejoindre dans l'aventure ?",
      buttonText: "Découvrir nos collections",
      buttonLink: "/produits",
    },
  };
  return (
    <div className="bg-white text-gray-800">
      {/* Section Héros */}
      <section className="relative h-[60vh] min-h-[400px] text-white">
        <img
          src={data.hero.imageUrl}
          alt="Équipe travaillant ensemble"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center p-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {data.hero.title}
          </h1>
          <p className="text-lg md:text-2xl max-w-3xl">{data.hero.subtitle}</p>
        </div>
      </section>

      {/* Section Notre Histoire */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              {data.story.title}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {data.story.content}
            </p>
          </div>
          <div className="order-1 md:order-2">
            <img
              src={data.story.imageUrl}
              alt="Atelier de création"
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Section Nos Valeurs */}
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-12">
            {data.values.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {data.values.items.map((value) => (
              <div key={value.title} className="flex flex-col items-center">
                <Icon name={value.icon} />
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Équipe */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-12">
            {data.team.title}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 lg:gap-12">
            {data.team.members.map((member) => (
              <div key={member.name}>
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full object-cover shadow-lg mb-4"
                />
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Call to Action (CTA) */}
      <section className="bg-slate-600 text-white py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            {data.cta.title}
          </h2>
          <a
            // to={data.cta.buttonLink}
            href={data.cta.buttonLink}
            className="bg-white text-slate-600 font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors duration-300 text-lg inline-block"
          >
            {data.cta.buttonText}
          </a>
        </div>
      </section>
    </div>
  );
}
