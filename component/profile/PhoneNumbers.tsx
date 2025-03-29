import React, {
  useState,
  FormEvent,
  ChangeEvent,
  useCallback,
  useRef,
} from "react";
import { IMaskInput, IMask } from "react-imask";
import { FiEdit2, FiCheck, FiX } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";
import { useMutation } from "@tanstack/react-query";
import {
  create_user_phone,
  delete_user_phone,
  update_user_phone,
} from "../../api/user.api";
import { useAuthStore } from "../../store/user";
import clsx from "clsx";
import { FaPhone } from "react-icons/fa";

const getFlagEmoji = (isoCode: string): string => {
  return isoCode
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    .join("");
};

const formatPhoneNumber = (phone: string, mask: string) => {
  const Phonemask = IMask.createMask({ mask });
  return Phonemask.resolve(phone);
};

interface Country {
  name: string;
  code: string;
  length: number;
  mask: string;
}

interface UserPhone {
  id: string;
  phone_number: string;
  country_code?: string;
  format?: string;
}

const countries: Country[] = [
  {
    name: "Côte d'Ivoire",
    code: "ci_225",
    length: 10,
    mask: "+225 00 00 000 000",
  },
  { name: "France", code: "fr_33", length: 9, mask: "+33 0 00 00 00 00" },
  { name: "États-Unis", code: "us_1", length: 10, mask: "+1 000 000 0000" },
];

interface PhoneNumbersProps {
  maxItems?: number;
  style? : string;
  initialNumbers?: UserPhone[];
}

