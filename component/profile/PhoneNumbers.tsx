import React, { useState, useRef, FormEvent, ChangeEvent } from "react";
import { IMaskInput } from "react-imask";
import { FiEdit2, FiCheck, FiX } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";

interface Country {
  name: string;
  code: string;
  length: number;
  mask: string;
}

interface PhoneNumbersProps {
  initialNumbers: string[];
  countries: Country[];
  maxItems?: number;
  onSave: (numbers: string[]) => void;
}

export const PhoneNumbers: React.FC<PhoneNumbersProps> = ({
  initialNumbers,
  countries,
  maxItems = 2,
  onSave,
}) => {
  const [numbers, setNumbers] = useState<string[]>(initialNumbers);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [editState, setEditState] = useState<{
    index: number | null;
    value: string;
  }>({ index: null, value: "" });
  const numberInputRef = useRef<HTMLInputElement>(null);

  const isValidPhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\s/g, "");
    const country = countries.find((c) => cleaned.startsWith(c.code));
    if (!country) return false;
    const numberPart = cleaned.slice(country.code.length);
    return numberPart.length === country.length && /^\d+$/.test(numberPart);
  };

  const normalizePhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\s/g, "");
    const country = countries.find(
      (c) => cleaned.startsWith(c.code) || cleaned.startsWith("0")
    );
    if (!country) return cleaned;
    return cleaned.startsWith("0") ? country.code + cleaned.slice(1) : cleaned;
  };

  const handleAddItem = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = numberInputRef.current;
    if (!input || !input.value.trim()) {
      setPhoneError("Veuillez entrer un numéro.");
      return;
    }
    const newValue = input.value.trim();
    if (!isValidPhone(newValue)) {
      setPhoneError(`Format invalide. Exemple : ${selectedCountry.mask}`);
      return;
    }
    const normalizedNumber = normalizePhoneNumber(newValue);
    if (numbers.includes(normalizedNumber)) {
      setPhoneError("Ce numéro existe déjà.");
      return;
    }
    if (numbers.length < maxItems) {
      setNumbers((prev) => [...prev, normalizedNumber]);
      onSave([...numbers, normalizedNumber]);
      input.value = "";
      setPhoneError(null);
    }
  };

  const handleDeleteItem = (index: number) => {
    const newNumbers = numbers.filter((_, i) => i !== index);
    setNumbers(newNumbers);
    onSave(newNumbers);
  };

  const handleEditStart = (index: number, value: string) => {
    setEditState({ index, value });
    setPhoneError(null);
  };

  const handleEditCancel = () => {
    setEditState({ index: null, value: "" });
    setPhoneError(null);
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setEditState((prev) => ({ ...prev, value: newValue }));
    if (newValue.trim() && !isValidPhone(newValue)) {
      setPhoneError(`Format invalide. Exemple : ${selectedCountry.mask}`);
    } else {
      setPhoneError(null);
    }
  };

  const handleEditSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { index, value } = editState;
    if (!value.trim()) {
      setPhoneError("Le numéro ne peut pas être vide.");
      return;
    }
    if (!isValidPhone(value)) {
      setPhoneError(`Format invalide. Exemple : ${selectedCountry.mask}`);
      return;
    }
    const normalizedNumber = normalizePhoneNumber(value);
    if (numbers.includes(normalizedNumber) && numbers[index!] !== normalizedNumber) {
      setPhoneError("Ce numéro existe déjà.");
      return;
    }
    if (index !== null) {
      const newNumbers = numbers.map((item, i) =>
        i === index ? normalizedNumber : item
      );
      setNumbers(newNumbers);
      onSave(newNumbers);
      handleEditCancel();
    }
  };

  return (
    <section className="w-full p-4 bg-gray-50 rounded-lg shadow-sm">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Numéros de téléphone ({numbers.length}/{maxItems})
        </h2>
        <p className="text-sm text-gray-600">
          Ajoutez ou modifiez vos numéros ci-dessous.
        </p>
      </div>

      {/* Form d'ajout */}
      <form
        onSubmit={handleAddItem}
        className="flex flex-col gap-3 mb-6 md:flex-row md:items-start"
      >
        <div className="flex flex-col gap-1 w-full md:w-auto">
          <label htmlFor="country-select" className="sr-only">
            Pays
          </label>
          <select
            id="country-select"
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
                {country.name} ({country.code})
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="phone-input" className="sr-only">
            Numéro de téléphone
          </label>
          <IMaskInput
            id="phone-input"
            mask={selectedCountry.mask}
            inputRef={numberInputRef as React.RefObject<HTMLInputElement>}
            disabled={numbers.length >= maxItems}
            placeholder={`Ex: ${selectedCountry.mask}`}
            className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:outline-none ${
              numbers.length >= maxItems
                ? "bg-gray-200 border-gray-300 cursor-not-allowed"
                : "border-gray-300 focus:ring-gray-500"
            }`}
          />
          {phoneError && (
            <p className="text-xs text-red-600 mt-1">{phoneError}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={numbers.length >= maxItems}
          className="w-full md:w-auto px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Ajouter
        </button>
      </form>

      {/* Liste des numéros */}
      <ul className="space-y-4">
        {numbers.map((item, i) => (
          <li
            key={i}
            className="flex flex-col gap-3 p-3 bg-white rounded-md shadow-sm"
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
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    Numéro {i + 1} :
                  </span>
                  <span className="ml-1 text-sm text-gray-700 break-all">
                    {item}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditStart(i, item)}
                    className="p-2 text-gray-600 hover:text-gray-600"
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
    </section>
  );
};