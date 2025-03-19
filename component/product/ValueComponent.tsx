import React, { useCallback, useMemo } from "react";
import { useproductFeatures } from "../../store/features";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { get_group_by_feature } from "../../api/products.api";
import Skeleton from "../Skeleton"; // Assume que tu as le Skeleton modulaire
import clsx from "clsx";
import { GroupProductType } from "../../pages/type";

interface ValueComponentProps {
  value: { text: string; id?: string };
  feature_name: string;
  product_id: string;
  isSelected: boolean;
  isColor?: boolean;
}

const ValueComponent: React.FC<ValueComponentProps> = ({
  value,
  feature_name,
  product_id,
  isSelected,
  isColor = false,
}) => {
  const text = value.text!;
  const { add ,remove} = useproductFeatures();
  const selectedFeatures = useproductFeatures((state) => state.selectedFeatures);

  const {
    data: group_products = [],
    isPending,
    isError,
  } = useQuery<GroupProductType[], Error>({
    queryKey: ["get_group_by_feature", { product_id, feature_value: text, feature_key: feature_name }],
    queryFn: () => get_group_by_feature({ product_id, feature_value: text, feature_key: feature_name }),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData
    // keepPreviousData: true,
  });

  const { totalStock, mainGroupProduct } = useMemo(() => {
    const validGroups = group_products.filter((gp) => {
      const matchesCurrent = gp.bind[feature_name] === text;
      const matchesOthers = Array.from(selectedFeatures.entries()).every(
        ([key, val]) => key === feature_name || !gp.bind[key] || gp.bind[key] === val
      );
      return matchesCurrent && matchesOthers;
    });
    const total = validGroups.reduce((sum, gp) => sum + (gp.stock || 0), 0);
    const main = validGroups.find((gp) => gp.stock > 0) || validGroups[0];
    return { totalStock: total, mainGroupProduct: main };
  }, [group_products, feature_name, text, selectedFeatures]);

  const isDisabled = useMemo(
    () => isPending || isError || !group_products.length || totalStock === 0,
    [isPending, isError, group_products, totalStock]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (isDisabled || !group_products.length) return;

      if (isSelected) {
        remove(feature_name);
      } else {
        const validGroups = group_products.filter((gp) => gp.bind[feature_name] === text);
        const groupId = mainGroupProduct?.id || validGroups[0]?.id || `${product_id}-${text}`;
        add(groupId, feature_name, text, mainGroupProduct?.additional_price || 0, totalStock, validGroups);
      }
    },
    [add, remove, feature_name, group_products, isDisabled, isSelected, mainGroupProduct, product_id, text, totalStock]
  );

//   

    const strikethroughStyles = clsx(
      "absolute inset-0 flex items-center justify-center overflow-hidden",
      {
        "after:content-[''] after:absolute after:w-[99%] after:h-[1px] after:bg-gray-400 after:transform after:-rotate-16": isDisabled,
      }
    );

    const buttonStyles = clsx(
        "relative transition-all border-gray-300 duration-300 ease-out focus:outline-none shadow-lg focus:ring-1 focus:ring-blue-200 focus:ring-offset-1",
        isColor
          ? "sm:size-10 size-8 rounded-full before:absolute before:inset-0 before:rounded-full before:transition-all before:duration-300 before:ease-out"
          : "border text-clamp-xs flex justify-center items-center px-3 py-1 rounded-md",
        {
          // Boutons texte
          "bg-black text-white border-black shadow-sm": isSelected && !isDisabled && !isColor,
          "bg-white text-gray-800  hover:bg-gray-100": !isSelected && !isDisabled && !isColor,

          // Boutons couleur
          "border-1 border-blue-400 scale-105 shadow-sm before:border-3 before:border-white before:scale-95": isSelected && !isDisabled && isColor,
          "hover:scale-105": !isSelected && !isDisabled && isColor,
          "opacity-50 cursor-not-allowed border-gray-300": isDisabled,
        },
        isColor && (["blue", "red", "green", "yellow"].includes(text.toLowerCase())
          ? `bg-${text.toLowerCase()}-600`
          : "bg-gray-400")
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

  if (isPending) {
    return (
      <div className={clsx("flex items-center justify-center", isColor ? "sm:size-10 size-8 min-h-[32px] sm:min-h-[40px]" : "min-w-[60px] min-h-[30px] py-1")}>
        <Skeleton
          width={isColor ? "100%" : 60}
          height={isColor ? "100%" : 30}
          type="custom"
          customLayout
          color="gray-200"
          ariaLabel={`Chargement de ${text}`}
        />
      </div>
    );
  }

  if (isError || !group_products.length) {
    return (
      <span className="text-red-500 text-sm italic" role="alert" aria-label={`${text} indisponible`}>
        Indisponible
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
      title={isDisabled ? `${text} est indisponible (restant: ${totalStock})` : `${feature_name} ${text} : ${totalStock} restant`}
    >
        <div className={strikethroughStyles}/>
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