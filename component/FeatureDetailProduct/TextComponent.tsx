import React from "react";
import { FeaturesType, groupFeatures, ValuesType } from "../../S1_data";
import { useproductFeatures } from "../../store/features";
import clsx from "clsx";

export default function TextComponent({
  feature,
  productId,
}: {
  feature: FeaturesType;
  productId: string;
}) {
  const add = useproductFeatures((state) => state.add);
  const pfeature = useproductFeatures((state) => state.productFeatures);

  return (
    <div className="flex flex-col  my-0.5">
      <h1 className="text-clamp-base font-bold">
        {feature.required ? "Selectionne " : ""}
        {feature.name}:
      </h1>
      <div className="flex items-center flex-wrap justify-start max-w-full overflow-x-auto scrollbar-thin max-h-28 gap-3 ">
        {feature.values.map((v) => {
          return (
            <button
              title={Boolean(groupFeatures.stock) ? "" : v.text + " est indisponible"}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (groupFeatures.stock) add(productId, feature.name, v.text);
              }}
              disabled={!Boolean(groupFeatures.stock)}
              key={v.id}
              className={clsx(
                `border cursor-pointer  text-clamp-xs flex justify-center items-center border-gray-300 px-3 sm:min-h-[40px]  min-h-[30px] rounded-md transition-all duration-500`,
                {
                  "bg-black text-teal-50":
                    pfeature.get(productId)?.get(feature.name) === v.text,
                  "bg-white text-black":
                    pfeature.get(productId)?.get(feature.name) !== v.text,
                  "opacity-40 cursor-not-allowed": !Boolean(groupFeatures.stock),
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
