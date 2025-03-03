import React from "react";
import { useproductFeatures } from "../../store/features";
import clsx from "clsx";
import { FeatureType } from "../../pages/type";

const colorVariants = {
  blue: `bg-blue-600 `,
  red: `bg-red-600 `,
  green: `bg-green-600 `,
  yellow: `bg-yellow-600 `,
} as const;
export default function ColorComponent({
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
    <div className=" p-0.5 ">
      <div>
        <h1 className="text-clamp-base  font-bold">
          {feature_required ? "Selectionne " : ""}
          {feature_name}:
        </h1>
        <div className="flex items-center justify-start flex-wrap gap-2 scrollbar-thin max-w-full max-h-28">
          {features.map((v) => {
            return (
              <button
                disabled={!Boolean(stock)}
                title={Boolean(stock) ? "" : v.text + " est indisponible"}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (stock) add(productId, feature_name, v.text);
                }}
                key={v.id}
                className={clsx(`relative cursor-pointer sm:size-10 size-8`)}
              >
                <div
                  className={clsx(
                    `absolute top-0 size-full bg-gray-400 rounded-3xl duration-300 transition-all`
                  )}
                />
                <div
                  className={clsx(
                    `absolute top-0 size-full border-[3px] border-white rounded-3xl duration-300 transition-all ${
                      colorVariants[v.text as keyof typeof colorVariants]
                    }`,
                    {
                      "scale-90":
                        pfeature.get(productId)?.get(feature_name) === v.text,
                      "scale-105":
                        pfeature.get(productId)?.get(feature_name) !== v.text,
                      "opacity-40 cursor-not-allowed": !Boolean(stock),
                    }
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
