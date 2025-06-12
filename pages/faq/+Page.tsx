import React, { useState } from "react";
interface HeroSection {
  title: string;
  subtitle: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  categoryTitle: string;
  items: FaqItem[];
}

interface CtaSection {
  text: string;
  buttonText: string;
  buttonLink: string;
}

export interface FaqPageData {
  hero: HeroSection;
  categories: FaqCategory[];
  cta: CtaSection;
}
export default function Page() {
  const data: FaqPageData = {
    hero: {
      title: "Questions Fréquemment Posées",
      subtitle:
        "Trouvez rapidement les réponses à vos questions sur nos produits, la livraison et les retours.",
    },
    categories: [
      {
        categoryTitle: "Commande",
        items: [
          {
            question: "Comment puis-je passer une commande ?",
            answer:
              "Pour passer une commande, parcourez simplement nos collections, ajoutez les articles souhaités à votre panier, puis cliquez sur l'icône du panier pour finaliser votre achat en suivant les étapes indiquées.",
          },
          {
            question: "Puis-je modifier ou annuler ma commande ?",
            answer:
              "Une fois votre commande validée, elle est rapidement transmise à notre entrepôt pour préparation. Contactez notre service client le plus rapidement possible. Si la commande n'a pas encore été expédiée, nous ferons de notre mieux pour répondre à votre demande.",
          },
        ],
      },
      {
        categoryTitle: "Livraison",
        items: [
          {
            question: "Quels sont les délais de livraison ?",
            answer:
              "Les délais de livraison varient en fonction de votre localisation. En général, les commandes sont livrées sous 3 à 5 jours ouvrés en France métropolitaine. Vous recevrez un numéro de suivi par e-mail dès l'expédition.",
          },
          {
            question: "Livrez-vous à l'international ?",
            answer:
              "Oui, nous livrons dans la plupart des pays du monde. Les frais et délais de livraison internationaux sont calculés automatiquement lors du passage à la caisse.",
          },
        ],
      },
      {
        categoryTitle: "Retours & Remboursements",
        items: [
          {
            question: "Quelle est votre politique de retour ?",
            answer:
              "Vous disposez de 30 jours après réception de votre commande pour nous retourner un article qui ne vous conviendrait pas. L'article doit être dans son état d'origine, non porté et avec ses étiquettes. Consultez notre page 'Politique de Retour' pour plus de détails.",
          },
          {
            question: "Comment s'effectue le remboursement ?",
            answer:
              "Une fois votre retour reçu et inspecté, nous vous enverrons un e-mail pour vous notifier de l'approbation de votre remboursement. Le crédit sera alors automatiquement appliqué à votre méthode de paiement originale dans un délai de 5 à 10 jours ouvrés.",
          },
        ],
      },
    ],
    cta: {
      text: "Vous n'avez pas trouvé de réponse à votre question ?",
      buttonText: "Contactez-nous",
      buttonLink: "/contact",
    },
  };
  return (
    <div className="bg-white">
      {/* Section Héros */}
      <section className="bg-gray-50 py-16 lg:py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            {data.hero.title}
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            {data.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Section des questions/réponses */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6 max-w-3xl">
          {data.categories.map((category) => (
            <div key={category.categoryTitle} className="mb-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 border-l-4 border-slate-600 pl-4">
                {category.categoryTitle}
              </h2>
              <div>
                {category.items.map((item) => (
                  <AccordionItem
                    key={item.question}
                    question={item.question}
                    answer={item.answer}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section Call to Action (CTA) */}
      <section className="bg-gray-50 py-16 lg:py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {data.cta.text}
          </h2>
          <a
            href={data.cta.buttonLink}
            className="bg-slate-600 text-white font-bold py-3 px-8 rounded-md hover:bg-slate-700 transition-colors duration-300 text-lg inline-block"
          >
            {data.cta.buttonText}
          </a>
        </div>
      </section>
    </div>
  );
}

// Composant réutilisable pour l'accordéon (UI/UX soignée)
const AccordionItem: React.FC<FaqItem> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left"
      >
        <h3 className="text-lg font-medium text-gray-900">{question}</h3>
        {/* Icône qui tourne pour indiquer l'état ouvert/fermé */}
        <span
          className={`transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <svg
            className="w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>
      {/* Contenu qui apparaît avec une transition fluide */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-screen mt-4" : "max-h-0"
        }`}
      >
        <p className="text-gray-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};
