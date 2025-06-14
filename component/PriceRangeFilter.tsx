import React, { useState, useEffect, useCallback } from "react";
import { useSelectedFiltersStore } from "../store/filter";
import { useThemeSettingsStore } from "../store/themeSettingsStore";
interface FilterValue {
  text: string;
  key: string | null;
  icon: string[];
}

interface PriceRangeFilterProps {
  className?: string;
  currencySymbol?: string;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  title?: string;
}

const PriceRangeFilter = ({
  className = "",
  currencySymbol = "CFA",
  minPlaceholder = "Prix minimum",
  maxPlaceholder = "Prix maximum",
  title = "Fourchette de prix",
}: PriceRangeFilterProps) => {
  const selectedFiltersFromStore = useSelectedFiltersStore(
    (state) => state.selectedFilters
  );
  const setFilterInStore = useSelectedFiltersStore((state) => state.setFilter);

  const [minPriceInput, setMinPriceInput] = useState<string>("");
  const [maxPriceInput, setMaxPriceInput] = useState<string>("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ min: false, max: false });
  const filterSideTextColor = useThemeSettingsStore((state) => state.filterSideTextColor);
  useEffect(() => {
    const currentMin = selectedFiltersFromStore?.["min_price"]?.[0]?.text || "";
    const currentMax = selectedFiltersFromStore?.["max_price"]?.[0]?.text || "";
    setMinPriceInput(currentMin);
    setMaxPriceInput(currentMax);
  }, [selectedFiltersFromStore]);

  const validateInput = (value: string): boolean => {
    if (value === "") return true; // Vide est valide
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0;
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permet seulement les nombres avec décimales optionnelles
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setMinPriceInput(value);
      if (touched.min && !validateInput(value)) {
        setInputError("Veuillez saisir un prix valide");
      } else {
        setInputError(null);
      }
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setMaxPriceInput(value);
      if (touched.max && !validateInput(value)) {
        setInputError("Veuillez saisir un prix valide");
      } else {
        setInputError(null);
      }
    }
  };

  const handleMinBlur = () => {
    setTouched(prev => ({ ...prev, min: true }));
    if (!validateInput(minPriceInput)) {
      setInputError("Veuillez saisir un prix minimum valide");
    }
  };

  const handleMaxBlur = () => {
    setTouched(prev => ({ ...prev, max: true }));
    if (!validateInput(maxPriceInput)) {
      setInputError("Veuillez saisir un prix maximum valide");
    }
  };

  const applyFilters = useCallback(() => {
    let minStr = minPriceInput.trim();
    let maxStr = maxPriceInput.trim();

    // Validation finale
    if (!validateInput(minStr) || !validateInput(maxStr)) {
      setInputError("Veuillez saisir des prix valides");
      return;
    }

    const minNum = parseFloat(minStr);
    const maxNum = parseFloat(maxStr);

    // Gestion de l'inversion si min > max
    if (minStr !== "" && maxStr !== "" && !isNaN(minNum) && !isNaN(maxNum) && minNum > maxNum) {
      // Inverser automatiquement
      const tempMin = minStr;
      minStr = maxStr;
      maxStr = tempMin;
      setMinPriceInput(minStr);
      setMaxPriceInput(maxStr);
      setInputError(null);
    } else {
      setInputError(null);
    }

    // Appliquer les filtres
    if (minStr !== "") {
      setFilterInStore("min_price", [
        { text: minStr, key: minStr, icon: [], product_count: 0 },
      ]);
    } else {
      setFilterInStore("min_price", []);
    }

    if (maxStr !== "") {
      setFilterInStore("max_price", [
        { text: maxStr, key: maxStr, icon: [], product_count: 0 },
      ]);
    } else {
      setFilterInStore("max_price", []);
    }
  }, [minPriceInput, maxPriceInput, setFilterInStore]);

  const clearFilters = () => {
    setMinPriceInput("");
    setMaxPriceInput("");
    setInputError(null);
    setTouched({ min: false, max: false });
    setFilterInStore("min_price", []);
    setFilterInStore("max_price", []);
  };

  const hasValues = minPriceInput.trim() !== "" || maxPriceInput.trim() !== "";
  const hasError = inputError !== null;

  return (
    <div className={`${className} mb-5`}>
      <div className="mb-4">
        <h3 className="text-sm font-medium tracking-wide uppercase" style={{ color: filterSideTextColor }}>
          {title}
        </h3>
        <p className="text-xs mt-1 mb-2" style={{ color: filterSideTextColor }}>
          Définissez une fourchette de prix pour affiner votre recherche
        </p>
        <div className="h-px bg-gray-900"></div>
      </div>
      <div className="space-y-1 mb-2">
        <div className="space-y-1" style={{ color: filterSideTextColor }}>
          <label
            htmlFor="min_price_input"
            className="block text-xs font-medium uppercase tracking-wide"
          >
            Prix minimum
          </label>
          <div className="relative">
            <span className="absolute bg-black p-2 rounded-sm right-3 top-1/2 -translate-y-1/2 text-white  text-sm pointer-events-none">
              {currencySymbol}
            </span>
            <input
              type="text"
              inputMode="decimal"
              name="min_price_input"
              id="min_price_input"
              className={`w-full px-3 py-3 text-sm bg-white border text-black rounded-lg transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 ${hasError && touched.min
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-black focus:ring-gray-200 hover:border-gray-400"
                }`}
              placeholder={minPlaceholder}
              value={minPriceInput}
              onChange={handleMinPriceChange}
              onBlur={handleMinBlur}
              aria-label="Prix minimum"
              aria-describedby="min-price-help"
            />
          </div>
          <p id="min-price-help" className="text-xs text-white">
            Exemple : 50 ou 50.99
          </p>
        </div>
        <div className="flex items-center justify-center py-2">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-3 text-xs text-gray-500 bg-white">à</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="max_price_input"
            className="block text-xs font-medium uppercase tracking-wide"
          >
            Prix maximum
          </label>
          <div className="relative">
            <span className="absolute bg-black rounded-sm p-2 right-3 top-1/2 -translate-y-1/2 text-white text-sm pointer-events-none">
              {currencySymbol}
            </span>
            <input
              type="text"
              inputMode="decimal"
              name="max_price_input"
              id="max_price_input"
              className={`w-full px-3 py-3 text-sm bg-white text-black border rounded-lg transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 ${hasError && touched.max
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-black focus:ring-gray-200 hover:border-gray-400"
                }`}
              placeholder={maxPlaceholder}
              value={maxPriceInput}
              onChange={handleMaxPriceChange}
              onBlur={handleMaxBlur}
              aria-label="Prix maximum"
              aria-describedby="max-price-help"
            />
          </div>
          <p id="max-price-help" className="text-xs" style={{ color: filterSideTextColor }}>
            Laissez vide pour aucune limite
          </p>
        </div>
      </div>
      {inputError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-700 font-medium">{inputError}</p>
          </div>
        </div>
      )}

      {hasValues && !inputError && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-green-700">
              Fourchette : {minPriceInput && `${minPriceInput} ${currencySymbol}`}
              {minPriceInput && maxPriceInput && " - "}
              {maxPriceInput ? `${maxPriceInput} ${currencySymbol}` : (minPriceInput && " sans limite")}
            </p>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-3">
        <button
          onClick={applyFilters}
          disabled={hasError}
          className={`w-full py-3 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${hasError
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800 focus:ring-gray-500 active:bg-gray-900"
            }`}
        >
          {hasValues ? "Mettre à jour les prix" : "Appliquer les prix"}
        </button>

        {hasValues && (
          <button
            onClick={clearFilters}
            className="w-full py-2 text-sm text-gray-600 hover:text-black transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 rounded-lg underline decoration-1 underline-offset-2"
          >
            Effacer les prix
          </button>
        )}
      </div>

      {/* Aide supplémentaire */}
      {/* <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          💡 <strong>Astuce :</strong> Si le prix minimum est supérieur au maximum, 
          nous inverserons automatiquement les valeurs pour vous.
        </p>
      </div> */}
    </div>
  );
};

export default PriceRangeFilter;