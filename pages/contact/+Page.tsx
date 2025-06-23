import React, { useState } from "react";

// Les interfaces (definitions de type) restent les mêmes
interface HeroSection {
  title: string;
  subtitle: string;
}

interface ContactMethod {
  type: "email" | "phone" | "address";
  label: string;
  value: string;
  href: string;
}

interface ContactInfo {
  title: string;
  intro: string;
  methods: ContactMethod[];
}

interface BusinessHours {
  title: string;
  schedule: string;
}

interface FormContent {
  title: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  subjectLabel: string;
  subjectPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitButton: string;
  submittingButton: string;
  successMessage: string;
  errorMessage: string;
}

export interface ContactPageData {
  hero: HeroSection;
  contactInfo: ContactInfo;
  businessHours: BusinessHours;
  form: FormContent;
}

// L'icône reste la même
const Icon = ({ type }: { type: "email" | "phone" | "address" }) => {
  const iconMap = {
    email: "M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207",
    phone: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    address: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
  };

  return (
    <div className="flex items-center justify-center w-12 h-12 bg-black text-white rounded-full transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={iconMap[type]}
        />
      </svg>
    </div>
  );
};


export default function Page() {
  // =======================================================================
  // DÉBUT DE LA SECTION ADAPTÉE POUR LE MARCHÉ IVOIRIEN
  // =======================================================================
  const data: ContactPageData = {
    hero: {
      // Ton plus direct et accueillant
      title: "On est là pour vous",
      subtitle: "Une question, une préoccupation ou une suggestion ? Notre équipe est à votre écoute. Laissez-nous un message ou utilisez nos contacts directs.",
    },
    contactInfo: {
      title: "Comment nous joindre",
      // Ton plus familier
      intro: "Avant de nous écrire, jetez un coup d'œil à notre Foire Aux Questions (FAQ). La solution à votre problème s'y trouve peut-être déjà !",
      methods: [
        {
          // Ajout de WhatsApp, très populaire et pratique en Côte d'Ivoire
          type: "phone", // On peut réutiliser l'icône du téléphone
          label: "WhatsApp",
          value: "+225 07 59 09 10 98", // Numéro de mobile ivoirien (format Orange/MTN/Moov)
          href: "https://wa.me/2250759091098", // Lien direct pour ouvrir une conversation WhatsApp
        },
        {
          type: "email",
          label: "Email",
          value: "contact@maboutique.ci", // Domaine en .ci pour la crédibilité locale
          href: "mailto:contact@maboutique.ci",
        },
        {
          type: "phone",
          label: "Appel Direct",
          value: "+225 07 59 09 10 98", // Numéro fixe ou mobile ivoirien
          href: "tel:+2250759091098",
        },
        {
          type: "address",
          label: "Notre agence",
          // Adresse plausible à Abidjan, dans un quartier d'affaires connu
          value: "Rue des Jardins, Cocody les II Plateaux, Abidjan, Côte d'Ivoire",
          href: "https://www.google.com/maps/search/?api=1&query=Rue+des+Jardins+Cocody+Abidjan",
        },
      ],
    },
    businessHours: {
      title: "Nos horaires d'ouverture",
      // Horaires adaptés à une pratique locale (pause déjeuner, ouverture le samedi matin)
      schedule: "Lundi - Vendredi : 8h30 - 18h00 | Samedi : 9h00 - 13h00",
    },
    form: {
      title: "Laissez-nous un message",
      nameLabel: "Votre nom complet",
      // Nom à consonance locale
      namePlaceholder: "Kouassi N'Goran",
      emailLabel: "Votre adresse email",
      emailPlaceholder: "vous@exemple.com",
      subjectLabel: "Sujet de votre message",
      // Exemple plus concret
      subjectPlaceholder: "Info sur ma commande N°ABJ12345",
      messageLabel: "Votre message",
      // Ajout d'une expression familière et amicale ("On dit quoi ?")
      messagePlaceholder: "Bonjour l'équipe, j'aimerais avoir des nouvelles de ma commande... On dit quoi ?",
      submitButton: "Envoyer mon message",
      submittingButton: "Envoi en cours...",
      // Message de succès plus chaleureux
      successMessage: "Merci beaucoup ! Votre message a été reçu. On revient vers vous très rapidement.",
      // Message d'erreur proposant des alternatives directes
      errorMessage: "Oups, un souci est survenu. Veuillez réessayer ou nous joindre directement par WhatsApp ou par appel.",
    },
  };
  // =======================================================================
  // FIN DE LA SECTION ADAPTÉE
  // =======================================================================


  // Le reste du composant (logique et JSX) reste inchangé
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setSubmissionStatus("submitting");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Form data submitted:", formState);
      setSubmissionStatus("success");
      setFormState({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setSubmissionStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation moderne */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-black">Logo</div>
          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-black hover:text-gray-600 transition-colors font-medium">Accueil</a>
            <a href="#" className="text-black hover:text-gray-600 transition-colors font-medium">Services</a>
            <a href="#" className="text-black hover:text-gray-600 transition-colors font-medium">À propos</a>
            <a href="#" className="text-black hover:text-gray-600 transition-colors font-medium">Contact</a>
          </div>
        </div>
      </nav>

      {/* Section Héros avec design moderne */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        {/* Éléments décoratifs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-black rounded-full opacity-5 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-black rounded-full opacity-3"></div>
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-black rounded-full"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-black rounded-full"></div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black text-black mb-8 leading-tight">
            {data.hero.title}
          </h1>
          <div className="w-24 h-1 bg-black mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light">
            {data.hero.subtitle}
          </p>
          <div className="mt-12">
            <div className="inline-block w-6 h-6 border-2 border-black rounded-full animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Section principale avec design moderne */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20">
            {/* Colonne 1: Coordonnées */}
            <div className="space-y-12">
              <div>
                <h2 className="text-4xl font-bold text-black mb-6 leading-tight">
                  {data.contactInfo.title}
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  {data.contactInfo.intro}{" "}
                  <a
                    href="/faq"
                    className="text-black hover:underline font-semibold underline-offset-4 decoration-2"
                  >
                    Consultez-la ici
                  </a>
                </p>

                <div className="space-y-8">
                  {data.contactInfo.methods.map((method, index) => (
                    <a
                      href={method.href}
                      key={method.type + index} // Clé unique, surtout avec le type 'phone' dupliqué
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-6 group cursor-pointer transform hover:translate-x-2 transition-all duration-300"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <Icon type={method.type} />
                      <div className="flex-1">
                        <p className="font-bold text-black text-lg group-hover:text-gray-700 transition-colors">
                          {method.label}
                        </p>
                        <p className="text-gray-600 text-base mt-1 group-hover:text-black transition-colors">
                          {method.value}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="bg-black text-white p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-4">
                  {data.businessHours.title}
                </h3>
                <p className="text-lg opacity-90">{data.businessHours.schedule}</p>
              </div>
            </div>

            {/* Colonne 2: Formulaire */}
            <div className="bg-gray-50 p-12 rounded-3xl">
              <h2 className="text-4xl font-bold text-black mb-8 leading-tight">
                {data.form.title}
              </h2>

              <form className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-bold text-black mb-2 uppercase tracking-wide"
                    >
                      {data.form.nameLabel}
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formState.name}
                      onChange={handleInputChange}
                      placeholder={data.form.namePlaceholder}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-all duration-300 bg-white text-black placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-bold text-black mb-2 uppercase tracking-wide"
                    >
                      {data.form.emailLabel}
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formState.email}
                      onChange={handleInputChange}
                      placeholder={data.form.emailPlaceholder}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-all duration-300 bg-white text-black placeholder-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-bold text-black mb-2 uppercase tracking-wide"
                  >
                    {data.form.subjectLabel}
                  </label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    value={formState.subject}
                    onChange={handleInputChange}
                    placeholder={data.form.subjectPlaceholder}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-all duration-300 bg-white text-black placeholder-gray-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-bold text-black mb-2 uppercase tracking-wide"
                  >
                    {data.form.messageLabel}
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={6}
                    required
                    value={formState.message}
                    onChange={handleInputChange}
                    placeholder={data.form.messagePlaceholder}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-all duration-300 bg-white text-black placeholder-gray-400 resize-none"
                  />
                </div>

                <div
                  onClick={handleSubmit}
                  className="w-full py-4 px-8 bg-black text-white font-bold text-lg rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer text-center"
                >
                  {submissionStatus === "submitting" ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{data.form.submittingButton}</span>
                    </div>
                  ) : (
                    data.form.submitButton
                  )}
                </div>

                {submissionStatus === "success" && (
                  <div className="p-6 bg-green-50 border-2 border-green-200 text-green-800 rounded-xl animate-pulse">
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="font-semibold">{data.form.successMessage}</span>
                    </div>
                  </div>
                )}

                {submissionStatus === "error" && (
                  <div className="p-6 bg-red-50 border-2 border-red-200 text-red-800 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="font-semibold">{data.form.errorMessage}</span>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer moderne */}
      <footer className="bg-black text-white py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-3xl font-bold mb-4">Logo</div>
          <p className="text-gray-400 mb-8">Votre partenaire de confiance à Abidjan</p>
          <div className="flex justify-center space-x-8 mb-8">
            <a href="#" className="hover:text-gray-300 transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Politique de confidentialité</a>
            <a href="#" className="hover:text-gray-300 transition-colors">CGU</a>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-500">© 2025 Tous droits réservés</p>
          </div>
        </div>
      </footer>
    </div>
  );
}