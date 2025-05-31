import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { FiEdit2, FiCheck, FiX, FiLoader, FiMail, FiUser } from "react-icons/fi";
import { useAuthStore } from "../../store/user";
import { update_user } from "../../api/user.api";
import { useMutation } from "@tanstack/react-query";

export const PersonalInfo = () => {
  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  const [fullName, setFullName] = useState(user?.full_name || "");
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(fullName);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (user?.full_name && user.full_name !== fullName) {
      setFullName(user.full_name);
      if (!isEditing) {
        setEditValue(user.full_name);
      }
    }
  }, [user?.full_name, fullName, isEditing]);

  const updateUserMutation = useMutation({
    mutationFn: update_user,
    onSuccess: async (data) => {
      await fetchUser({ token: useAuthStore.getState().token || undefined });
      setIsEditing(false);
      setErrorMessage(null);
    },
    onError: (error: any) => {
      setErrorMessage(error?.response?.data?.message || "Erreur lors de la mise à jour du nom. Veuillez réessayer.");
      console.error("Erreur lors de la mise à jour du nom :", error);
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
    if (updateUserMutation.isPending) return;

    if (!editValue.trim()) {
      setErrorMessage("Le nom ne peut pas être vide.");
      return;
    }
    if (editValue.length > 70) {
      setErrorMessage("Le nom ne peut pas dépasser 70 caractères.");
      return;
    }
    setErrorMessage(null);

    updateUserMutation.mutate({ full_name: editValue });
  };

  return (
    <div className="space-y-8">
      {/* Nom Complet - Design Card Moderne */}
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-100/50 to-slate-50/30 dark:from-slate-800/30 dark:to-slate-700/20 rounded-2xl blur-xl transition-all duration-500 group-hover:blur-2xl opacity-0 group-hover:opacity-100"></div>
        
        <div 
          className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-slate-900/20 hover:border-slate-300/80 dark:hover:border-slate-600/80"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-xl">
                <FiUser className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Nom complet
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Votre nom d'affichage public
                </p>
              </div>
            </div>
            
            {!isEditing && !updateUserMutation.isPending && (
              <button
                onClick={handleEditStart}
                className={`p-2.5 rounded-xl transition-all duration-300 ${
                  isHovered 
                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 scale-105' 
                    : 'bg-transparent text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
                aria-label="Modifier le nom complet"
              >
                <FiEdit2 size={18} />
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={editValue}
                  onChange={handleEditChange}
                  autoFocus
                  placeholder="Entrez votre nom complet"
                  className={`w-full px-4 py-3.5 text-base bg-slate-50/50 dark:bg-slate-800/50 border-2 rounded-xl
                              text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500
                              focus:ring-0 focus:border-slate-400 dark:focus:border-slate-500 outline-none
                              transition-all duration-300 backdrop-blur-sm
                              ${errorMessage 
                                ? 'border-red-400 dark:border-red-500 bg-red-50/50 dark:bg-red-900/20' 
                                : 'border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800'
                              }`}
                  aria-invalid={!!errorMessage}
                  aria-describedby={errorMessage ? "fullName-error" : undefined}
                  disabled={updateUserMutation.isPending}
                />
                {updateUserMutation.isPending && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <div className="relative">
                      <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-600 border-t-slate-600 dark:border-t-slate-300 rounded-full animate-spin"></div>
                    </div>
                  </div>
                )}
              </div>

              {errorMessage && (
                <div className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-red-700 dark:text-red-300">{errorMessage}</p>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleEditCancel}
                  disabled={updateUserMutation.isPending}
                  className="px-6 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-all duration-200 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={updateUserMutation.isPending || !!errorMessage}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 dark:from-slate-500 dark:to-slate-600 dark:hover:from-slate-600 dark:hover:to-slate-700 rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                  {updateUserMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <FiCheck size={16} /> Sauvegarder
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-2">
              {updateUserMutation.isPending ? (
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div className="w-4 h-4 border-2 border-slate-400 dark:border-slate-500 border-t-slate-600 dark:border-t-slate-300 rounded-full animate-spin"></div>
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Mise à jour en cours...</span>
                </div>
              ) : (
                <div className="p-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                  <p className="text-base font-medium text-slate-800 dark:text-slate-200">
                    {fullName || (
                      <span className="italic text-slate-500 dark:text-slate-400 font-normal">
                        Nom non défini - Cliquez pour ajouter
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Email - Design Card Moderne */}
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-indigo-50/20 dark:from-blue-900/20 dark:to-indigo-800/10 rounded-2xl blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
        
        <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-blue-200/10 dark:hover:shadow-blue-900/10 hover:border-blue-300/60 dark:hover:border-blue-600/40">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 rounded-xl">
              <FiMail className="w-5 h-5 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">
                Adresse e-mail
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Votre email de connexion (non modifiable)
              </p>
            </div>
          </div>
          
          <div className="p-3 bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-800 dark:to-blue-900/20 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <p className="text-base font-medium text-slate-700 dark:text-slate-300 break-all">
              {user?.email || (
                <span className="italic text-slate-500 dark:text-slate-400 font-normal">
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