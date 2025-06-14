import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { FiCheck, FiEdit2, FiMail, FiUser } from "react-icons/fi";
import { useAuthStore } from "../../store/user";
import { update_user } from "../../api/user.api";
import { useMutation } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { usePageContext } from "vike-react/usePageContext";

export const PersonalInfo = () => {
  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  const [fullName, setFullName] = useState(user?.full_name || "");
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(fullName);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { api } = usePageContext();

  useEffect(() => {
    if (user?.full_name && user.full_name !== fullName) {
      setFullName(user.full_name);
      if (!isEditing) {
        setEditValue(user.full_name);
      }
    }
  }, [user?.full_name, fullName, isEditing]);

  const updateUserMutation = useMutation({
    mutationFn: (params: Parameters<typeof update_user>[0]) => update_user(params, api),
    onSuccess: async () => {
      await fetchUser(api, { token: useAuthStore.getState().token || undefined });
      setIsEditing(false);
      setErrorMessage(null);
    },
    onError: (error: any) => {
      setErrorMessage(
        error?.response?.data?.message ||
        "Erreur lors de la mise à jour. Veuillez réessayer."
      );
    },
  });

  const handleEditStart = () => {
    setIsEditing(true);
    setEditValue(fullName);
    setErrorMessage(null);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditValue(fullName);
    setErrorMessage(null);
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setEditValue(newValue);

    if (!newValue.trim()) {
      setErrorMessage("Le nom ne peut pas être vide.");
    } else if (newValue.length > 70) {
      setErrorMessage("Le nom ne peut pas dépasser 70 caractères.");
    } else {
      setErrorMessage(null);
    }
  };

  const handleEditSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (updateUserMutation.isPending || !!errorMessage) return;
    updateUserMutation.mutate({ full_name: editValue });
  };

  return (
    // CHANGEMENT: L'espacement vertical entre les cartes a été réduit
    <div className="space-y-5">
      {/* Nom Complet - Design Card Moderne */}
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-100/50 to-slate-50/30 rounded-2xl blur-xl transition-all duration-500 group-hover:blur-2xl opacity-0 group-hover:opacity-100"></div>

        <div
          // CHANGEMENT: Le padding est maintenant responsif (plus petit sur mobile)
          className="relative bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/20 hover:border-slate-300/80"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-start justify-between">
            {/* CHANGEMENT: Espacement et marge ajustés pour être plus compacts */}
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-br from-slate-100 to-slate-50 rounded-lg">
                <FiUser className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Nom complet
                </label>
                <p className="text-xs text-slate-500">
                  Votre nom d'affichage public
                </p>
              </div>
            </div>

            {!isEditing && !updateUserMutation.isPending && (
              <button
                onClick={handleEditStart}
                // CHANGEMENT: Padding du bouton d'édition ajusté
                className={`p-2 rounded-lg transition-all duration-300 ${isHovered
                    ? "bg-slate-100 text-slate-700 scale-105"
                    : "bg-transparent text-slate-400 hover:bg-slate-50"
                  }`}
                aria-label="Modifier le nom complet"
              >
                <FiEdit2 size={18} />
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={editValue}
                  onChange={handleEditChange}
                  autoFocus
                  placeholder="Entrez votre nom complet"
                  // CHANGEMENT: Padding du champ de texte et taille de police ajustés
                  className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base bg-slate-50/50 border-2 rounded-xl
                              text-slate-900 placeholder-slate-400
                              focus:ring-0 focus:border-slate-400 outline-none
                              transition-all duration-300 backdrop-blur-sm
                              ${errorMessage
                      ? "border-red-400 bg-red-50/50"
                      : "border-slate-200 focus:bg-white"
                    }`}
                  aria-invalid={!!errorMessage}
                  aria-describedby={errorMessage ? "fullName-error" : undefined}
                  disabled={updateUserMutation.isPending}
                />
                {updateUserMutation.isPending && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {errorMessage && (
                <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                  <p className="text-xs sm:text-sm text-red-700">
                    {errorMessage}
                  </p>
                </div>
              )}

              {/* CHANGEMENT: Espacement et padding des boutons ajustés */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleEditCancel}
                  disabled={updateUserMutation.isPending}
                  className="px-4 py-2 sm:px-5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={updateUserMutation.isPending || !!errorMessage}
                  className="px-4 py-2 sm:px-5 text-sm font-medium text-white bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
                >
                  {updateUserMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Sauvegarde...</span>
                    </>
                  ) : (
                    <>
                      <FiCheck size={16} /> <span>Sauvegarder</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-2">
              {updateUserMutation.isPending ? (
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-600 rounded-full animate-spin"></div>
                  <span className="text-slate-600 font-medium text-sm sm:text-base">
                    Mise à jour...
                  </span>
                </div>
              ) : (
                // CHANGEMENT: Padding et taille de police ajustés
                <div className="px-3 py-2.5 bg-slate-50/50 rounded-xl border border-slate-200/50">
                  <p className="text-sm sm:text-base font-medium text-slate-800">
                    {fullName || (
                      <span className="italic text-slate-500 font-normal">
                        Nom non défini
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Adresse E-mail */}
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-indigo-50/20 rounded-2xl blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>

        <div className="relative bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-lg hover:shadow-blue-200/10 hover:border-blue-300/60">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
              <FiMail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Adresse e-mail
              </label>
              <p className="text-xs text-slate-500">
                Votre email de connexion (non modifiable)
              </p>
            </div>
          </div>

          <div className="px-3 py-2.5 bg-gradient-to-r from-slate-50 to-blue-50/30 rounded-xl border border-slate-200/50">
            <p className="text-sm sm:text-base font-medium text-slate-700 break-all">
              {user?.email || (
                <span className="italic text-slate-500 font-normal">
                  Email non défini
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
