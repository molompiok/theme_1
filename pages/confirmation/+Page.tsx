import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../store/user";
import { PhoneNumbers } from "../../component/profile/PhoneNumbers";
import LivraisonStep from "../../component/confirmation/LivraisonStep";
import { PersonalInfo } from "../../component/profile/PersonalInfo";
import { OrderSummary } from "../../component/confirmation/OrderSummary";
import clsx from "clsx";
import useCart from "../../hook/query/useCart";
import FinalInfo from "../../component/confirmation/FinalInfo";
import { navigate } from "vike/client/router";
import { googleLogin } from "../../utils";
import { FcGoogle } from "react-icons/fc";
import { usePageContext } from "vike-react/usePageContext";

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
  const [step, setStep] = useState<"info" | "livraison" | "Finalisation">(
    "info"
  );
  const user = useAuthStore((state) => state.user);
  const { apiUrl, serverApiUrl, api, storeId } = usePageContext();

  const isPermitToProceed =
    user?.id && user.phone_numbers?.length > 0 && user.email && user.full_name;

  const { data: cart } = useCart(api);

  useEffect(() => {
    //@ts-ignore
    if ((cart?.cart?.items?.length ?? 0) <= 0) {
      // navigate("/");
      history.back();
    }
    //@ts-ignore
  }, [cart?.cart?.items]);

  const getInfoErrorMessage = () => {
    if (!user?.id) return "Veuillez vous connecter pour continuer.";
    if (!user.full_name) return "Veuillez renseigner votre nom complet.";
    if (!user.email) return "Veuillez ajouter une adresse email valide.";
    if (!user.phone_numbers?.length)
      return "Veuillez ajouter un numéro de téléphone.";
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8">
          <div className="py-4 sm:py-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
              Finaliser ma commande
            </h1>
            <p className="mt-1 sm:mt-2 text-sm text-gray-600">
              Complétez votre commande en quelques étapes simples
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Progress Steps */}
            <div className="mb-6 sm:mb-8">
              <nav aria-label="Progress">
                <ol className="flex items-center justify-between px-2 sm:px-0">
                  <StepIndicator
                    stepNumber={1}
                    title="Informations"
                    description="Vos coordonnées"
                    active={step === "info"}
                    completed={step !== "info"}
                  />
                  <div className="flex-1 mx-0.5 sm:mx-4">
                    <div className={clsx(
                      "h-0.5 transition-colors duration-300",
                      step !== "info" ? "bg-black" : "bg-gray-200"
                    )} />
                  </div>
                  <StepIndicator
                    stepNumber={2}
                    title="Livraison"
                    description="Mode de livraison"
                    active={step === "livraison"}
                    completed={step === "Finalisation"}
                  />
                  <div className="flex-1 mx-2 sm:mx-4">
                    <div className={clsx(
                      "h-0.5 transition-colors duration-300",
                      step === "Finalisation" ? "bg-black" : "bg-gray-200"
                    )} />
                  </div>
                  <StepIndicator
                    stepNumber={3}
                    title="Finalisation"
                    description="Confirmation"
                    active={step === "Finalisation"}
                    completed={false}
                  />
                </ol>
              </nav>
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {step === "info" && (
                <div className="p-1.5 sm:p-6 lg:p-8">
                  {user?.id ? (
                    <div className="space-y-6 sm:space-y-8">
                      <div>
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                          Vos informations personnelles
                        </h2>
                        <div className="space-y-4 sm:space-y-6">
                          <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                            <PersonalInfo />
                          </div>
                          <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                            <PhoneNumbers />
                          </div>
                        </div>
                      </div>

                      {!isPermitToProceed && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-red-800">
                                {getInfoErrorMessage()}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="pt-4 sm:pt-6 border-t border-gray-200">
                        <button
                          type="button"
                          disabled={!isPermitToProceed}
                          onClick={() => setStep("livraison")}
                          className={clsx(
                            "w-full flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-semibold transition-all duration-200 transform",
                            {
                              "bg-black text-white hover:bg-gray-800 hover:scale-[1.02] shadow-lg hover:shadow-xl": isPermitToProceed,
                              "bg-gray-200 text-gray-400 cursor-not-allowed": !isPermitToProceed,
                            }
                          )}
                          aria-label="Passer à l'étape livraison"
                        >
                          Continuer vers la livraison
                          <svg className="ml-2 h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <div className="mx-auto h-20 w-20 sm:h-24 sm:w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                        <svg className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                        Connexion requise
                      </h3>
                      <p className="text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
                        Pour finaliser votre commande, vous devez être connecté à votre compte.
                      </p>
                      <div className="space-y-3 sm:space-y-4">
                        <button
                          onClick={() => googleLogin({ apiUrl, serverApiUrl, storeId })}
                          className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
                        >
                          <FcGoogle size={20} />
                          <span className="text-sm sm:text-base font-semibold text-gray-700">
                            Continuer avec Google
                          </span>
                        </button>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Connexion sécurisée en un clic
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === "livraison" && (
                <div className="p-4 sm:p-6 lg:p-8">
                  <LivraisonStep step={step} setStep={setStep} />
                </div>
              )}

              {step === "Finalisation" && (
                <div className="p-4 sm:p-6 lg:p-8">
                  <FinalInfo step={step} setStep={setStep} />
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Récapitulatif de commande
                  </h3>
                </div>
                <div className="p-6">
                  <OrderSummary />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StepIndicatorProps {
  stepNumber: number;
  title: string;
  description: string;
  active: boolean;
  completed: boolean;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  stepNumber,
  title,
  description,
  active,
  completed
}) => (
  <div className="flex flex-col items-center text-center">
    <div className={clsx(
      "w-10 h-10 rounded-full flex items-center justify-center border-2 text-sm font-semibold transition-all duration-300",
      {
        "border-black bg-black text-white shadow-lg": active,
        "border-black bg-black text-white": completed,
        "border-gray-300 bg-white text-gray-400": !active && !completed,
      }
    )}>
      {completed ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ) : (
        stepNumber
      )}
    </div>
    <div className="mt-3 hidden sm:block">
      <p className={clsx(
        "text-sm font-medium transition-colors duration-300",
        active || completed ? "text-gray-900" : "text-gray-500"
      )}>
        {title}
      </p>
      <p className="text-xs text-gray-400 mt-1">
        {description}
      </p>
    </div>
    <div className="mt-2 sm:hidden">
      <p className={clsx(
        "text-xs font-medium transition-colors duration-300",
        active || completed ? "text-gray-900" : "text-gray-500"
      )}>
        {title}
      </p>
    </div>
  </div>
);