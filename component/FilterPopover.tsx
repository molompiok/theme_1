import React, { useState, useRef, useEffect } from "react";
import { FilterValue } from "../pages/type";

interface FilterDropdownProps {
  className?: string;
  setFilter?: (key: string, value: FilterValue[]) => void;
  selectedFilters?: Record<string, FilterValue[]>;
  defaultOptions?: string[];
}

const FilterDropdown = ({
  className = "",
  setFilter,
  selectedFilters,
  defaultOptions = ["plus recent", "moins recent", "prix eleve", "prix bas"],
}: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClick = (option: string) => {
    setFilter?.("order_by", [{ text: option, key: option, icon: [] }]);
    setIsOpen(false);
  };

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  const selectedOption = selectedFilters?.["order_by"]?.[0]?.text;

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          group relative w-fit ml-auto px-4 py-2.5 
          flex items-center justify-center gap-3 
          bg-white border border-gray-200 rounded-xl
          hover:border-gray-300 hover:shadow-md
          focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-400
          transition-all duration-200 ease-out
          text-sm font-medium text-gray-700
          min-w-[140px] sm:min-w-[160px]
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="text-gray-500 hidden sm:inline">Trier par</span>
        <span className="text-gray-900 truncate max-w-[80px] sm:max-w-none">
          {selectedOption || "Sélectionner"}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <div
        className={`
          absolute right-0 mt-2 w-48 sm:w-56
           border border-gray-200 rounded-xl shadow-lg
          backdrop-blur-sm bg-white/95
          transition-all duration-200 ease-out origin-top-right
          ${
            isOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          }
          z-50
        `}
        role="listbox"
      >
        <div className="py-2">
          {defaultOptions.map((option, index) => {
            const isSelected = selectedOption === option;

            return (
              <button
                key={option}
                onClick={() => handleClick(option)}
                className={`
                  w-full text-left px-4 py-3 text-sm
                  flex items-center justify-between
                  transition-all duration-150 ease-out
                  ${
                    isSelected
                      ? "bg-slate-200 text-slate-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }
                  ${index === 0 ? "rounded-t-lg" : ""}
                  ${index === defaultOptions.length - 1 ? "rounded-b-lg" : ""}
                `}
                role="option"
                aria-selected={isSelected}
              >
                <span className="capitalize">{option}</span>

                {isSelected && (
                  <svg
                    className="w-4 h-4 text-slate-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Overlay pour mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default FilterDropdown;
