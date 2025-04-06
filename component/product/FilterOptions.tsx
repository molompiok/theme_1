import React from "react";
import clsx from "clsx";
import { FilterValue, VariantType } from "../../pages/type";
import { BASE_URL } from "../../api";

interface FilterOptionProps {
  filterId: string;
  value: FilterValue;
  isSelected: boolean;
  onToggle: (filterId: string, value: FilterValue) => void;
  setRef: (el: HTMLDivElement | null) => void;
}

const TextFilterOption: React.FC<FilterOptionProps> = ({
  filterId,
  value,
  isSelected,
  onToggle,
  setRef,
}) => (
  <div
    ref={setRef}
    className={clsx(
      "flex items-center gap-2 cursor-pointer group transition-all duration-200",
      isSelected ? "text-black font-bold" : "text-gray-900"
    )}
    onClick={(e) => {
      e.stopPropagation();
      onToggle(filterId, value);
    }}
  >
    <div
      className={clsx(
        "size-5 flex items-center justify-center rounded-xl border-2 transition-all duration-500",
        isSelected
          ? "border-black bg-black"
          : "border-gray-300 group-hover:bg-black/50 group-hover:border-gray-500"
      )}
    >
      <svg
        className={clsx(
          "w-3 h-3 text-white transition-all duration-300",
          isSelected ? "inline" : "hidden group-hover:inline group-hover:opacity-45"
        )}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <span className="text-sm capitalize">{value.text}</span>
  </div>
);

const ColorFilterOption: React.FC<FilterOptionProps> = ({
  filterId,
  value,
  isSelected,
  onToggle,
  setRef,
}) => (
  <div
    ref={setRef}
    className={clsx(
      "flex items-center gap-2 cursor-pointer group transition-all duration-200",
      isSelected ? "text-black font-bold" : "text-gray-900"
    )}
    onClick={(e) => {
      e.stopPropagation();
      onToggle(filterId, value);
    }}
  >
    <div
      className={clsx(
        "size-7 rounded-md border transition-all duration-200",
        isSelected
          ? "border-black scale-110"
          : "border-gray-300 group-hover:border-gray-500"
      )}
      style={{ backgroundColor: value.key || undefined }}
    />
    <span className="text-sm capitalize">{value.text}</span>
  </div>
);

const IconFilterOption: React.FC<FilterOptionProps> = ({
  filterId,
  value,
  isSelected,
  onToggle,
  setRef,
}) => (
  <div
    ref={setRef}
    className={clsx(
      "flex items-center gap-2 cursor-pointer group transition-all duration-200",
      isSelected ? "text-black font-bold" : "text-gray-900"
    )}
    onClick={(e) => {
      e.stopPropagation();
      onToggle(filterId, value);
    }}
  >
    <div
      className={clsx(
        "size-12 flex items-center justify-center rounded border transition-all duration-200",
        isSelected
          ? "border-black bg-black"
          : "border-gray-300 group-hover:border-gray-500"
      )}
    >
      {Array.isArray(value.icon) && value.icon.length > 0 ? (
        <img src={BASE_URL + value.icon[0]} alt={value.text} className="size-10" />
      ) : (
        <svg
          className={clsx("size-10", isSelected ? "text-white" : "text-gray-500 group-hover:text-gray-700")}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v8m-4-4h8" />
        </svg>
      )}
    </div>
  </div>
);

const IconTextFilterOption: React.FC<FilterOptionProps> = ({
  filterId,
  value,
  isSelected,
  onToggle,
  setRef,
}) => (
  <div
    ref={setRef}
    className={clsx(
      "flex items-center gap-2 cursor-pointer group transition-all duration-200",
      isSelected ? "text-black font-bold" : "text-gray-900"
    )}
    onClick={(e) => {
      e.stopPropagation();
      onToggle(filterId, value);
    }}
  >
    <div
      className={clsx(
        "size-5 flex items-center justify-center rounded-full border-2 transition-all duration-200",
        isSelected
          ? "border-black bg-black"
          : "border-gray-300 group-hover:border-gray-500"
      )}
    >
      <svg
        className={clsx("w-3 h-3", isSelected ? "text-white" : "text-gray-500 group-hover:text-gray-700")}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d={isSelected ? "M5 13l4 4L19 7" : "M12 8v8m-4-4h8"}
        />
      </svg>
    </div>
    <div>

    {Array.isArray(value.icon) && value.icon.length > 0 && (
      <img src={BASE_URL + value.icon[0]} alt={value.text} className="size-7" />
    )}
    <span className="text-xs capitalize">{value.text}</span>
    </div>
  </div>
);

export { TextFilterOption, ColorFilterOption, IconFilterOption, IconTextFilterOption };