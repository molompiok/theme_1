import React, { useCallback, useEffect, useMemo } from "react";
import { useproductFeatures } from "../../store/features";
import { FeatureValue, GroupProductType } from "../../pages/type";

import ValueComponent from "../product/ValueComponent";

interface TextComponentProps {
  values: FeatureValue[];
  feature_name: string;
  product_id: string;
}

export const TextComponent: React.FC<TextComponentProps> = ({
  values,
  feature_name,
  product_id,
}) => {
  const validValues = useMemo(() => values.filter((v) => !!v.text), [values]);
  const { productFeatures, lastGroupProductId } = useproductFeatures();
  const selectedValue = productFeatures.get(lastGroupProductId)?.get(feature_name);

  if (!validValues.length) {
    return (
      <div className="text-gray-500 text-sm p-0.5" role="alert">
        Aucune option disponible pour {feature_name}
      </div>
    );
  }

  return (
    <div
      className="p-0.5 pl-2"
      role="group"
      aria-label={`Options pour ${feature_name}`}
    >
      <div className="flex items-center justify-start flex-wrap gap-2 scrollbar-thin max-w-full">
        {validValues.map((value) => (
          <ValueComponent
            value={{text : value.text! , id : value.id}}
            key={value.id}
            // value={value}
            feature_name={feature_name}
            product_id={product_id}
            isSelected={selectedValue?.valueFeature === value.text}
          />
        ))}
      </div>
    </div>
  );
};

// interface ValueComponentProps {
//   value: FeatureValue;
//   feature_name: string;
//   product_id: string;
//   isSelected: boolean;
// }

// const ValueComponent: React.FC<ValueComponentProps> = ({
//   value,
//   feature_name,
//   product_id,
//   isSelected,
// }) => {
//   const text = value.text!;
//   const  add  = useproductFeatures(state => state.add);
//   const  setLastGroupProductId  = useproductFeatures(state => state.setLastGroupProductId);

//   const {
//     data: group_products = [],
//     isPending,
//     isError,
//   } = useQuery<GroupProductType[], Error>({
//     queryKey: ["get_group_by_feature", { product_id, feature_value: text, feature_key: feature_name }],
//     queryFn: () => get_group_by_feature({ product_id, feature_value: text, feature_key: feature_name }),
//     staleTime: 5 * 60 * 1000,
//     placeholderData : keepPreviousData 
//   });

//   const { totalStock, mainGroupProduct } = useMemo(() => {
//     const validGroups = group_products.filter((gp) => gp.bind[feature_name] === text);
//     const total = validGroups.reduce((sum, gp) => sum + (gp.stock || 0), 0);
//     const main = validGroups.find((gp) => gp.stock > 0) || validGroups[0];
//     return { totalStock: total, mainGroupProduct: main };
//   }, [group_products, feature_name, text]);

//   const isDisabled = useMemo(
//     () => isPending || isError || !group_products.length || totalStock === 0,
//     [isPending, isError, group_products, totalStock]
//   );

//   const handleClick = useCallback(
//     (e: React.MouseEvent<HTMLButtonElement>) => {
//       e.preventDefault();
//       e.stopPropagation();
      
//       if (isDisabled || !group_products.length) return;

//       const validGroups = group_products.filter((gp) => gp.bind[feature_name] === text);
//       validGroups.forEach((gp) => {
//         add(gp.id, feature_name, text, gp.additional_price, gp.stock, validGroups);
//       });

//       if (mainGroupProduct) {
//         setLastGroupProductId(mainGroupProduct.id);
//       }
//     },
//     [add, setLastGroupProductId, feature_name, group_products, isDisabled, mainGroupProduct]
//   );


//     const strikethroughStyles = clsx(
//       "absolute inset-0 flex items-center justify-center overflow-hidden",
//       {
//         "after:content-[''] after:absolute after:w-[150%] after:h-[1px] after:bg-gray-400 after:transform after:-rotate-16": isDisabled,
//       }
//     );

//   const buttonStyles = clsx(
//     "relative border text-clamp-xs flex justify-center items-center px-3 py-1 rounded-md transition-all duration-200",
//     "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
//     {
//       "bg-black text-white border-black shadow-sm": isSelected && !isDisabled,
//       "bg-white text-gray-800 border-gray-300 hover:bg-gray-100": !isSelected && !isDisabled,
//       "opacity-50 cursor-not-allowed border-gray-300 bg-gray-100": isDisabled,
//     }
//   );

//   const stockIndicatorStyles = clsx(
//     "ml-2 text-xs font-medium",
//     {
//       "text-orange-500": totalStock > 0 && totalStock <= 5,
//       "text-red-500": totalStock === 0,
//       "text-gray-500": totalStock > 5,
//     }
//   );

//   if (isPending) {
//     return (
//       <div className="flex items-center justify-center min-w-[60px] py-1">
//         <Loading size="small" aria-label={`Chargement de ${text}`} />
//       </div>
//     );
//   }

//   if (isError || !group_products.length) {
//     return (
//       <span
//         className="text-red-500 text-sm italic"
//         role="alert"
//         aria-label={`Option ${text} indisponible`}
//       >
//         Indisponible
//       </span>
//     );
//   }

//   return (
//     <button
//       type="button"
//       disabled={isDisabled}
//       onClick={handleClick}
//       className={buttonStyles}
//       aria-selected={isSelected}
//       aria-label={`Sélectionner ${text}${isDisabled ? " (indisponible)" : ""}`}
//       aria-disabled={isDisabled}
//       title={
//         isDisabled
//           ? `${text} est indisponible (restant: ${totalStock})`
//           : `${feature_name} ${text} : ${totalStock} restant`
//       }
//     >
//       <div className={strikethroughStyles} />
//       {text}
//       {totalStock <= 5 && (
//         <span className={stockIndicatorStyles} aria-hidden="true">
//           ({totalStock})
//         </span>
//       )}
//     </button>
//   );
// };