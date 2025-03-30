import React, { useCallback, useMemo } from "react";
import { useproductFeatures } from "../../store/features";
import clsx from "clsx";
import { Feature, ProductFeature } from "../../pages/type";
import { getAllOptions } from "../../utils";
import { BASE_URL } from "../../api";

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
  const icon = Array.isArray(value.icon) && value.icon.length > 0 ? value.icon[0] : null;
  const { toggleSelection, selections } = useproductFeatures();

  const group_products = getAllOptions({ features, product_id });

  const { totalStock, mainGroupProduct } = useMemo(() => {
    const currentSelections = selections.get(product_id);
    const validGroups = group_products.filter((gp) => {
      const matchesCurrent = gp.bind[feature_id] === value.id;
      const matchesOthers = Array.from(currentSelections?.entries() || []).every(
        ([key, val]) =>
          key === feature_id || !gp.bind[key] || gp.bind[key] === val.valueFeature
      );
      return matchesCurrent && matchesOthers;
    });
    const total = validGroups.sort((a, b) => (b.stock || 0) - (a.stock || 0))[0]?.stock || 0;
    const main = validGroups.find((gp) => (gp.stock || 0) > 0) || validGroups[0];
    return { totalStock: total, mainGroupProduct: main };
  }, [group_products, feature_id, value.id, product_id, selections]);

  const isDisabled = totalStock === 0;

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
    [toggleSelection, isDisabled, group_products, feature_id, value.id, mainGroupProduct]
  );

  const baseButtonStyles = clsx(
    "relative transition-all duration-300 ease-out focus:outline-none shadow-lg",
    "focus:ring-1 focus:ring-blue-200 focus:ring-offset-1",
    isDisabled && "opacity-50 cursor-not-allowed border-gray-300"
  );

  const typeStyles = clsx({
    // Color
    "sm:size-10 size-8 rounded-full": isColor,
    // Icon
    "size-10 flex items-center justify-center rounded-md": isIcon && !isIconText,
    // IconText ou Text
    "border text-clamp-xs flex items-center gap-2 px-3 py-1 rounded-md": isIconText || (!isColor && !isIcon),
  });

  // Styles  (sélectionné ou non)
  const stateStyles = clsx({
    // Color
    "border-1 border-blue-400 scale-105 shadow-sm": isColor && isSelected && !isDisabled,
    "hover:scale-105": isColor && !isSelected && !isDisabled,
    // Icon
    "border-black": isIcon && isSelected && !isDisabled,
    "hover:border-gray-500 border-gray-300": isIcon && !isSelected && !isDisabled,
    // Text ou IconText
    "bg-black text-white border-black shadow-sm": !isColor && !isIcon && isSelected && !isDisabled,
    "bg-white text-gray-800 hover:bg-gray-100 border-gray-300": !isColor && !isIcon && !isSelected && !isDisabled,
  });

  const strikethroughStyles = clsx(
    "absolute inset-0 flex items-center justify-center overflow-hidden",
    isDisabled && "after:content-[''] after:absolute after:w-[99%] after:h-[1px] after:bg-gray-400 after:transform after:-rotate-16"
  );

  const stockIndicatorStyles = clsx(
    isColor || isIcon
      ? "absolute -top-1 bg-white border -right-1 text-xs rounded-full size-4 flex items-center justify-center"
      : "ml-2 text-xs",
    {
      "text-orange-500": totalStock > 0 && totalStock <= 5,
      "bg-white text-red-500": totalStock === 0 && (isColor || isIcon),
      "text-red-500": totalStock === 0 && !isColor && !isIcon,
      "text-gray-500": totalStock > 5,
    }
  );

  if (!group_products) {
    return (
      <span className="text-red-500 text-lg italic" role="alert" aria-label={`${text} indisponible`}>
        👻
      </span>
    );
  }

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={handleClick}
      className={clsx(baseButtonStyles, typeStyles, stateStyles)}
      aria-selected={isSelected}
      aria-label={`Sélectionner ${text}${isDisabled ? " (indisponible)" : ""}`}
      aria-disabled={isDisabled}
      style={{ backgroundColor: isColor ? value.key || "" : undefined }}
      title={isDisabled ? `${text} est indisponible (restant: ${totalStock})` : `${feature_name} ${text} : ${totalStock} restant`}
    >
      <div className={strikethroughStyles} />
      {/* Icône seule pour "icon" */}
      {isIcon && !isIconText && icon && (
        <img src={`${BASE_URL}${icon}`} alt={text} className="size-6 object-contain" />
      )}
      {/* Icône + texte pour "icon_text" */}
      {isIconText && icon && (
        <img src={`${BASE_URL}${icon}`} alt={text} className="size-5 object-contain" />
      )}
      {/* Texte uniquement pour "text" et "icon_text", pas pour "color" ni "icon" seul */}
      {(!isColor && (!isIcon || isIconText)) && text}
      {/* Indicateur de stock */}
      {totalStock <= 5 && (
        <span className={stockIndicatorStyles} aria-hidden="true">
          {(isColor || isIcon) ? totalStock : `(${totalStock})`}
        </span>
      )}
    </button>
  );
};

export default ValueComponent;