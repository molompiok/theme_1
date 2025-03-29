import React, { useCallback, useMemo } from "react";
import { useproductFeatures } from "../../store/features";
import clsx from "clsx";
import { Feature, ProductFeature } from "../../pages/type";
import { getAllOptions } from "../../utils";

interface ValueComponentProps {
  value: ProductFeature;
  features: Feature[];
  feature_name: string;
  product_id: string;
  isSelected: boolean;
  feature_id: string;
  isColor?: boolean;
}

const ValueComponent: React.FC<ValueComponentProps> = ({
  value,
  features,
  product_id,
  feature_id,
  feature_name,
  isSelected,
  isColor = false,
}) => {
  const text = value.text!;
  const { toggleSelection, selections } = useproductFeatures();

  const group_products = getAllOptions({ features, product_id });

  const { totalStock, mainGroupProduct } = useMemo(() => {
    const currentSelections = selections.get(product_id)
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
  }, [group_products, feature_id, value.id, selections.get(product_id)]);

  const isDisabled = useMemo(
    () => (mainGroupProduct?.stock || 0) === 0,
    [mainGroupProduct]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const val = value.id;
      if (isDisabled || !group_products || !val) return;
      toggleSelection({
        featureId: feature_id,
        valueId: val,
        priceValue: mainGroupProduct?.additional_price || 0,
        stock: mainGroupProduct?.stock || 0,
        productId: product_id
      });
    },
    [
      toggleSelection,
      isDisabled,
      group_products,
      feature_id,
      value.id
    ]
  );

  const strikethroughStyles = clsx(
    "absolute inset-0 flex items-center justify-center overflow-hidden",
    {
      "after:content-[''] after:absolute after:w-[99%] after:h-[1px] after:bg-gray-400 after:transform after:-rotate-16":
        isDisabled,
    }
  );

  const buttonStyles = clsx(
    "relative transition-all border-gray-300 duration-300 ease-out focus:outline-none shadow-lg focus:ring-1 focus:ring-blue-200 focus:ring-offset-1",
    isColor
      ? "sm:size-10 size-8 rounded-full before:absolute before:inset-0 before:rounded-full before:transition-all before:duration-300 before:ease-out"
      : "border text-clamp-xs flex justify-center items-center px-3 py-1 rounded-md",
    {
      "bg-black text-white border-black shadow-sm":
        isSelected && !isDisabled && !isColor,
      "bg-white text-gray-800  hover:bg-gray-100":
        !isSelected && !isDisabled && !isColor,

      "border-1 border-blue-400 scale-105 shadow-sm before:border-3 before:border-white before:scale-95":
        isSelected && !isDisabled && isColor,
      "hover:scale-105": !isSelected && !isDisabled && isColor,
      "opacity-50 cursor-not-allowed border-gray-300": isDisabled,
    },

  );

  const stockIndicatorStyles = clsx(
    isColor
      ? "absolute -top-1 bg-white border -right-1 text-xs rounded-full size-4 flex items-center justify-center"
      : "ml-2 text-xs",
    {
      "text-orange-500": totalStock > 0 && totalStock <= 5,
      "bg-white text-red-500": totalStock === 0,
      "text-red-500": totalStock === 0 && !isColor,
      "text-gray-500": totalStock > 5,
    }
  );

  if (!group_products) {
    return (
      <span
        className="text-red-500 text-lg italic"
        role="alert"
        aria-label={`${text} indisponible`}
      >
        👻
      </span>
    );
  }

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={handleClick}
      className={buttonStyles}
      aria-selected={isSelected}
      aria-label={`Sélectionner ${text}${isDisabled ? " (indisponible)" : ""}`}
      aria-disabled={isDisabled}
      style={{
        backgroundColor: isColor ? value.key || '' : ''
      }}
      title={
        isDisabled
          ? `${text} est indisponible (restant: ${totalStock})`
          : `${feature_name} ${text} : ${totalStock} restant`
      }
    >
      <div className={strikethroughStyles} />
      {!isColor && text}
      {totalStock <= 5 && (
        <span className={stockIndicatorStyles} aria-hidden="true">
          {isColor ? totalStock : `(${totalStock})`}
        </span>
      )}
    </button>
  );
};

export default ValueComponent;
