import React, {
  JSX,
  useEffect,
  useState,
} from "react";
import {
  BsPerson,
} from "react-icons/bs";
import { AddressSelector } from "../../component/profile/AddressSelector";
import { PersonalInfo } from "../../component/profile/PersonalInfo";
import { PhoneNumbers } from "../../component/profile/PhoneNumbers";
import { useAuthRedirect } from "../../hook/authRedirect";



// Composant de chargement générique
const LoadingSpinner = ({ text = "Chargement..." }: { text?: string }) => (
  <div className="flex items-center justify-center gap-2 p-2 text-gray-600">
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
        className="opacity-25"
      />
      <path
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
        className="opacity-75"
      />
    </svg>
    <span>{text}</span>
  </div>
);





export default function Page(): JSX.Element {
  useAuthRedirect();
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="container mx-auto min-h-dvh font-primary px-2 pb-[100px]">
        <div
          className={`sticky inset-x-0 bg-white border-gray-200 transition-all w-full duration-300 py-5 ${isScrolled ? 'border-b mt-0 top-11 sm:top-14 z-40' : 'top-0 mt-7 z-40'
            }`}
          style={{
            paddingLeft: isScrolled ? '1rem' : '0',
            paddingRight: isScrolled ? '1rem' : '0',
          }}
        >
          <div className="max-w-5xl mx-auto ">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <BsPerson className="text-2xl sm:text-4xl text-gray-800" />
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Informations de livraison
                </h1>
              </div>

            </div>
          </div>
        </div>
        <div className="h-6"></div>
        <div className="flex flex-col gap-7 max-w-5xl mx-auto">
          <PersonalInfo />
          <PhoneNumbers maxItems={2} />
          <AddressSelector
            mapHeight="400px"
          />
      </div>
    </div>
  );
}
