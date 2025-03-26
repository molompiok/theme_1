import React, { useState, FormEvent, ChangeEvent } from "react";
import { FiEdit2, FiCheck, FiX } from "react-icons/fi";
import { useAuthStore } from "../../store/user";
import { update_user } from "../../api/user.api";
import { useMutation } from "@tanstack/react-query";

interface PersonalInfoProps {
  fullName: string;
  email: string;
  onSave: (fullName: string) => void;
}

export const PersonalInfo = ({}) => {
  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(fullName);
  const [error, setError] = useState<string | null>(null);

  const updateUserMutation = useMutation({
    mutationFn: update_user,
    onSuccess: () => {
      fetchUser();
      setError(null);
    },
    onError: (error) => {
      setError("Erreur lors de la mise à jour du numéro. Veuillez réessayer.");
      console.error("Erreur lors de la mise à jour du numero :", error);
    },
  });

  const handleEditStart = () => {
    setIsEditing(true);
    setEditValue(fullName);
    setError(null);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditValue(fullName);
    setError(null);
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setEditValue(newValue);
    if (!newValue.trim()) {
      setError("Le nom ne peut pas être vide.");
    } else if (newValue.length > 50) {
      setError("Le nom ne peut pas dépasser 50 caractères.");
    } else {
      setError(null);
    }
  };

  const handleEditSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editValue.trim()) {
      setError("Le nom ne peut pas être vide.");
      return;
    }
    if (editValue.length > 50) {
      setError("Le nom ne peut pas dépasser 50 caractères.");
      return;
    }
    updateUserMutation.mutate(
      { full_name: editValue },
      {
        onSuccess: (data) => {
          setFullName(editValue);
        },
      }
    );
    setIsEditing(false);
    setError(null);
  };

  return (
    <section className="w-full p-4 bg-gray-50 rounded-lg shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Informations personnelles
        </h2>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <div className="flex md:items-center md:justify-between">
            <label
              htmlFor="fullName"
              className="text-sm font-medium text-gray-900"
            >
              Nom complet
            </label>
            {!isEditing && (
              <button
                onClick={handleEditStart}
                className="p-2 text-gray-600 hover:text-gray-600"
                aria-label="Modifier le nom complet"
              >
                <FiEdit2 size={18} />
              </button>
            )}
          </div>
          {isEditing ? (
            <form
              onSubmit={handleEditSubmit}
              className="flex flex-col gap-0 md:flex-row md:items-start"
            >
              <div className="flex-1">
                <input
                  id="fullName"
                  type="text"
                  value={editValue}
                  onChange={handleEditChange}
                  autoFocus
                  placeholder="Entrez votre nom complet"
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none"
                />
                {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="p-2 text-green-600 hover:text-green-800"
                  aria-label="Sauvegarder"
                >
                  <FiCheck size={20} />
                </button>
                <button
                  type="button"
                  onClick={handleEditCancel}
                  className="p-2 text-red-600 hover:text-red-800"
                  aria-label="Annuler"
                >
                  <FiX size={20} />
                </button>
              </div>
            </form>
          ) : (
            <p className="text-sm text-gray-700 break-all">{fullName}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-900">
            Email
          </label>
          <p id="email" className="text-sm text-gray-700 break-all">
            {user?.email}
          </p>
        </div>
      </div>
    </section>
  );
};
