import React, { useCallback, useMemo } from "react";
import { useproductFeatures } from "../../store/features";
import clsx from "clsx";
import { Feature, ProductFeature } from "../../pages/type";
import { getAllOptions } from "../../utils";
import { BASE_URL } from "../../api";
import { ProductMedia } from "../ProductMedia";

interface ValueComponentProps {
  value: ProductFeature;
  features: Feature[];
  feature_name: string;
  product_id: string;
  isSelected: boolean;
  feature_id: string;
  isColor?: boolean;
  isIcon?: boolean;
  isIconText?: boolean;
}

const ValueComponent: React.FC<ValueComponentProps> = ({
  value,
  features,
  product_id,
  feature_id,
  feature_name,
  isSelected,
  isColor = false,
  isIcon = false,
  isIconText = false,
}) => {
  const text = value.text!;
  const icon =
    Array.isArray(value.icon) && value.icon.length > 0 ? value.icon[0] : null;
  const { toggleSelection, selections } = useproductFeatures();

  const group_products = getAllOptions({ features, product_id });

  const { totalStock, mainGroupProduct } = useMemo(() => {
    const currentSelections = selections.get(product_id);
    const validGroups = group_products.filter((gp) => {
      const matchesCurrent = gp.bind[feature_id] === value.id;
      const matchesOthers = Array.from(
        currentSelections?.entries() || []
      ).every(
        ([key, val]) =>
          key === feature_id ||
          !gp.bind[key] ||
          gp.bind[key] === val.valueFeature
      );
      return matchesCurrent && matchesOthers;
    });
    const total =
      validGroups.sort((a, b) => (b.stock || 0) - (a.stock || 0))[0]?.stock ||
      0;
    const main =
      validGroups.find((gp) => (gp.stock || 0) > 0) || validGroups[0];
    return { totalStock: total, mainGroupProduct: main };
  }, [group_products, feature_id, value.id, product_id, selections]);

  const isDisabled = totalStock === 0;
  const isLowStock = totalStock > 0 && totalStock <= 5;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (isDisabled || !group_products || !value.id) return;
      toggleSelection({
        featureId: feature_id,
        valueId: value.id,
        priceValue: mainGroupProduct?.additional_price || 0,
        stock: mainGroupProduct?.stock || 0,
        productId: product_id,
      });
    },
    [
      toggleSelection,
      isDisabled,
      group_products,
      feature_id,
      value.id,
      mainGroupProduct,
    ]
  );

  // Classes de base modernes et épurées
  const baseStyles = clsx(
    "group relative inline-flex items-center justify-center",
    "transition-all duration-200 ease-out",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed",
    // Responsivité améliorée
    "text-sm sm:text-base"
  );

  // Styles spécifiques par type - design minimaliste
  const typeStyles = clsx({
    // Couleur - design circulaire moderne
    "w-7 h-7 sm:w-9 sm:h-9 rounded-full border-2": isColor,

    // Icône seule - carré arrondi épuré
    "w-8 h-8 sm:w-10 sm:h-10 rounded-xl border-2 overflow-hidden":
      isIcon && !isIconText,

    // Texte et icône+texte - pilules modernes
    "px-2 py-1 sm:px-3 sm:py-2 rounded-full border min-h-[44px] gap-2":
      isIconText || (!isColor && !isIcon),
  });

  // États visuels - noir et blanc épuré
  const stateStyles = clsx({
    // Couleur
    "border-black ring-2 ring-black ring-offset-2 scale-110":
      isColor && isSelected && !isDisabled,
    "border-gray-300 hover:border-gray-500 hover:scale-105":
      isColor && !isSelected && !isDisabled,
    "border-gray-200 opacity-40": isColor && isDisabled,

    // Icône
    "border-black bg-black": isIcon && isSelected && !isDisabled,
    "border-gray-300 hover:border-gray-500 hover:bg-gray-50":
      isIcon && !isSelected && !isDisabled,
    "border-gray-200 bg-gray-50 opacity-40": isIcon && isDisabled,

    // Texte
    "bg-black text-white border-black font-medium":
      !isColor && !isIcon && isSelected && !isDisabled,
    "bg-white text-gray-900 border-gray-300 hover:border-gray-900 hover:bg-gray-50 font-normal":
      !isColor && !isIcon && !isSelected && !isDisabled,
    "bg-gray-50 text-gray-400 border-gray-200":
      !isColor && !isIcon && isDisabled,
  });

  // Indicateur de stock moderne et discret
  const StockIndicator = () => {
    if (totalStock > 5) return null;

    const stockBadgeStyles = clsx(
      "absolute -top-2 -right-2 min-w-[20px] h-5 px-1.5",
      "flex items-center justify-center",
      "text-xs font-medium rounded-full",
      "border bg-white",
      {
        "text-orange-600 border-orange-200": isLowStock,
        "text-red-600 border-red-200": isDisabled,
      }
    );

    const inlineStockStyles = clsx("text-xs font-normal ml-1 opacity-75", {
      "text-orange-600": isLowStock,
      "text-red-600": isDisabled,
    });

    if (isColor || isIcon) {
      return (
        <span className={stockBadgeStyles} aria-hidden="true">
          {totalStock}
        </span>
      );
    }

    return (
      <span className={inlineStockStyles} aria-hidden="true">
        ({totalStock})
      </span>
    );
  };

  // Effet de désactivation moderne
  const DisabledOverlay = () => {
    if (!isDisabled) return null;

    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-0.5 bg-gray-400 rotate-12 opacity-60" />
      </div>
    );
  };

  if (!group_products) {
    return (
      <div
        className="inline-flex items-center justify-center w-12 h-12 text-gray-400 rounded-xl border border-gray-200 bg-gray-50"
        role="alert"
        aria-label={`${text} indisponible`}
      >
        <span className="text-lg">×</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={handleClick}
      className={clsx(baseStyles, typeStyles, stateStyles)}
      aria-selected={isSelected}
      aria-label={`${isSelected ? "Sélectionné" : "Sélectionner"} ${text}${
        isDisabled ? " (indisponible)" : ""
      }`}
      aria-disabled={isDisabled}
      style={{
        backgroundColor: isColor ? value.key || "#f3f4f6" : undefined,
        color: isColor ? (isSelected ? "white" : "transparent") : undefined,
      }}
      title={
        isDisabled
          ? `${text} - Indisponible`
          : `${feature_name}: ${text}${
              totalStock <= 5
                ? ` (${totalStock} restant${totalStock > 1 ? "s" : ""})`
                : ""
            }`
      }
    >
      {/* Overlay de désactivation */}
      <DisabledOverlay />

      {/* Icône seule */}
      {isIcon && !isIconText && icon && (
        <ProductMedia
          mediaList={icon}
          productName={text}
          className={clsx(
            "w-8 h-8 sm:w-10 sm:h-10 object-contain transition-colors",
            isSelected && !isDisabled && "brightness-0 invert"
          )}
        />
      )}

      {/* Icône avec texte */}
      {isIconText && icon && (
        <ProductMedia
          mediaList={icon}
          productName={text}
          className="w-5 h-5 object-contain flex-shrink-0"
        />
      )}

      {/* Texte */}
      {!isColor && (!isIcon || isIconText) && (
        <span className="truncate">{text}</span>
      )}

      {/* Indicateur de stock */}
      <StockIndicator />
    </button>
  );
};

export default ValueComponent;
