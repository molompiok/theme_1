import React, {
  useState,
  FormEvent,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  ChangeEvent,
} from "react";
import { IMaskInput, IMask, IMaskInputProps } from "react-imask";
import { FiEdit2, FiCheck, FiX, FiPlus, FiLoader, FiPhone, FiGlobe } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  create_user_phone,
  delete_user_phone,
  update_user_phone,
} from "../../api/user.api"; // Assurez-vous que ce chemin est correct
import { useAuthStore } from "../../store/user"; // Assurez-vous que ce chemin est correct
import clsx from "clsx";

// Helper pour les drapeaux
const getFlagEmoji = (isoCode: string): string => {
  if (!isoCode || isoCode.length < 2) return "🌐";
  return isoCode
    .toUpperCase()
    .slice(0, 2)
    .split("")
    .map((char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    .join("");
};

interface Country {
  name: string;
  iso: string;
  dialCode: string;
  mask: string;
  example: string;
  maxLength: number;
}

const countries: Country[] = [
  { name: "Côte d'Ivoire", iso: "CI", dialCode: "225", mask: "+225 00 00 00 00 00", example: "0102030405", maxLength: 10 },
  { name: "France", iso: "FR", dialCode: "33", mask: "+33 0 00 00 00 00", example: "612345678", maxLength: 9 },
  { name: "États-Unis", iso: "US", dialCode: "1", mask: "+1 (000) 000-0000", example: "2025550100", maxLength: 10 },
];

interface UserPhoneFromApi {
  id: string;
  phone_number: string;
  country_code?: string; // Ex: "CI_225" ou "CI" ou "225"
  format?: string;
}

interface UserPhone {
  id: string;
  phone_number: string; // Numéro normalisé, ex: +2250102030405
  country_iso: string;
  display_format: string;
}

interface PhoneNumbersProps {
  maxItems?: number;
}

export const PhoneNumbers: React.FC<PhoneNumbersProps> = ({ maxItems = 3 }) => {
  const queryClient = useQueryClient();
  const phoneNumbersFromStore = useAuthStore((state) => state.user?.phone_numbers);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  const normalizePhoneNumberFromApi = useCallback((apiPhone: UserPhoneFromApi): UserPhone | null => {
    let country: Country | undefined;
    if (apiPhone.country_code) {
      const parts = apiPhone.country_code.split("_");
      const isoPart = parts[0].toUpperCase();
      const dialCodePart = parts.length > 1 ? parts[1] : undefined;
      country = countries.find(c => c.iso === isoPart || (dialCodePart && c.dialCode === dialCodePart));
    }
    
    if (!country) {
      // Fallback: essayer de déduire le pays à partir du numéro de téléphone lui-même
      country = countries.find(c => apiPhone.phone_number.startsWith("+" + c.dialCode)) ||
                countries.find(c => apiPhone.phone_number.startsWith(c.dialCode));
    }
    
    if (!country) {
      console.warn("Impossible de déterminer le pays pour:", apiPhone);
      // Tenter une normalisation générique si aucun pays n'est trouvé
      // Cela pourrait être risqué si le format n'est pas international.
      // Pour l'instant, on retourne null si le pays n'est pas trouvé.
      return null;
    }

    let numberPart = apiPhone.phone_number.replace(/\D/g, "");
    // S'assurer que numberPart ne contient que les chiffres après l'indicatif
    if (numberPart.startsWith(country.dialCode)) {
      numberPart = numberPart.substring(country.dialCode.length);
    }

    return {
      id: apiPhone.id,
      phone_number: `+${country.dialCode}${numberPart}`, // Numéro E.164
      country_iso: country.iso,
      display_format: apiPhone.format || country.mask, // Utiliser le format de l'API s'il existe, sinon celui du pays
    };
  }, []);

  const derivedInitialNumbers = useMemo(() => {
    return (phoneNumbersFromStore || [])
      .map(normalizePhoneNumberFromApi)
      .filter((p): p is UserPhone => p !== null);
  }, [phoneNumbersFromStore, normalizePhoneNumberFromApi]);

  const [numbers, setNumbers] = useState<UserPhone[]>(derivedInitialNumbers);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormCountry, setAddFormCountry] = useState<Country>(countries[0]);
  const [addFormValue, setAddFormValue] = useState("");
  const [addFormError, setAddFormError] = useState<string | null>(null);
  const [editState, setEditState] = useState<{
    id: string | null;
    country: Country;
    value: string;
  } | null>(null);
  const [editFormError, setEditFormError] = useState<string | null>(null);
  const [hoveredPhone, setHoveredPhone] = useState<string | null>(null);

  const addFormRef = useRef<HTMLFormElement>(null);
  const editFormRef = useRef<HTMLFormElement>(null); // Corrigé: HTMLFormElement

  useEffect(() => {
    setNumbers(derivedInitialNumbers);
  }, [derivedInitialNumbers]);
  
  useEffect(() => {
    // Si le formulaire d'ajout est affiché, pré-remplir la valeur avec le masque
    if (showAddForm) {
      setAddFormValue(IMask.pipe(`+${addFormCountry.dialCode}`, { mask: addFormCountry.mask } as any));
    }
  }, [showAddForm, addFormCountry]);


  const commonMutationOptions = {
    onSuccess: () => {
      fetchUser({ token: useAuthStore.getState().token || undefined });
      // Invalider les requêtes liées aux numéros de téléphone pour rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ['user_phones'] }); // ou une clé plus spécifique si utilisée ailleurs
    },
  };

  const createUserPhoneMutation = useMutation({
    mutationFn: create_user_phone,
    ...commonMutationOptions,
    onSuccess: (data) => {
      commonMutationOptions.onSuccess();
      setShowAddForm(false);
      setAddFormValue("");
      setAddFormError(null);
    },
    onError: (error: any) => {
      setAddFormError(error?.response?.data?.message || "Erreur lors de l'ajout. Réessayez.");
    }
  });

  const updateUserPhoneMutation = useMutation({
    mutationFn: update_user_phone,
    ...commonMutationOptions,
    onSuccess: (data) => {
      commonMutationOptions.onSuccess();
      setEditState(null);
      setEditFormError(null);
    },
    onError: (error: any) => {
      setEditFormError(error?.response?.data?.message || "Erreur de mise à jour. Réessayez.");
    }
  });

  const deleteUserPhoneMutation = useMutation({
    mutationFn: delete_user_phone,
    ...commonMutationOptions,
    onError: (error: any) => {
      console.error("Erreur suppression:", error);
      // Potentiellement afficher une notification d'erreur à l'utilisateur ici
    }
  });

  // Validation functions
  const getRawDigits = (maskedValue: string) => maskedValue.replace(/\D/g, "");

  const isValidPhoneNumber = (maskedValue: string, country: Country): boolean => {
    const rawDigits = getRawDigits(maskedValue);
    // Vérifie si le numéro commence par l'indicatif du pays et si la longueur du reste correspond
    return rawDigits.startsWith(country.dialCode) && (rawDigits.length - country.dialCode.length) === country.maxLength;
  };

  const getNormalizedPhoneNumber = (maskedValue: string, country: Country): string => {
    const rawDigits = getRawDigits(maskedValue);
    return `+${rawDigits}`; // Format E.164
  };
  
  const getLocalPhoneNumber = (maskedValue: string, country: Country): string => {
    const rawDigits = getRawDigits(maskedValue);
    if (rawDigits.startsWith(country.dialCode)) {
      return rawDigits.substring(country.dialCode.length);
    }
    return rawDigits; // Fallback si l'indicatif n'est pas présent (devrait l'être avec le masque)
  };


  // Add form handlers
  const handleAddFormCountryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newCountry = countries.find(c => c.iso === e.target.value) || countries[0];
    setAddFormCountry(newCountry);
    setAddFormValue(IMask.pipe(`+${newCountry.dialCode}`, { mask: newCountry.mask } as any));
    setAddFormError(null);
  };

  const handleAddFormValueChange = (value: string) => {
    setAddFormValue(value);
    if (value.trim() && !isValidPhoneNumber(value, addFormCountry)) {
      setAddFormError(`Format invalide pour ${addFormCountry.name}. Attendu: ${addFormCountry.mask.replace('0', '#')}`);
    } else {
      setAddFormError(null);
    }
  };

  const handleAddSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (createUserPhoneMutation.isPending || addFormError) return;

    if (!addFormValue.trim() || !isValidPhoneNumber(addFormValue, addFormCountry)) {
      setAddFormError(`Format invalide. Exemple: ${addFormCountry.mask.replace('0', '#')}`);
      return;
    }
    const normalizedNumber = getNormalizedPhoneNumber(addFormValue, addFormCountry);
    if (numbers.some(n => n.phone_number === normalizedNumber)) {
      setAddFormError("Ce numéro existe déjà.");
      return;
    }
    createUserPhoneMutation.mutate({
      phone_number: getLocalPhoneNumber(addFormValue, addFormCountry),
      country_code: `${addFormCountry.iso}_${addFormCountry.dialCode}`, // Envoi ISO_DIALCODE
      format: addFormCountry.mask,
    });
  };

  // Edit form handlers
  const handleEditStart = (phone: UserPhone) => {
    const country = countries.find(c => c.iso === phone.country_iso) || countries[0];
    setEditState({
      id: phone.id,
      country: country,
      value: IMask.pipe(phone.phone_number, { mask: country.mask } as any),
    });
    setShowAddForm(false); // Cacher le formulaire d'ajout si ouvert
    setEditFormError(null);
  };

  const handleEditFormCountryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (!editState) return;
    const newCountry = countries.find(c => c.iso === e.target.value) || countries[0];
    setEditState(prev => prev ? {
      ...prev,
      country: newCountry,
      value: IMask.pipe(`+${newCountry.dialCode}`, {mask: newCountry.mask} as any)
    } : null);
    setEditFormError(null);
  };

  const handleEditFormValueChange = (value: string) => {
    if (!editState) return;
    setEditState(prev => prev ? { ...prev, value } : null);
    if (value.trim() && !isValidPhoneNumber(value, editState.country)) {
      setEditFormError(`Format invalide pour ${editState.country.name}. Attendu: ${editState.country.mask.replace('0', '#')}`);
    } else {
      setEditFormError(null);
    }
  };

  const handleEditSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editState || updateUserPhoneMutation.isPending || editFormError) return;

    if (!editState.value.trim() || !isValidPhoneNumber(editState.value, editState.country)) {
      setEditFormError(`Format invalide. Exemple: ${editState.country.mask.replace('0', '#')}`);
      return;
    }
    const normalizedNumber = getNormalizedPhoneNumber(editState.value, editState.country);
    if (numbers.some(n => n.phone_number === normalizedNumber && n.id !== editState.id)) {
      setEditFormError("Ce numéro existe déjà.");
      return;
    }
    updateUserPhoneMutation.mutate({
      id: editState.id!,
      phone_number: getLocalPhoneNumber(editState.value, editState.country),
      country_code: `${editState.country.iso}_${editState.country.dialCode}`, // Envoi ISO_DIALCODE
      format: editState.country.mask,
    });
  };

  const handleCancelEdit = () => {
    setEditState(null);
    setEditFormError(null);
  };

  const handleDelete = (id: string) => {
    if (deleteUserPhoneMutation.isPending) return;
    deleteUserPhoneMutation.mutate({ id });
  };

  const isAnyMutationPending = createUserPhoneMutation.isPending || updateUserPhoneMutation.isPending || deleteUserPhoneMutation.isPending;

  return (
    <div className="space-y-6">
      {/* En-tête avec icône */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/20 rounded-xl">
          <FiPhone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            Numéros de téléphone
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Gérez vos numéros de contact ({numbers.length}/{maxItems})
          </p>
        </div>
      </div>

      {/* Liste des numéros existants */}
      {numbers.length > 0 && (
        <div className="space-y-4">
          {numbers.map((phone, index) => (
            <div
              key={phone.id}
              className="group relative"
              onMouseEnter={() => setHoveredPhone(phone.id)}
              onMouseLeave={() => setHoveredPhone(null)}
            >
              {/* Effet de glow au hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/20 to-blue-50/10 dark:from-emerald-900/10 dark:to-blue-800/5 rounded-2xl blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
              
              <div className={clsx(
                "relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300",
                editState?.id === phone.id
                  ? "border-slate-400 dark:border-slate-500 shadow-xl shadow-slate-200/20 dark:shadow-slate-900/20"
                  : "border-slate-200/60 dark:border-slate-700/60 hover:border-slate-300/80 dark:hover:border-slate-600/80 hover:shadow-lg hover:shadow-slate-200/10 dark:hover:shadow-slate-900/10"
              )}>
                {editState?.id === phone.id ? (
                  // Formulaire d'édition moderne
                  <form ref={editFormRef} onSubmit={handleEditSubmit} className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg">
                        <FiEdit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Modification du numéro
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="md:col-span-2">
                        <label htmlFor={`edit-country-${phone.id}`} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Pays
                        </label>
                        <div className="relative">
                          <select
                            id={`edit-country-${phone.id}`}
                            value={editState.country.iso}
                            onChange={handleEditFormCountryChange}
                            disabled={updateUserPhoneMutation.isPending}
                            className="w-full pl-4 pr-10 py-3 text-sm bg-slate-50/50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-slate-400 dark:focus:border-slate-500 focus:ring-0 outline-none transition-all duration-300 text-slate-900 dark:text-slate-100 appearance-none cursor-pointer"
                          >
                            {countries.map(c => (
                              <option key={c.iso} value={c.iso}>
                                {getFlagEmoji(c.iso)} {c.name} (+{c.dialCode})
                              </option>
                            ))}
                          </select>
                          <FiGlobe className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                        </div>
                      </div>
                      
                      <div className="md:col-span-3">
                        <label htmlFor={`edit-phone-${phone.id}`} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Numéro de téléphone
                        </label>
                        <IMaskInput
                          id={`edit-phone-${phone.id}`}
                          mask={editState.country.mask}
                          value={editState.value}
                          lazy={false}
                          unmask={false} // garder le masque pour l'affichage
                          onAccept={handleEditFormValueChange}
                          autoFocus
                          disabled={updateUserPhoneMutation.isPending}
                          placeholder={`Ex: ${editState.country.mask.replace('0', '#')}`}
                          key={`${editState.id}-${editState.country.iso}`} // Clé pour forcer le re-rendu si le pays/masque change
                          className="w-full px-4 py-3 text-sm bg-slate-50/50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-slate-400 dark:focus:border-slate-500 focus:ring-0 outline-none transition-all duration-300 text-slate-900 dark:text-slate-100"
                        />
                      </div>
                    </div>

                    {editFormError && (
                      <div className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <p className="text-sm text-red-700 dark:text-red-300">{editFormError}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        disabled={updateUserPhoneMutation.isPending}
                        className="px-6 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-all duration-200 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={updateUserPhoneMutation.isPending || !!editFormError}
                        className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 dark:from-slate-500 dark:to-slate-600 dark:hover:from-slate-600 dark:hover:to-slate-700 rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                      >
                        {updateUserPhoneMutation.isPending ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Sauvegarde...
                          </>
                        ) : (
                          <>
                            <FiCheck size={16} /> Enregistrer
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  // Affichage du numéro moderne
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/20 rounded-xl">
                          <span className="text-lg">{getFlagEmoji(phone.country_iso)}</span>
                        </div>
                        <div>
                          <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
                            {IMask.pipe(phone.phone_number, { mask: phone.display_format } as any)}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {countries.find(c => c.iso === phone.country_iso)?.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className={clsx(
                      "flex items-center gap-2 transition-all duration-300",
                      hoveredPhone === phone.id ? "opacity-100 scale-100" : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
                    )}>
                      <button
                        onClick={() => handleEditStart(phone)}
                        disabled={isAnyMutationPending || !!editState} // Désactiver si une mutation est en cours OU si un autre formulaire d'édition est déjà ouvert
                        className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-100/50 dark:bg-slate-700/50 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
                        aria-label="Modifier ce numéro"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(phone.id)}
                        disabled={isAnyMutationPending || !!editState} // Désactiver si une mutation est en cours OU si un formulaire d'édition est ouvert
                        className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 bg-slate-100/50 dark:bg-slate-700/50 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
                        aria-label="Supprimer ce numéro"
                      >
                        {deleteUserPhoneMutation.isPending && deleteUserPhoneMutation.variables?.id === phone.id ? (
                          <div className="w-4 h-4 border-2 border-red-400/50 border-t-red-600 rounded-full animate-spin"></div>
                        ) : (
                          <BsTrash size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formulaire d'ajout moderne */}
      {showAddForm && numbers.length < maxItems && (
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/30 to-blue-50/20 dark:from-emerald-900/20 dark:to-blue-800/10 rounded-2xl blur-xl"></div>
          
          <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 shadow-xl">
            <form ref={addFormRef} onSubmit={handleAddSubmit} className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/20 rounded-xl">
                  <FiPlus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                    Ajouter un nouveau numéro
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Renseignez les informations de votre numéro de téléphone
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="add-country" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Sélectionner le pays
                  </label>
                  <div className="relative">
                    <select
                      id="add-country"
                      value={addFormCountry.iso}
                      onChange={handleAddFormCountryChange}
                      disabled={createUserPhoneMutation.isPending}
                      className="w-full pl-4 pr-10 py-3 text-sm bg-slate-50/50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-emerald-400 dark:focus:border-emerald-500 focus:ring-0 outline-none transition-all duration-300 text-slate-900 dark:text-slate-100 appearance-none cursor-pointer"
                    >
                      {countries.map(c => (
                        <option key={c.iso} value={c.iso}>
                          {getFlagEmoji(c.iso)} {c.name} (+{c.dialCode})
                        </option>
                      ))}
                    </select>
                    <FiGlobe className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                  </div>
                </div>
                
                <div className="md:col-span-3">
                  <label htmlFor="add-phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Numéro de téléphone
                  </label>
                  <IMaskInput
                    id="add-phone"
                    mask={addFormCountry.mask}
                    value={addFormValue} // Doit être la valeur masquée complète
                    lazy={false}
                    unmask={false} // Important: garder le masque pour l'affichage et la validation
                    onAccept={(value, maskRef) => handleAddFormValueChange(value)}
                    disabled={createUserPhoneMutation.isPending}
                    placeholder={`Ex: ${addFormCountry.mask.replace('0', '#')}`}
                    key={addFormCountry.iso} // Pour forcer le re-rendu du composant iMask si le pays (et donc le masque) change
                    className="w-full px-4 py-3 text-sm bg-slate-50/50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-emerald-400 dark:focus:border-emerald-500 focus:ring-0 outline-none transition-all duration-300 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {addFormError && (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-red-700 dark:text-red-300">{addFormError}</p>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {setShowAddForm(false); setAddFormError(null); setAddFormValue("");}}
                  disabled={createUserPhoneMutation.isPending}
                  className="px-6 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-all duration-200 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={createUserPhoneMutation.isPending || !!addFormError}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 dark:from-emerald-500 dark:to-emerald-600 dark:hover:from-emerald-600 dark:hover:to-emerald-700 rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                  {createUserPhoneMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Ajout en cours...
                    </>
                  ) : (
                    <>
                      <FiPlus size={16} /> Ajouter le numéro
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bouton d'ajout élégant */}
      {!showAddForm && numbers.length < maxItems && !editState && (
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/20 to-blue-50/10 dark:from-emerald-900/10 dark:to-blue-800/5 rounded-2xl blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
          
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditState(null); // Assurer qu'on n'est pas en mode édition
              const defaultCountry = countries[0];
              setAddFormCountry(defaultCountry);
              // La valeur sera initialisée par useEffect [showAddForm, addFormCountry]
              // ou vous pouvez le faire explicitement ici:
              // setAddFormValue(IMask.pipe(`+${defaultCountry.dialCode}`, { mask: defaultCountry.mask } as any));
              setAddFormError(null);
            }}
            disabled={isAnyMutationPending}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-gradient-to-br from-emerald-50 to-emerald-100/60 dark:from-emerald-900/30 dark:to-emerald-800/40 border-2 border-dashed border-emerald-300 dark:border-emerald-700/80 rounded-2xl hover:border-solid hover:border-emerald-400 dark:hover:border-emerald-600 hover:bg-gradient-to-br hover:from-emerald-100 hover:to-emerald-200/60 dark:hover:from-emerald-800/40 dark:hover:to-emerald-700/50 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed group-hover:shadow-lg group-hover:shadow-emerald-500/10"
          >
            <FiPlus size={18} className="transition-transform duration-300 group-hover:rotate-90" />
            Ajouter un nouveau numéro
          </button>
        </div>
      )}
    </div>
  );
};