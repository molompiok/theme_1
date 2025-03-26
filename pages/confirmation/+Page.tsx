import React, { useState } from "react";
import { IMask } from "react-imask";
import { useAuthStore } from "../../store/user";
import GoogleAuthButton from "../../component/Auth/GoogleAuthButton";
import { PhoneNumbers } from "../../component/profile/PhoneNumbers";
import LivraisonStep from "../../component/confirmation/LivraisonStep";
import { PersonalInfo } from "../../component/profile/PersonalInfo";
import { OrderSummary } from "../../component/confirmation/OrderSummary";
import clsx from "clsx";

interface DétailsCommande {
  adresse_livraison: string;
  nom_adresse_livraison: string;
  adresse_retrait: string;
  nom_adresse_retrait: string;
  prix_total: number;
  price_delivery: number;
  with_delivery: boolean;
  méthode_paiement: "carte_crédit" | "paypal" | "mobile_money" | "espèces";
  numéro_téléphone: string;
  articles: ArticlePanier[];
}

interface ArticlePanier {
  id: string;
  quantité: number;
  groupe_produit: {
    id: string;
    nom: string;
    prix: number;
  };
}

export default function PagePaiement() {

  const [withDelivery, setWithDelivery] = useState<boolean>(false); // true pour livraison, false pour retrait
  const [deliveryDate, setDeliveryDate] = useState<string>("25/03/2025"); // Date limite livraison
  const [pickupDate, setPickupDate] = useState<string>("26/03/2025"); // Date limite retrait
  const [phoneNumber, setPhoneNumber] = useState<string>("+221 77 123 45 67");
  const [deliveryAddress, setDeliveryAddress] = useState<string>("123 Rue Exemple, Dakar");
  const [pickupAddress, setPickupAddress] = useState<string>("Magasin Central, Dakar");
  const [itemsPrice, setItemsPrice] = useState<number>(5000); // Prix des articles
  const [deliveryPrice, setDeliveryPrice] = useState<number>(1000); // Prix livraison
  const [isPending, setIsPending] = useState<boolean>(false); // État de chargement



  const [step, setStep] = useState<"info" | "livraison" | "Finalisation">("info");
  const user = useAuthStore((state) => state.user);
  const isPermitToProceed = user?.id && user.phone_numbers?.length > 0 && user.email && user.full_name;

  const getInfoErrorMessage = () => {
    if (!user?.id) return "Veuillez vous connecter pour continuer.";
    if (!user.full_name) return "Veuillez renseigner votre nom complet.";
    if (!user.email) return "Veuillez ajouter une adresse email valide.";
    if (!user.phone_numbers?.length) return "Veuillez ajouter un numéro de téléphone.";
    return null;
  };

  return (
    <div className="bg-white flex flex-col-reverse lg:flex-row font-sans min-h-screen">
      <div className="w-full lg:w-2/3 p-4 sm:p-6 bg-gray-50 pt-8">
        <div className="max-w-xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-light mb-8 text-black border-b border-gray-200 pb-4">
            Confirmation de commande
          </h1>
          <div className="flex flex-col sm:flex-row justify-between mb-10 gap-4">
            <Step title="Information" active={step === "info"} completed={step !== "info"} />
            <Step title="Livraison" active={step === "livraison"} completed={step === "Finalisation"} />
            <Step title="Finalisation" active={step === "Finalisation"} />
          </div>
          <div className="space-y-8">
            {step === "info" && (
              <div className="space-y-6">
                {user?.id ? (
                  <>
                    <div className="space-y-4">
                      <PersonalInfo />
                      <PhoneNumbers style="bg-white" />
                    </div>
                    {!isPermitToProceed && (
                      <p className="text-sm text-red-500 font-semibold bg-red-100 p-3 rounded-md">
                        {getInfoErrorMessage()}
                      </p>
                    )}
                    <button
                      type="button"
                      disabled={!isPermitToProceed}
                      onClick={() => setStep("livraison")}
                      className={clsx(
                        "w-full bg-black text-white p-3 rounded transition-colors",
                        {
                          "opacity-50 cursor-not-allowed": !isPermitToProceed,
                          "hover:bg-gray-800": isPermitToProceed,
                        }
                      )}
                      aria-label="Passer à l'étape livraison"
                    >
                      Passer à la Livraison
                    </button>
                  </>
                ) : (
                  <div className="w-full flex flex-col gap-4 justify-center items-center">
                    <p className="text-lg text-center font-medium text-gray-800">
                      Vous devez être connecté pour passer une commande.
                    </p>
                    <GoogleAuthButton />
                    <p className="text-sm text-gray-600 text-center">
                      Connectez-vous rapidement avec Google pour continuer.
                    </p>
                  </div>
                )}
              </div>
            )}
            <LivraisonStep step={step} setStep={setStep} />
            {step === "Finalisation" && (
  <section className="space-y-6 max-w-2xl mx-auto p-4 sm:p-6">
    {/* Conteneur principal */}
    
    {/* Titre */}
    <header>
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
        Récapitulatif de la commande
      </h2>
    </header>

    {/* Contenu du récapitulatif */}
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 space-y-4">
      {/* Type de livraison et date limite */}
      <div className="space-y-2">
        <p className="text-gray-600">
          <span className="font-medium">Type de livraison : </span>
          {withDelivery ? "Livraison" : "Retrait"}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Date limite : </span>
          {withDelivery ? deliveryDate : pickupDate || "Non spécifiée"}
        </p>
      </div>

      {/* Numéro du client */}
      <p className="text-gray-600">
        <span className="font-medium">Numéro de téléphone : </span>
        {phoneNumber || "Non fourni"}
      </p>

      {/* Adresse selon le type de livraison */}
      <p className="text-gray-600">
        <span className="font-medium">
          {withDelivery ? "Adresse de livraison" : "Adresse de retrait"} : 
        </span>
        {withDelivery ? deliveryAddress : pickupAddress || "Non spécifiée"}
      </p>

      {/* Prix des articles */}
      <div className="flex justify-between">
        <span className="text-gray-600">Prix des articles</span>
        <span className="text-gray-900">{itemsPrice} CFA</span>
      </div>

      {/* Prix de livraison (seulement si withDelivery est true) */}
      {withDelivery && (
        <div className="flex justify-between">
          <span className="text-gray-600">Frais de livraison</span>
          <span className="text-gray-900">{deliveryPrice} CFA</span>
        </div>
      )}

      {/* Total */}
      <div className="flex justify-between font-semibold pt-2 border-t border-gray-200">
        <span>Total</span>
        <span>{withDelivery ? itemsPrice + deliveryPrice : itemsPrice} CFA</span>
      </div>
    </div>

    {/* Boutons */}
    <div className="grid gap-4 sm:grid-cols-2">
      <button
        type="submit"
        className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 
                  focus:ring-2 focus:ring-offset-2 focus:ring-black 
                  transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Finaliser la commande"
        disabled={isPending}
      >
        Compléter la Commande
      </button>

      <button
        type="button"
        onClick={() => setStep("livraison")}
        className="w-full text-gray-600 py-3 px-4 rounded-lg 
                  hover:text-black hover:bg-gray-100 
                  focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 
                  transition-colors duration-200"
        aria-label="Retour à l'étape livraison"
      >
        Retour à la Livraison
      </button>
    </div>
  </section>
)}
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/3 bg-white shadow-sm rounded-lg p-6 lg:p-8 border border-gray-100 lg:sticky top-10">
        <OrderSummary />
      </div>
    </div>
  );
}
interface StepProps {
  title: string;
  active: boolean;
  completed?: boolean;
}

const Step: React.FC<StepProps> = ({ title, active, completed }) => (
  <div className="flex-1">
    <div className="flex items-center">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
          active
            ? "border-black bg-black text-white"
            : completed
            ? "border-gray- bg-green-500 text-white"
            : "border-gray-300 bg-white"
        }`}
      >
        {completed ? "✓" : active ? "●" : "○"}
      </div>
      <p
        className={`ml-2  ${
          active ? "font-medium text-black" : "text-gray-500"
        }`}
      >
        {title}
      </p>
    </div>
    <div className="h-1 bg-gray-200 mt-2 sm:hidden">
      <div
        className={`h-full ${active || completed ? "bg-black" : "bg-gray-200"}`}
      />
    </div>
  </div>
);
