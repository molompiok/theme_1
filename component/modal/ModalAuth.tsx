import React from "react";
import Modal from "./Modal";
import { useModalAuth } from "../../store/user";
import { twMerge } from "tailwind-merge";
import { BsX } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { googleLogin } from "../../utils";
import { usePageContext } from "vike-react/usePageContext";

export default function ModalAuth() {
  const { close, isOpen, message, type } = useModalAuth((state) => state);
  const { apiUrl, serverApiUrl, storeId } = usePageContext();

  const handleModalClose = () => {
    close();
    document.body.style.overflow = "auto";
  };

  const handleGoogleAuth = async () => {
    try {
      googleLogin({ apiUrl, serverApiUrl, storeId });
      close();
    } catch (error) {
      console.error("Erreur d'authentification Google:", error);
    }
  };

  return (
    <Modal
      styleContainer="flex items-center justify-center select-none size-full backdrop-blur-sm"
      zIndex={100}
      setHide={handleModalClose}
      isOpen={isOpen}
      animationName="translateBottom"
    >
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header avec fermeture */}
        <div className="relative p-6 pb-4">
          <button
            onClick={handleModalClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all duration-200"
            aria-label="Fermer la fenêtre"
          >
            <BsX size={20} />
          </button>
        </div>

        {/* Contenu principal */}
        <div className="px-6 pb-8">
          {/* Logo ou icône */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-full"></div>
            </div>
          </div>

          {/* Titre et message */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {type === "login" ? "Bienvenue" : "Créer un compte"}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {message || "Connectez-vous facilement avec votre compte Google"}
            </p>
          </div>

          {/* Bouton Google Auth */}
          <div className="space-y-4">
            <button
              onClick={handleGoogleAuth}
              className="group w-full flex items-center justify-center gap-4 px-6 py-4 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex-shrink-0">
                <FcGoogle size={24} />
              </div>
              <span className="text-gray-700 font-medium text-base">
                Continuer avec Google
              </span>
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>

            {/* Divider décoratif */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-xs text-gray-500 uppercase tracking-wide">
                  Authentification sécurisée
                </span>
              </div>
            </div>

            {/* Informations de sécurité */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Vos données sont protégées par Google. Nous ne stockons
                    aucune information d'authentification.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
          <p className="text-center text-xs text-gray-500">
            En continuant, vous acceptez nos{" "}
            <button className="text-gray-700 hover:text-black font-medium underline">
              conditions d'utilisation
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
}
