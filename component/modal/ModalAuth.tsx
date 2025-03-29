import React, { useState } from "react";
import Modal from "./Modal";
import { useModalAuth } from "../../store/user";
import GoogleAuthButton from "../Auth/GoogleAuthButton";
import { twMerge } from "tailwind-merge";
import { BsX } from "react-icons/bs";

export default function ModalAuth() {
  const { close, isOpen, message, type } = useModalAuth((state) => state);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (type === "register" && password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setIsSubmitting(false);
      return;
    }

    try {
      close();
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    close();
    document.body.style.overflow = "auto";
  };

  return (
    <Modal
      styleContainer="flex items-end min-[500px]:items-center justify-center select-none size-full"
      zIndex={100}
      setHide={handleModalClose}
      isOpen={isOpen}
      animationName="translateBottom"
    >
      <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg max-h-[80dvh] md:max-w-[600px] overflow-auto">
        <button
          onClick={handleModalClose}
          className="absolute top-2 right-2 p-1 text-gray-600 hover:text-gray-800"
          aria-label="Fermer la fenêtre"
        >
          <BsX size={24} />
        </button>

        <h2 className="text-xl font-semibold text-center mb-2">
          {type === "login" ? "Connexion" : "Créer un compte"}
        </h2>
        <p className="text-sm text-gray-600 text-center mb-5">{message}</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
              required
            />
          </div>

          {type === "register" && (
            <div className="flex flex-col gap-1">
              <label htmlFor="confirm-password" className="text-sm font-medium">
                Confirmer le mot de passe
              </label>
              <input
                id="confirm-password"
                type="password"
                placeholder="Confirmation mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                required
              />
            </div>
          )}

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className={twMerge(
              "w-full py-2.5 bg-black/70 text-white rounded-md transition-colors duration-300",
              isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-black"
            )}
          >
            {isSubmitting
              ? "Chargement..."
              : type === "login"
              ? "Se connecter"
              : "S'inscrire"}
          </button>
        </form>

        {type === "login" && (
          <p className="text-center mt-3 text-sm">
            <button className="text-black underline hover:text-gray-700">
              Mot de passe oublié ?
            </button>
          </p>
        )}

        <div className="relative flex items-center my-4">
          <span className="w-full border-t border-gray-300"></span>
          <span className="px-2 text-sm text-gray-500">OU</span>
          <span className="w-full border-t border-gray-300"></span>
        </div>
        <div className="w-full flex justify-center">
          <GoogleAuthButton />
        </div>

        <p className="text-center mt-4 text-sm">
          {type === "login" ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
          <button
            className="text-black font-medium hover:underline"
            onClick={() =>
              useModalAuth
                .getState()
                .open(type === "login" ? "register" : "login")
            }
          >
            {type === "login" ? "S'inscrire" : "Se connecter"}
          </button>
        </p>
      </div>
    </Modal>
  );
}
