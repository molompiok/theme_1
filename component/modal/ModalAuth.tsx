import React, { useState } from "react";
import Modal from "./Modal";
import { useModalAuth } from "../../store/user";
import GoogleAuthButton from "../Auth/GoogleAuthButton";
import { twMerge } from "tailwind-merge";

export default function ModalAuth() {
  const { close, isOpen, message, type } = useModalAuth((state) => state);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit:", { email, password, type });
  };

  const handleModalClose = () => {
    close();
    document.body.style.overflow = "auto";
  };

  return (
    <Modal
      styleContainer="flex items-center select-none size-full justify-center"
      zIndex={100}
      setHide={handleModalClose}
      isOpen={isOpen}
      animationName="blur"
    >
      <div className="flex items-center bg-black justify-center font-primary relative  ">
          <div
            className={twMerge(
              "flex justify-center flex-col items-center bg-white p-7 rounded-lg shadow-lg transition-transform",
            )}
          >
            <h2 className="text-clamp-lg/5 font-semibold text-center mb-2">
              {type === "login" ? "Connexion" : "Créer un compte"}
            </h2>
            <h2 className="text-[.95rem]/6 mb-5 text-gray-900 text-center">
              {message}
            </h2>
            <form onSubmit={handleSubmit} className="flex w-full justify-center flex-col items-center gap-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-3 py-3 border rounded-md focus:ring focus:ring-indigo-300"
                required
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-3 py-3 border rounded-md focus:ring focus:ring-indigo-300"
                required
              />
              {type === "register" && (
                <input
                  type="confirm_password"
                  placeholder="Confirmation mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-3 py-3 border rounded-md focus:ring focus:ring-indigo-300"
                  required
                />
              )}
              <button
                type="submit"
                className=" w-[90%] pl-3 py-3 bg-black/70 text-white rounded-md hover:bg-black cursor-pointer transition-colors duration-300"
              >
                {type === "login" ? "Se connecter" : "S'inscrire"}
              </button>
            </form>

            {type === "login" && (
              <p className="text-center mt-3 text-sm">
                <button className="text-black underline">
                  Mot de passe oublié ?
                </button>
              </p>
            )}

            <div className="relative flex items-center my-1.5">
              <span className="w-full border-t"></span>
              <span className="px-2 text-sm text-gray-500">OU</span>
              <span className="w-full border-t"></span>
            </div>

            <GoogleAuthButton />

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
      </div>
    </Modal>
  );
}
