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
      const continue_selling = gp.continue_selling

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

  const isDisabled = totalStock === 0 && !mainGroupProduct?.continue_selling;
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

  // Classes de base simplifiées et optimisées
  const baseStyles = clsx(
    "group relative inline-flex items-center justify-center",
    "transition-all duration-200 ease-out",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1",
    "disabled:cursor-not-allowed",
    "active:scale-95",
    "touch-manipulation",
    "text-sm font-medium"
  );

  // Styles par type avec tailles réduites
  const typeStyles = clsx({
    // Couleur - plus compact
    "w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2": isColor,

    // Icône seule - plus compact
    "w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 overflow-hidden":
      isIcon && !isIconText,

    // Texte et icône+texte - padding réduit
    "px-3 py-2 rounded-lg border-2 min-h-[36px] gap-1.5":
      isIconText || (!isColor && !isIcon),
  });

  // États visuels simplifiés
  const stateStyles = clsx({
    // Couleur sélectionnée
    "border-gray-900 ring-2 ring-gray-900 ring-offset-1 scale-105":
      isColor && isSelected && !isDisabled,
    // Couleur non sélectionnée
    "border-gray-300 hover:border-gray-500 hover:scale-105":
      isColor && !isSelected && !isDisabled,
    // Couleur désactivée
    "border-gray-200 opacity-40": isColor && isDisabled,

    // Icône sélectionnée - FIX: garde l'icône visible
    "border-blue-500 bg-blue-50 shadow-md":
      isIcon && isSelected && !isDisabled,
    // Icône non sélectionnée
    "border-gray-300 bg-white hover:border-gray-500 hover:bg-gray-50":
      isIcon && !isSelected && !isDisabled,
    // Icône désactivée
    "border-gray-200 bg-gray-50 opacity-40": isIcon && isDisabled,

    // Texte sélectionné
    "bg-gray-900 text-white border-gray-900":
      !isColor && !isIcon && isSelected && !isDisabled,
    // Texte non sélectionné
    "bg-white text-gray-700 border-gray-300 hover:border-gray-900 hover:bg-gray-50":
      !isColor && !isIcon && !isSelected && !isDisabled,
    // Texte désactivé
    "bg-gray-50 text-gray-400 border-gray-200":
      !isColor && !isIcon && isDisabled,
  });

  // Indicateur de stock compact
  const StockIndicator = () => {
    if (mainGroupProduct?.continue_selling && totalStock === 0) {
      return (
        <span
          className={clsx(
            "text-[.5rem] font-semibold ml-1 px-1 rounded",
            "text-blue-700 bg-blue-100"
          )}
          aria-hidden="true"
        >
          *
        </span>
      );
    }
    if (totalStock > 5 || mainGroupProduct?.continue_selling) return null;

    const stockBadgeStyles = clsx(
      "absolute -top-1 -right-1",
      "min-w-[16px] h-4 px-1",
      "flex items-center justify-center",
      "text-[10px] font-bold rounded-full",
      "border bg-white shadow-sm",
      {
        "text-orange-600 border-orange-300": isLowStock,
        "text-red-600 border-red-300": isDisabled,
      }
    );

    const inlineStockStyles = clsx(
      "text-xs font-medium ml-1 opacity-75",
      "px-1 py-0.5 rounded",
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

  // Overlay de désactivation simplifié
  const DisabledOverlay = () => {
    if (!isDisabled) return null;
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-inherit">
        <div className="w-full h-0.5 bg-red-400 rotate-12" />
      </div>
    );
  };

  const ColorSelectionIndicator = () => {
    if (!isColor || !isSelected || isDisabled) return null;
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm flex items-center justify-center">
          <div className="w-1 h-1 bg-gray-900 rounded-full" />
        </div>
      </div>
    );
  };

  if (!group_products) {
    return (
      <div
        className="inline-flex items-center justify-center w-10 h-10 text-gray-400 rounded-xl border-2 border-gray-200 bg-gray-50"
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
      aria-label={`${isSelected ? "Sélectionné" : "Sélectionner"} ${text}${isDisabled ? " (indisponible)" : ""
        }`}
      aria-disabled={isDisabled}
      style={{
        backgroundColor: isColor ? value.key || "#f3f4f6" : undefined,
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
      <DisabledOverlay />

      <ColorSelectionIndicator />

      {isIcon && !isIconText && icon && (
        <ProductMedia
          mediaList={icon}
          productName={text}
          className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
        />
      )}

      {isIconText && icon && (
        <ProductMedia
          mediaList={icon}
          productName={text}
          className="w-5 h-5 object-contain flex-shrink-0"
        />
      )}

      {!isColor && (!isIcon || isIconText) && (
        <span className="truncate max-w-[100px] sm:max-w-[120px]">
          {text}
        </span>
      )}

      <StockIndicator />
    </button>
  );
};

export default ValueComponent;