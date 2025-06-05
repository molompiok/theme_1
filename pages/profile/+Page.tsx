import React, { JSX, useEffect, useState, Suspense } from "react";
import { BsPersonFill, BsGeoAltFill, BsTelephoneFill } from "react-icons/bs"; // Icônes plus "remplies" pour un look moderne
import { useAuthRedirect } from "../../hook/authRedirect"; // Assure-toi que le chemin est correct

const AddressSelector = React.lazy(() =>
  import("../../component/profile/AddressSelector").then(module => ({ default: module.AddressSelector }))
);
const PersonalInfo = React.lazy(() =>
  import("../../component/profile/PersonalInfo").then(module => ({ default: module.PersonalInfo }))
);
const PhoneNumbers = React.lazy(() =>
  import("../../component/profile/PhoneNumbers").then(module => ({ default: module.PhoneNumbers }))
);


// Composant de chargement générique amélioré
const LoadingSpinner = ({ text = "Chargement..." }: { text?: string }) => (
  <div className="flex flex-col items-center justify-center gap-3 p-8 text-neutral-500 dark:text-neutral-400 min-h-[200px]">
    <svg
      className="animate-spin h-8 w-8 text-slate-600 dark:text-slate-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <span className="text-sm font-medium">{text}</span>
  </div>
);

const ProfileSectionCard = ({ title, icon, children }: { title: string, icon: JSX.Element, children: React.ReactNode }) => (
  <section className="bg-white shadow-xl  rounded-xl overflow-hidden">
    <header className="flex items-center gap-3 p-5 sm:p-6 border-b border-neutral-200">
      {React.cloneElement(icon, { className: "text-xl sm:text-2xl text-slate-600" })}
      <h2 className="text-lg sm:text-xl font-semibold text-neutral-800">
        {title}
      </h2>
    </header>
    <div className="p-5 sm:p-6">
      {children}
    </div>
  </section>
);


export default function ProfilePage(): JSX.Element {
  useAuthRedirect(); // Hook pour la redirection d'authentification
  const [isScrolled, setIsScrolled] = useState(false);

  // Gérer le changement de style du header au scroll
  useEffect(() => {
    const handleScroll = () => {
      // Seuil de scroll pour activer l'effet (plus petit pour un effet plus rapide)
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-neutral-100 min-h-screen font-primary text-neutral-700">
      <header
        className={`sticky top-0 inset-x-0 z-40 transition-all duration-300 ease-in-out
          ${isScrolled
            ? 'bg-white/80 backdrop-blur-lg shadow-lg py-4 mt-0 top-11 sm:top-15 z-40'
            : 'bg-transparent py-6 top-0 mt-7 z-40'
          }`}
      >
        <div className="container mx-auto px-4 pt-4">
          <div className="max-w-5xl mx-auto flex items-center gap-3 sm:gap-4">
            <div className={`p-2 sm:p-3 rounded-full transition-colors duration-300
              ${isScrolled ? 'bg-slate-100' : 'bg-white shadow-md'}`}>
              <BsPersonFill
                className={`text-2xl sm:text-3xl transition-colors duration-300
                ${isScrolled ? 'text-slate-600' : 'text-neutral-700'}`}
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-800">
              Mon Profil
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-1 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto flex flex-col gap-8 sm:gap-10">
          <Suspense fallback={<LoadingSpinner text="Chargement des informations..." />}>
            <ProfileSectionCard title="Informations personnelles" icon={<BsPersonFill />}>
              <PersonalInfo />
            </ProfileSectionCard>
          </Suspense>

          <Suspense fallback={<LoadingSpinner text="Chargement des numéros..." />}>
            <ProfileSectionCard title="Numéros de téléphone" icon={<BsTelephoneFill />}>
              <PhoneNumbers maxItems={2} />
            </ProfileSectionCard>
          </Suspense>

          <Suspense fallback={<LoadingSpinner text="Chargement des adresses..." />}>
            <ProfileSectionCard title="Adresses de livraison" icon={<BsGeoAltFill />}>
              <AddressSelector mapHeight="350px" />
            </ProfileSectionCard>
          </Suspense>
        </div>
      </main>

    </div>
  );
}