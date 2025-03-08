import React from "react";
import { useproductFeatures } from "../../store/features";
import clsx from "clsx";
import { FeatureValue } from "../../pages/type";

export default function TextComponent({
  values,
  feature_name,
  feature_required,
  productId,
  stock
}: {
  values: FeatureValue[];
  feature_name:string;
  feature_required:boolean;
  productId: string;
  stock : number
}) {
  const add = useproductFeatures((state) => state.add);
  const pfeature = useproductFeatures((state) => state.productFeatures);

  return (
    <div className="flex flex-col  my-0.5">
      <h1 className="text-clamp-base font-bold">
        {feature_required ? "Selectionne " : ""}
        {feature_name}:
      </h1>
      <div className="flex items-center flex-wrap justify-start max-w-full overflow-x-auto scrollbar-thin max-h-28 gap-3 ">
        {values.map((v) => {
           if (!v.text) return null;
           const textValue = v.text;
          return (
            <button
              title={Boolean(stock) ? "" : textValue + " est indisponible"}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (stock) add(productId, feature_name, textValue);
              }}
              disabled={!Boolean(stock)}
              key={v.id}
              className={clsx(
                `border cursor-pointer  text-clamp-xs flex justify-center items-center border-gray-300 px-3 sm:min-h-[40px]  min-h-[30px] rounded-md transition-all duration-500`,
                {
                  "bg-black text-teal-50":
                    pfeature.get(productId)?.get(feature_name) === textValue,
                  "bg-white text-black":
                    pfeature.get(productId)?.get(feature_name) !== textValue,
                  "opacity-40 cursor-not-allowed": !Boolean(stock),
                }
              )}
            >
              {textValue}
            </button>
          );
        })}
      </div>
    </div>
  );
}
