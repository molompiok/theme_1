import { useState } from "react";
import { IMask } from "react-imask";
import AddressSelector from "../profile/AddressSelector";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaPhone,
  FaTruck,
} from "react-icons/fa";
import { useAuthStore } from "../../store/user";
import { InfoOrderOwner } from "../../utils";
import { useOrderInCart } from "../../store/cart";

// const pickupDeadline = new Date();
// const sellerPhone = "+2250707631861";
// const formattedPhone = IMask.pipe(sellerPhone, { mask: "+225 00 00 000 000" });
// const googleMapsLink =
//   `geo:5.308844,-4.013481?q=Koumassi+Remblais,+Abidjan`;
// pickupDeadline.setDate(pickupDeadline.getDate() + 3);
// const formattedDeadline = pickupDeadline.toLocaleDateString("fr-FR", {
//   weekday: "long",
//   year: "numeric",
//   month: "long",
//   day: "numeric",
// });

const LivraisonStep = ({
  step,
  setStep,
}: {
  step: "info" | "livraison" | "Finalisation";
  setStep: React.Dispatch<
    React.SetStateAction<"info" | "livraison" | "Finalisation">
  >;
}) => {

  const [selectedOption, setSelectedOption] = useState<"livraison" | "retrait" | null>(null);
  const user = useAuthStore((state) => state.user);
  const {setWithDelivery} = useOrderInCart()


  const handleSelect = (option: "livraison" | "retrait") => {
    setWithDelivery(option === "livraison");
    setSelectedOption((state) => (state === option ? null : option));
  };

  const isPermitToProceedForDelivery = user?.id && user.addresses?.length > 0 && selectedOption === "livraison";
  const isPermitToProceedForPickup = user?.id && selectedOption === "retrait";
  const isPermitToProceed = isPermitToProceedForDelivery || isPermitToProceedForPickup;

  const getErrorMessage = () => {
    if (!selectedOption) return "Veuillez choisir une option de livraison ou de retrait.";
    if (selectedOption === "livraison" && (!user?.addresses?.length)) {
      return "Veuillez ajouter une adresse pour la livraison.";
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">
        Choisissez une méthode de livraison
      </h2>

      <div className="space-y-4">
        <div
          className={`w-full border rounded-md overflow-hidden transition-all duration-200 ${
            selectedOption === "livraison" ? "border-black bg-gray-100" : "border-gray-300"
          }`}
        >
          <div
            onClick={() => handleSelect("livraison")}
            className="flex p-3 items-center bg-gray-200 cursor-pointer hover:bg-gray-300"
            role="button"
            aria-label="Sélectionner la livraison à domicile"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleSelect("livraison")}
          >
            <div
              className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                selectedOption === "livraison" ? "bg-black border-black" : "border-gray-400"
              }`}
            >
              {selectedOption === "livraison" && (
                <FaCheckCircle className="w-4 h-4 text-white" />
              )}
            </div>
            <span className="text-gray-900 flex items-center">
              Livraison à domicile <span className="ml-2 font-semibold">(1 000 CFA)</span>
              <FaTruck className="ml-2 text-gray-500" size={16} />
            </span>
          </div>
          {selectedOption === "livraison" && (
            <div className="p-1 space-y-3">
              <AddressSelector mapHeight="400px" />
              <p className="text-sm text-gray-600">
                Livraison estimée sous 2-3 jours ouvrables.
              </p>
            </div>
          )}
        </div>

        <div
          className={`w-full border rounded-md overflow-hidden transition-all duration-200 ${
            selectedOption === "retrait" ? "border-black bg-gray-100" : "border-gray-300"
          }`}
        >
          <div
            onClick={() => handleSelect("retrait")}
            className="flex p-3 bg-gray-200 items-center cursor-pointer hover:bg-gray-300"
            role="button"
            aria-label="Sélectionner le retrait gratuit"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleSelect("retrait")}
          >
            <div
              className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                selectedOption === "retrait" ? "bg-black border-black" : "border-gray-400"
              }`}
            >
              {selectedOption === "retrait" && (
                <FaCheckCircle className="w-4 h-4 text-white" />
              )}
            </div>
            <span className="text-gray-900">
              Retrait <span className="ml-2 font-semibold">(Gratuit)</span>
            </span>
          </div>
          {selectedOption === "retrait" && (
            <div className="p-4 text-gray-700 text-sm space-y-3">
              <p className="flex items-center">
                <FaMapMarkerAlt className="mr-2 text-gray-500" size={16} />
                <span>Lieu : {InfoOrderOwner.pickup_address}</span>
              </p>
              <p className="flex items-center">
                <FaCalendarAlt className="mr-2 text-gray-500" size={16} />
                <span>Date limite : {InfoOrderOwner.pickup_date}</span>
              </p>
              <p className="flex items-center">
                <FaPhone className="mr-2 text-gray-500" size={16} />
                <span>
                  Contact :{" "}
                  <a href={`tel:${InfoOrderOwner.pickup_phone}`} className="text-blue-600 hover:underline">
                    {InfoOrderOwner.pickup_phone}
                  </a>
                </span>
              </p>
              <p className="flex items-center">
                <a
                  href={InfoOrderOwner.pickup_maps_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center"
                >
                  <FaMapMarkerAlt className="mr-2 text-blue-600" size={16} />
                  Voir sur Google Maps
                </a>
              </p>
            </div>
          )}
        </div>
      </div>

      {!isPermitToProceed && (
        <p className="text-sm text-red-500 font-semibold bg-red-100 p-3 rounded-md">
          {getErrorMessage()}
        </p>
      )}

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setStep("Finalisation")}
          disabled={!isPermitToProceed}
          className={`w-full py-3 px-4 rounded-md text-white transition-colors ${
            isPermitToProceed
              ? "bg-black hover:bg-gray-800"
              : "bg-gray-400 cursor-not-allowed opacity-70"
          }`}
          aria-label="Continuer vers le récapitulatif"
        >
          Continuer
        </button>
        <button
          type="button"
          onClick={() => setStep("info")}
          className="w-full py-3 px-4 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Retour à l'étape informations"
        >
          Retour
        </button>
      </div>
    </div>
  );
};

export default LivraisonStep;