export const PhoneNumbers: React.FC<PhoneNumbersProps> = ({
  maxItems = 2,
  initialNumbers = [],
  style
}) => {
  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  const formRef = useRef<HTMLFormElement>(null);
  const [numbers, setNumbers] = useState<UserPhone[]>(
    user?.phone_numbers?.map((pn) => ({
      id: pn.id,
      phone_number: `+${pn.phone_number}`,
      country_code: pn.country_code,
      format: pn.format,
    })) || initialNumbers
  );
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [editState, setEditState] = useState<{
    index: number | null;
    value: string;
  }>({
    index: null,
    value: "",
  });

  const createUserPhoneMutation = useMutation({
    mutationFn: create_user_phone,
    onSuccess: () => {
      fetchUser();
      setPhoneError(null);
    },
    onError: (error) => {
      setPhoneError("Erreur lors de l'ajout du numéro. Veuillez réessayer.");
      console.error("Erreur lors de l'ajout du numero :", error);
    },
  });

  const updateUserPhoneMutation = useMutation({
    mutationFn: update_user_phone,
    onSuccess: () => {
      fetchUser();
      setPhoneError(null);
    },
    onError: (error) => {
      setPhoneError(
        "Erreur lors de la mise à jour du numéro. Veuillez réessayer."
      );
      console.error("Erreur lors de la mise à jour du numero :", error);
    },
  });

  const deleteUserPhoneMutation = useMutation({
    mutationFn: delete_user_phone,
    onSuccess: () => {
      fetchUser();
      setPhoneError(null);
    },
    onError: (error) => {
      setPhoneError(
        "Erreur lors de la suppression du numéro. Veuillez réessayer."
      );
      console.error("Erreur lors de la suppression du numero :", error);
    },
  });

  const isValidPhone = useCallback(
    (phone: string, country: Country): boolean => {
      const cleaned = phone.replace(/\s/g, "");
      const countryCode = country.code.split("_")[1];
      if (!cleaned.startsWith("+" + countryCode)) return false;
      const numberPart = cleaned.slice(countryCode.length + 1);
      return numberPart.length === country.length && /^\d+$/.test(numberPart);
    },
    []
  );

  const normalizePhoneNumber = useCallback(
    (phone: string, country: Country): string => {
      const cleaned = phone.replace(/\s/g, "");
      const countryCode = country.code.split("_")[1];
      if (cleaned.startsWith("0")) {
        return "+" + countryCode + cleaned.slice(1);
      }
      return cleaned.startsWith("+" + countryCode)
        ? cleaned
        : "+" + countryCode + cleaned;
    },
    []
  );

  const handleAddItem = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const input = formData.get("number") as string;
      const countryCode = formData.get("country") as string;

      if (!input || !input.trim()) {
        setPhoneError("Veuillez entrer un numéro.");
        return;
      }

      const selectedCountryFromForm = countries.find(
        (c) => c.code === countryCode
      );
      if (!selectedCountryFromForm) {
        setPhoneError("Pays non valide.");
        return;
      }

      const newValue = input.trim();
      if (!isValidPhone(newValue, selectedCountryFromForm)) {
        setPhoneError(
          `Format invalide. Exemple : ${selectedCountryFromForm.mask}`
        );
        return;
      }

      const normalizedNumber = normalizePhoneNumber(
        newValue,
        selectedCountryFromForm
      );
      if (numbers.some((n) => n.phone_number === normalizedNumber)) {
        setPhoneError("Ce numéro existe déjà.");
        return;
      }

      if (numbers.length < maxItems) {
        createUserPhoneMutation.mutate(
          {
            phone_number: normalizedNumber.replace(/^\+/, ""),
            country_code: selectedCountryFromForm.code,
            format: selectedCountryFromForm.mask,
          },
          {
            onSuccess: (data) => {
              if (data) {
                setNumbers((prev) => [
                  ...prev,
                  {
                    id: data.id,
                    phone_number: normalizedNumber,
                    country_code: selectedCountryFromForm.code,
                    format: selectedCountryFromForm.mask,
                  },
                ]);
              }
              if (formRef.current) {
                formRef.current.reset();
              }
              setPhoneError(null);
            },
          }
        );
      }
    },
    [numbers, maxItems, createUserPhoneMutation]
  );

  const handleDeleteItem = useCallback(
    (index: number) => {
      const phoneToDelete = numbers[index];
      if (phoneToDelete.id) {
        deleteUserPhoneMutation.mutate(
          { id: phoneToDelete.id },
          {
            onSuccess: () => {
              setNumbers((prev) => prev.filter((_, i) => i !== index));
            },
          }
        );
      } else {
      }
    },
    [numbers, deleteUserPhoneMutation]
  );

  const handleEditStart = useCallback((index: number, value: string) => {
    setEditState({ index, value });
    setPhoneError(null);
  }, []);

  const handleEditCancel = useCallback(() => {
    setEditState({ index: null, value: "" });
    setPhoneError(null);
  }, []);

  const handleEditChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setEditState((prev) => ({ ...prev, value: newValue }));
      if (newValue.trim() && !isValidPhone(newValue, selectedCountry)) {
        setPhoneError(`Format invalide. Exemple : ${selectedCountry.mask}`);
      } else {
        setPhoneError(null);
      }
    },
    [selectedCountry]
  );

  const handleEditSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const { index, value } = editState;
      if (!value.trim()) {
        setPhoneError("Le numéro ne peut pas être vide.");
        return;
      }

      if (!isValidPhone(value, selectedCountry)) {
        setPhoneError(`Format invalide. Exemple : ${selectedCountry.mask}`);
        return;
      }

      const normalizedNumber = normalizePhoneNumber(value, selectedCountry);
      if (
        numbers.some(
          (n) =>
            n.phone_number === normalizedNumber &&
            n.phone_number !== numbers[index!].phone_number
        )
      ) {
        setPhoneError("Ce numéro existe déjà.");
        return;
      }

      if (index !== null) {
        const phoneToUpdate = numbers[index];
        if (phoneToUpdate.id) {
          updateUserPhoneMutation.mutate(
            {
              id: phoneToUpdate.id,
              phone_number: normalizedNumber.replace(/^\+/, ""),
              country_code: selectedCountry.code,
              format: selectedCountry.mask,
            },
            {
              onSuccess: (data) => {
                const newNumbers = numbers.map((item, i) =>
                  i === index
                    ? {
                        id: phoneToUpdate.id,
                        phone_number: normalizedNumber,
                        country_code: selectedCountry.code,
                        format: selectedCountry.mask,
                      }
                    : item
                );
                setNumbers(newNumbers);
                handleEditCancel();
              },
            }
          );
        } else {
          // const newNumbers = numbers.map((item, i) =>
          //   i === index
          //     ? { ...item, phone_number: normalizedNumber }
          //     : item
          // );
          // setNumbers(newNumbers);
          handleEditCancel();
        }
      }
    },
    [
      editState,
      numbers,
      selectedCountry,
      updateUserPhoneMutation,
      handleEditCancel,
    ]
  );

  return (
    <section className={`w-full p-4 bg-gray-50 rounded-lg shadow-sm ${style}`}>
      <h2 className="text-lg mb-3 font-semibold text-gray-900">
          Numéros de téléphone <span className="text-gray-600 text-xs">({numbers.length}/{maxItems})</span>
        </h2>
      <ul className="space-y-4">
        {numbers.map((item, i) => (
          <li
            key={item.id || i}
            className="flex flex-col gap-3 px-3 py-1 justify-center items-start bg-white border-b-[.05rem] border-gray-300"
          >
            {editState.index === i ? (
              <form
                onSubmit={handleEditSubmit}
                className="flex flex-col gap-3 md:flex-row md:items-start"
              >
                <div className="flex-1">
                  <IMaskInput
                    mask={selectedCountry.mask}
                    value={editState.value}
                    lazy={false}
                    onChange={handleEditChange}
                    autoFocus
                    placeholder={`Ex: ${selectedCountry.mask}`}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none"
                  />
                  {phoneError && (
                    <p className="text-xs text-red-600 mt-1">{phoneError}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="p-2 text-green-600 hover:text-green-800"
                    aria-label="Sauvegarder les modifications"
                  >
                  <FiCheck size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={handleEditCancel}
                    className="p-2 text-red-600 hover:text-red-800"
                    aria-label="Annuler les modifications"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-2 items-center">
                  <FaPhone className="text-gray-500" size={16} />
                  <span className="text-sm font-bold text-gray-700">
                    Numéro {i + 1}
                  </span>
                  <span className="ml-1 text-sm text-gray-700 font-medium text-[1.03rem] break-all">
                    {IMask.pipe(item.phone_number, {
                      mask: item.format,
                    })}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditStart(i, item.phone_number)}
                    className="p-2 text-gray-600 hover:text-gray-800"
                    aria-label={`Modifier le numéro ${i + 1}`}
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(i)}
                    className="p-2 text-gray-600 hover:text-red-600"
                    aria-label={`Supprimer le numéro ${i + 1}`}
                  >
                    <BsTrash size={18} />
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-7 mb-3">
      
        {numbers.length >= maxItems ? (
          <p className="text-sm text-gray-600">
            Nombre maximum de numéros atteint.
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Ajoutez ou modifiez vos numéros ci-dessous.
          </p>
        )}
      </div>
      <form
        ref={formRef}
        onSubmit={handleAddItem}
        className={clsx("flex-col gap-3 md:flex-row md:items-end mb-5", {
          'hidden' : numbers.length >= maxItems,
          'flex' : numbers.length < maxItems
        })}
      >
        <div className="flex flex-col gap-1 w-full md:w-auto">
          <label htmlFor="country" className="text-sm text-gray-700">
            Pays
          </label>
          <select
            id="country"
            name="country"
            value={selectedCountry.code}
            onChange={(e) =>
              setSelectedCountry(
                countries.find((c) => c.code === e.target.value)!
              )
            }
            className="w-full min-w-[100px] max-w-[150px] p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none"
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {getFlagEmoji(country.code.split("_")[0].toUpperCase())} +
                {country.code.split("_")[1]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="number" className="text-sm text-gray-700">
            Numéro de téléphone
          </label>
          <IMaskInput
            name="number"
            mask={selectedCountry.mask}
            lazy={false}
            disabled={
              numbers.length >= maxItems ||
              createUserPhoneMutation.isPending ||
              updateUserPhoneMutation.isPending ||
              deleteUserPhoneMutation.isPending
            }
            placeholder={`Ex: ${selectedCountry.mask}`}
            className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:outline-none ${
              numbers.length >= maxItems ||
              createUserPhoneMutation.isPending ||
              updateUserPhoneMutation.isPending ||
              deleteUserPhoneMutation.isPending
                ? "bg-gray-200 border-gray-300 cursor-not-allowed"
                : "border-gray-300 focus:ring-gray-500"
            }`}
          />
          {phoneError && (
            <p className="text-xs text-red-500 font-semibold mt-1">{phoneError}</p>
          )}
          {(createUserPhoneMutation.isPending ||
            updateUserPhoneMutation.isPending ||
            deleteUserPhoneMutation.isPending) && (
            <p className="text-xs text-gray-600 mt-1">Traitement en cours...</p>
          )}
        </div>
        <button
          type="submit"
          disabled={
            numbers.length >= maxItems ||
            createUserPhoneMutation.isPending ||
            updateUserPhoneMutation.isPending ||
            deleteUserPhoneMutation.isPending
          }
          className="w-full md:w-auto px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Ajouter
        </button>
      </form>

    </section>
  );
};
