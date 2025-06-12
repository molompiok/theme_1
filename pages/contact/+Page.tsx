import React, { useState } from "react";

interface HeroSection {
  title: string;
  subtitle: string;
}

interface ContactMethod {
  type: "email" | "phone" | "address"; // Type littéral pour plus de sécurité
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
const Icon = ({ type }: { type: "email" | "phone" | "address" }) => {
  const iconMap = {
    email:
      "M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207",
    phone:
      "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    address:
      "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z; M15 11a3 3 0 11-6 0 3 3 0 016 0z",
  };
  return (
    <svg
      className="w-6 h-6 text-slate-600"
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
  );
};
export default function Page() {
  const data: ContactPageData = {
    hero: {
      title: "Contactez-nous",
      subtitle:
        "Une question ? Une suggestion ? Notre équipe est à votre écoute. Remplissez le formulaire ou utilisez nos coordonnées ci-dessous.",
    },
    contactInfo: {
      title: "Nos Coordonnées",
      intro:
        "Avant de nous écrire, avez-vous consulté notre page FAQ ? La réponse à votre question s'y trouve peut-être déjà !",
      methods: [
        {
          type: "email",
          label: "Email",
          value: "support@maboutique.com",
          href: "mailto:support@maboutique.com",
        },
        {
          type: "phone",
          label: "Téléphone",
          value: "+33 1 23 45 67 89",
          href: "tel:+33123456789",
        },
        {
          type: "address",
          label: "Adresse",
          value: "123 Rue du Commerce, 75001 Paris, France",
          href: "https://www.google.com/maps/search/?api=1&query=123+Rue+du+Commerce+75001+Paris",
        },
      ],
    },
    businessHours: {
      title: "Horaires d'ouverture",
      schedule: "Lundi - Vendredi : 9h00 - 18h00",
    },
    form: {
      title: "Envoyez-nous un message",
      nameLabel: "Votre nom complet",
      namePlaceholder: "Alice Dubois",
      emailLabel: "Votre email",
      emailPlaceholder: "vous@exemple.com",
      subjectLabel: "Sujet",
      subjectPlaceholder: "Question sur ma commande N°12345",
      messageLabel: "Votre message",
      messagePlaceholder:
        "Bonjour, je voudrais savoir où en est ma commande...",
      submitButton: "Envoyer le message",
      submittingButton: "Envoi en cours...",
      successMessage:
        "Merci ! Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.",
      errorMessage:
        "Oups ! Une erreur est survenue. Veuillez réessayer plus tard ou nous contacter par email.",
    },
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionStatus("submitting");

    // --- LOGIQUE D'ENVOI DU FORMULAIRE ---
    // Remplacez ce setTimeout par votre appel API réel (ex: fetch, axios)
    // à un service comme Formspree, Netlify Forms, ou votre propre backend.
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simule un délai réseau
      console.log("Form data submitted:", formState);
      setSubmissionStatus("success");
      setFormState({ name: "", email: "", subject: "", message: "" }); // Vider le formulaire
    } catch (error) {
      setSubmissionStatus("error");
    }
  };
  return (
    <div className="bg-white">
      {/* Section Héros */}
      <section className="bg-gray-50 py-16 lg:py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            {data.hero.title}
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            {data.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Section principale avec layout 2 colonnes */}
      <section className="container mx-auto px-6 py-16 lg:py-24">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {/* Colonne 1: Coordonnées */}
          <div className="flex flex-col space-y-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                {data.contactInfo.title}
              </h2>
              <p className="text-gray-600 mb-6">
                {data.contactInfo.intro}{" "}
                <a
                  href="/faq"
                  className="text-slate-600 hover:underline font-medium"
                >
                  Consultez-la ici
                </a>
                .
              </p>
              <div className="space-y-4">
                {data.contactInfo.methods.map((method) => (
                  <a
                    href={method.href}
                    key={method.type}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start space-x-4 group"
                  >
                    <div className="flex-shrink-0 pt-1">
                      <Icon type={method.type} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {method.label}
                      </p>
                      <p className="text-gray-600 group-hover:text-slate-600 transition-colors">
                        {method.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">
                {data.businessHours.title}
              </h3>
              <p className="text-gray-600">{data.businessHours.schedule}</p>
            </div>
          </div>

          {/* Colonne 2: Formulaire */}
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-6">
              {data.form.title}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
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
                  className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
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
                  className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700"
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
                  className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  {data.form.messageLabel}
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={5}
                  required
                  value={formState.message}
                  onChange={handleInputChange}
                  placeholder={data.form.messagePlaceholder}
                  className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500"
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={submissionStatus === "submitting"}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                  {submissionStatus === "submitting"
                    ? data.form.submittingButton
                    : data.form.submitButton}
                </button>
              </div>
              {submissionStatus === "success" && (
                <div className="p-4 bg-green-100 text-green-800 rounded-md">
                  {data.form.successMessage}
                </div>
              )}
              {submissionStatus === "error" && (
                <div className="p-4 bg-red-100 text-red-800 rounded-md">
                  {data.form.errorMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
