import React, { useCallback, useMemo } from "react";
import { useproductFeatures } from "../../store/features";
import clsx from "clsx";
import { Feature, ProductFeature } from "../../pages/type";
import { getAllOptions } from "../../utils";
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

  // Classes de base améliorées pour mobile
  const baseStyles = clsx(
    "group relative inline-flex items-center justify-center",
    "transition-all duration-300 ease-out",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed",
    "active:scale-95", // Feedback tactile pour mobile
    "touch-manipulation", // Optimisation mobile
    // Typographie responsive
    "text-xs xs:text-sm sm:text-base font-medium"
  );

  // Styles par type avec design moderne
  const typeStyles = clsx({
    // Couleur - design circulaire avec shadow
    "w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-full border-2 shadow-sm hover:shadow-md":
      isColor,

    // Icône seule - carré moderne avec coins arrondis
    "w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 rounded-2xl border-2 overflow-hidden shadow-sm hover:shadow-md":
      isIcon && !isIconText,

    // Texte et icône+texte - pilules modernes avec padding adaptatif
    "px-3 py-2 xs:px-4 xs:py-2.5 sm:px-5 sm:py-3 rounded-full border-2 min-h-[44px] gap-2 shadow-sm hover:shadow-md":
      isIconText || (!isColor && !isIcon),
  });

  // États visuels modernes avec gradients subtils
  const stateStyles = clsx({
    // Couleur sélectionnée
    "border-gray-900 ring-2 ring-gray-900 ring-offset-2 scale-105 shadow-lg":
      isColor && isSelected && !isDisabled,
    // Couleur non sélectionnée
    "border-gray-300 hover:border-gray-500 hover:scale-105 hover:shadow-md":
      isColor && !isSelected && !isDisabled,
    // Couleur désactivée
    "border-gray-200 opacity-40 shadow-none": isColor && isDisabled,

    // Icône sélectionnée
    "border-gray-900 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg":
      isIcon && isSelected && !isDisabled,
    // Icône non sélectionnée
    "border-gray-300 bg-white hover:border-gray-500 hover:bg-gray-50 hover:shadow-md":
      isIcon && !isSelected && !isDisabled,
    // Icône désactivée
    "border-gray-200 bg-gray-50 opacity-40 shadow-none": isIcon && isDisabled,

    // Texte sélectionné
    "bg-gradient-to-r from-gray-800 to-gray-900 text-white border-gray-900 shadow-lg":
      !isColor && !isIcon && isSelected && !isDisabled,
    // Texte non sélectionné
    "bg-white text-gray-700 border-gray-300 hover:border-gray-900 hover:bg-gray-50 hover:text-gray-900":
      !isColor && !isIcon && !isSelected && !isDisabled,
    // Texte désactivé
    "bg-gray-50 text-gray-400 border-gray-200 shadow-none":
      !isColor && !isIcon && isDisabled,
  });

  // Indicateur de stock moderne et visible
  const StockIndicator = () => {
    if (totalStock > 5) return null;

    const stockBadgeStyles = clsx(
      "absolute -top-1 -right-1 xs:-top-2 xs:-right-2",
      "min-w-[18px] h-[18px] xs:min-w-[20px] xs:h-5 px-1",
      "flex items-center justify-center",
      "text-[10px] xs:text-xs font-bold rounded-full",
      "border-2 bg-white shadow-md",
      "animate-pulse", // Animation pour attirer l'attention
      {
        "text-orange-600 border-orange-300 bg-orange-50": isLowStock,
        "text-red-600 border-red-300 bg-red-50": isDisabled,
      }
    );

    const inlineStockStyles = clsx(
      "text-[10px] xs:text-xs font-medium ml-1 opacity-80",
      "px-1.5 py-0.5 rounded-full",
      {
        "text-orange-600 bg-orange-100": isLowStock,
        "text-red-600 bg-red-100": isDisabled,
      }
    );

    if (isColor || isIcon) {
      return (
        <span className={stockBadgeStyles} aria-hidden="true">
          {totalStock}
        </span>
      );
    }

    return (
      <span className={inlineStockStyles} aria-hidden="true">
        {totalStock}
      </span>
    );
  };

  // Overlay de désactivation plus visible
  const DisabledOverlay = () => {
    if (!isDisabled) return null;

    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[1px] rounded-inherit">
        <div className="w-full h-0.5 bg-red-400 rotate-12 opacity-80 shadow-sm" />
      </div>
    );
  };

  // Indicateur de sélection pour les couleurs
  const ColorSelectionIndicator = () => {
    if (!isColor || !isSelected || isDisabled) return null;

    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3 h-3 xs:w-4 xs:h-4 bg-white rounded-full shadow-md flex items-center justify-center">
          <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-gray-900 rounded-full" />
        </div>
      </div>
    );
  };

  if (!group_products) {
    return (
      <div
        className="inline-flex items-center justify-center w-12 h-12 xs:w-14 xs:h-14 text-gray-400 rounded-2xl border-2 border-gray-200 bg-gray-50 shadow-sm"
        role="alert"
        aria-label={`${text} indisponible`}
      >
        <span className="text-lg xs:text-xl">×</span>
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
      aria-label={`${isSelected ? "Sélectionné" : "Sélectionner"} ${text}${isDisabled ? " (indisponible)" : ""
        }`}
      aria-disabled={isDisabled}
      style={{
        backgroundColor: isColor ? value.key || "#f3f4f6" : undefined,
        // Suppression de la couleur du texte pour permettre l'indicateur
      }}
      title={
        isDisabled
          ? `${text} - Indisponible`
          : `${feature_name}: ${text}${totalStock <= 5
            ? ` (${totalStock} restant${totalStock > 1 ? "s" : ""})`
            : ""
          }`
      }
    >
      {/* Overlay de désactivation */}
      <DisabledOverlay />

      {/* Indicateur de sélection pour couleurs */}
      <ColorSelectionIndicator />

      {/* Icône seule */}
      {isIcon && !isIconText && icon && (
        <ProductMedia
          mediaList={icon}
          productName={text}
          className={clsx(
            "size-8 xs:size-10 object-contain transition-all duration-300",
            isSelected && !isDisabled && "brightness-0 invert scale-110"
          )}
        />
      )}

      {/* Icône avec texte */}
      {isIconText && icon && (
        <ProductMedia
          mediaList={icon}
          productName={text}
          className="size-6 xs:size-8 object-contain flex-shrink-0"
        />
      )}

      {/* Texte avec meilleur wrapping */}
      {!isColor && (!isIcon || isIconText) && (
        <span className="truncate max-w-[120px] xs:max-w-[140px] sm:max-w-none">
          {text}
        </span>
      )}

      {/* Indicateur de stock */}
      <StockIndicator />
    </button>
  );
};

export default ValueComponent;
