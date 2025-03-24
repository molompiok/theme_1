import React, { useMemo } from "react";
import { useproductFeatures } from "../../store/features";
import { FeatureValue } from "../../pages/type";
import ValueComponent from "../product/ValueComponent";

interface ColorComponentProps {
  values: FeatureValue[];
  feature_name: string;
  product_id: string;
}

export const ColorComponent: React.FC<ColorComponentProps> = ({
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
        Aucune couleur disponible pour {feature_name}
      </div>
    );
  }

  return (
    <div
      className="p-0.5 pl-2"
      role="group"
      aria-label={`Sélection de couleur pour ${feature_name}`}
    >
      <div className="flex items-center p-2 justify-start flex-wrap gap-2 scrollbar-thin max-w-full">
        {validValues.map((value) => (
          <ValueComponent
            key={value.id}
            value={{text : value.text! , id : value.id}}
            isColor={true}
            feature_name={feature_name}
            product_id={product_id}
            isSelected={selectedValue?.valueFeature === value.text}
          />
        ))}
      </div>
    </div>
  );
};

// const colorVariants = {
//   blue: "bg-blue-600",
//   red: "bg-red-600",
//   green: "bg-green-600",
//   yellow: "bg-yellow-600",
//   white: "bg-white border border-black"
// } as const;

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
//     enabled: !!product_id && !!text,
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
//         add(gp.id, feature_name, text, gp.additional_price, gp.stock,validGroups);
//       });

//       if (mainGroupProduct) {
//         setLastGroupProductId(mainGroupProduct.id);
//       }
//     },
//     [add, setLastGroupProductId, feature_name, group_products, isDisabled, mainGroupProduct]
//   );



//   const colorClass = useMemo(
//     () =>
//       colorVariants[text.toLowerCase() as keyof typeof colorVariants] || "bg-gray-400",
//     [text]
//   );

//   const buttonStyles = clsx(
//     "relative sm:size-10 size-8 rounded-full transition-all duration-200",
//     "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
//     colorClass,
//     {
//       "border-3 border-black shadow-sm scale-105": isSelected && !isDisabled,
//       "hover:scale-105": !isSelected && !isDisabled,
//       "opacity-50 cursor-not-allowed": isDisabled,
//     }
//   );

//   const strikethroughStyles = clsx(
//     "absolute inset-0 flex items-center justify-center overflow-hidden",
//     {
//       "after:content-[''] after:absolute after:w-[100%] after:h-[1px] after:bg-gray-400 after:transform after:-rotate-50": isDisabled,
//     }
//   );


//   const stockIndicatorStyles = clsx(
//     "absolute -top-1 -right-1 text-xs font-medium rounded-full size-4 flex items-center justify-center",
//     {
//       "bg-orange-500 text-white": totalStock > 0 && totalStock <= 5,
//       "bg-red-500 text-white": totalStock === 0,
//       "bg-gray-500 text-white": totalStock > 5,
//     }
//   );

//   if (isPending) {
//     return (
//       <div className="flex items-center justify-center sm:size-10 size-8">
//         <Loading size="small" aria-label={`Chargement de la couleur ${text}`} />
//       </div>
//     );
//   }

//   if (isError || !group_products.length || !text) {
//     return (
//       <span
//         className="text-red-500 text-sm italic"
//         role="alert"
//         aria-label={`Couleur ${text} indisponible`}
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
//       aria-label={`Sélectionner la couleur ${text}${isDisabled ? " (indisponible)" : ""}`}
//       aria-disabled={isDisabled}
//       title={
//         isDisabled
//           ? `${text} est indisponible (restant: ${totalStock})`
//           : `${feature_name} ${text} : ${totalStock} restant`
//       }
//     >
//         <div className={strikethroughStyles} />
//       {totalStock <= 5 && (
//         <span className={stockIndicatorStyles} aria-hidden="true">
//           {totalStock}
//         </span>
//       )}
//     </button>
//   );
// };