import React from "react";
import { useproductFeatures } from "../../store/features";
import clsx from "clsx";
import { FeatureType } from "../../pages/type";

export default function TextComponent({
  features,
  feature_name,
  feature_required,
  productId,
  stock
}: {
  features: FeatureType[];
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
        {features.map((v) => {
          return (
            <button
              title={Boolean(stock) ? "" : v.text + " est indisponible"}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (stock) add(productId, feature_name, v.text);
              }}
              disabled={!Boolean(stock)}
              key={v.id}
              className={clsx(
                `border cursor-pointer  text-clamp-xs flex justify-center items-center border-gray-300 px-3 sm:min-h-[40px]  min-h-[30px] rounded-md transition-all duration-500`,
                {
                  "bg-black text-teal-50":
                    pfeature.get(productId)?.get(feature_name) === v.text,
                  "bg-white text-black":
                    pfeature.get(productId)?.get(feature_name) !== v.text,
                  "opacity-40 cursor-not-allowed": !Boolean(stock),
                }
              )}
            >
              {v.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
