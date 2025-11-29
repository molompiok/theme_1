import React from "react";
import { getStoreDescription } from "../../store/store_description";

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
  photo?: string;
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
      <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full overflow-hidden shadow-2xl mb-6 transition-all duration-300 group-hover:scale-110 group-hover:shadow-3xl border-4 border-transparent group-hover:border-gray-200">
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-600 flex items-center justify-center">
            <span className="text-white text-3xl md:text-4xl font-bold tracking-wider">
              {member.initials}
            </span>
          </div>
        )}
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-black mb-2 transition-colors duration-300 group-hover:text-gray-700">{member.name}</h3>
      <p className="text-gray-600 font-medium">{member.role}</p>
    </div>
  );
};

export default function Page() {
  // =======================================================================
  // Récupération des informations du store
  // =======================================================================
  const storeDescription = getStoreDescription();
  const data: AboutPageData = storeDescription.about;
  // =======================================================================


  return (
    <div className="bg-white text-gray-900 font-sans">
      {/* Section Héros */}
      <section className="relative h-screen min-h-[600px] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-gray-900/30 to-black/40">
          <img
            src={data.hero.imageUrl}
            alt="Équipe créative en discussion"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 z-10">
          <div className="max-w-5xl">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-tight tracking-tight">
              {data.hero.title}
            </h1>
            <p className="text-2xl md:text-3xl lg:text-4xl font-light opacity-90 max-w-3xl mx-auto leading-relaxed">
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
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 via-purple-100/20 to-pink-100/30"></div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400 rounded-full -translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-400 rounded-full translate-x-48 translate-y-48"></div>
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-purple-400 rounded-full"></div>
        </div>
        <div className="container mx-auto px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-black mb-8 leading-tight text-gray-900">
            {data.cta.title}
          </h2>
          <a
            href={data.cta.buttonLink}
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-12 text-lg rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-lg"
          >
            {data.cta.buttonText}
          </a>
        </div>
      </section>
    </div>
  );
}