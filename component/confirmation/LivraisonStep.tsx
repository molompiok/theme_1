import { useState } from "react";
import { IMask } from "react-imask";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaPhone,
  FaTruck,
  FaStore,
} from "react-icons/fa";
import { useAuthStore } from "../../store/user";
import { InfoOrderOwner } from "../../utils";
import { useOrderInCart } from "../../store/cart";
import { AddressSelector } from "../profile/AddressSelector";

const LivraisonStep = ({
  step,
  setStep,
}: {
  step: "info" | "livraison" | "Finalisation";
  setStep: React.Dispatch<
    React.SetStateAction<"info" | "livraison" | "Finalisation">
  >;
}) => {
  const [selectedOption, setSelectedOption] = useState<
    "livraison" | "retrait" | null
  >(null);
  const user = useAuthStore((state) => state.user);
  const { setWithDelivery } = useOrderInCart();

  const handleSelect = (option: "livraison" | "retrait") => {
    setWithDelivery(option === "livraison");
    setSelectedOption(option);
  };

  const isPermitToProceedForDelivery =
    user?.id && user.addresses?.length > 0 && selectedOption === "livraison";
  const isPermitToProceedForPickup = user?.id && selectedOption === "retrait";
  const isPermitToProceed =
    isPermitToProceedForDelivery || isPermitToProceedForPickup;

  const getErrorMessage = () => {
    if (!selectedOption)
      return "Veuillez choisir une option de livraison ou de retrait.";
    if (selectedOption === "livraison" && !user?.addresses?.length) {
      return "Veuillez ajouter une adresse pour la livraison.";
    }
    return null;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          Mode de récupération
        </h2>
        <p className="text-gray-600">
          Choisissez comment vous souhaitez recevoir votre commande
        </p>
      </div>

      {/* Segment Control */}
      <div className="relative bg-gray-100 p-1 rounded-2xl shadow-inner">
        <div className="flex relative">
          {/* Sliding background */}
          <div
            className={`absolute top-1 bottom-1 w-1/2 bg-white rounded-xl shadow-sm transition-transform duration-300 ease-out ${
              selectedOption === "retrait"
                ? "translate-x-full"
                : "translate-x-0"
            } ${!selectedOption ? "opacity-0" : "opacity-100"}`}
          />

          {/* Livraison Option */}
          <button
            onClick={() => handleSelect("livraison")}
            className={`relative flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl transition-all duration-300 ${
              selectedOption === "livraison"
                ? "text-gray-900 font-semibold"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <FaTruck
              className={`transition-all duration-300 ${
                selectedOption === "livraison"
                  ? "text-slate-600 scale-110"
                  : "text-gray-500"
              }`}
              size={20}
            />
            <div className="text-left">
              <div className="font-medium">Livraison</div>
              <div className="text-sm opacity-75">1 000 CFA</div>
            </div>
          </button>

          {/* Retrait Option */}
          <button
            onClick={() => handleSelect("retrait")}
            className={`relative flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl transition-all duration-300 ${
              selectedOption === "retrait"
                ? "text-gray-900 font-semibold"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <FaStore
              className={`transition-all duration-300 ${
                selectedOption === "retrait"
                  ? "text-green-600 scale-110"
                  : "text-gray-500"
              }`}
              size={20}
            />
            <div className="text-left">
              <div className="font-medium">Retrait</div>
              <div className="text-sm opacity-75">Gratuit</div>
            </div>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[300px]">
        {selectedOption === "livraison" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-slate-100 rounded-full">
                  <FaTruck className="text-slate-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Livraison à domicile
                  </h3>
                  <p className="text-sm text-gray-600">
                    Livraison estimée sous 2-3 jours ouvrables
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <AddressSelector mapHeight="350px" />
              </div>
            </div>
          </div>
        )}

        {selectedOption === "retrait" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-full">
                  <FaStore className="text-green-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Retrait gratuit
                  </h3>
                  <p className="text-sm text-gray-600">
                    Récupérez votre commande à notre point de retrait
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-white rounded-xl">
                      <FaMapMarkerAlt
                        className="text-green-600 mt-1 flex-shrink-0"
                        size={16}
                      />
                      <div>
                        <div className="font-medium text-gray-900 text-sm">
                          Adresse
                        </div>
                        <div className="text-gray-700 text-sm">
                          {InfoOrderOwner.pickup_address}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-white rounded-xl">
                      <FaCalendarAlt
                        className="text-green-600 mt-1 flex-shrink-0"
                        size={16}
                      />
                      <div>
                        <div className="font-medium text-gray-900 text-sm">
                          Date limite
                        </div>
                        <div className="text-gray-700 text-sm">
                          {InfoOrderOwner.pickup_date}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-white rounded-xl">
                      <FaPhone
                        className="text-green-600 mt-1 flex-shrink-0"
                        size={16}
                      />
                      <div>
                        <div className="font-medium text-gray-900 text-sm">
                          Contact
                        </div>
                        <a
                          href={`tel:${InfoOrderOwner.pickup_phone}`}
                          className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
                        >
                          {InfoOrderOwner.pickup_phone}
                        </a>
                      </div>
                    </div>

                    <a
                      href={InfoOrderOwner.pickup_maps_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <FaMapMarkerAlt
                        className="text-green-600 group-hover:text-green-700 transition-colors"
                        size={16}
                      />
                      <div>
                        <div className="font-medium text-gray-900 text-sm">
                          Localisation
                        </div>
                        <div className="text-green-600 group-hover:text-green-700 text-sm font-medium transition-colors">
                          Voir sur Google Maps
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!selectedOption && (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center space-y-3">
              <div className="text-4xl">📦</div>
              <p className="text-lg font-medium">Sélectionnez une option</p>
              <p className="text-sm">
                Choisissez votre mode de récupération préféré
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {!isPermitToProceed && selectedOption && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-1 bg-red-100 rounded-full">
              <svg
                className="w-4 h-4 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-red-700 font-medium text-sm">
              {getErrorMessage()}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={() => setStep("info")}
          className="flex-1 py-4 px-6 rounded-2xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
        >
          Retour
        </button>

        <button
          type="button"
          onClick={() => setStep("Finalisation")}
          disabled={!isPermitToProceed}
          className={`flex-1 py-4 px-6 rounded-2xl font-medium transition-all duration-200 ${
            isPermitToProceed
              ? "bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isPermitToProceed ? "Continuer" : "Sélectionnez une option"}
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LivraisonStep;
