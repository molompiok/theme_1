import React from "react";
import { FeaturesType, groupFeatures, ValuesType } from "../../S1_data";
import { useproductFeatures } from "../../store/features";
import clsx from "clsx";

const colorVariants = {
  blue: `bg-blue-600 `,
  red: `bg-red-600 `,
  green: `bg-green-600 `,
  yellow: `bg-yellow-600 `,
} as const;
export default function ColorComponent({
  feature,
  productId,
}: {
  feature: FeaturesType;
  productId: string;
}) {
  const add = useproductFeatures((state) => state.add);
  const pfeature = useproductFeatures((state) => state.productFeatures);

  return (
    <div className=" p-0.5 ">
      <div>
        <h1 className="text-clamp-base  font-bold">
          {feature.required ? "Selectionne " : ""}
          {feature.name}:
        </h1>
        <div className="flex items-center justify-start flex-wrap gap-2 scrollbar-thin max-w-full max-h-28">
          {feature.values.map((v) => {
            return (
              <button
                disabled={!Boolean(groupFeatures.stock)}
                title={Boolean(groupFeatures.stock) ? "" : v.text + " est indisponible"}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (groupFeatures.stock) add(productId, feature.name, v.text);
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
                        pfeature.get(productId)?.get(feature.name) === v.text,
                      "scale-105":
                        pfeature.get(productId)?.get(feature.name) !== v.text,
                      "opacity-40 cursor-not-allowed": !Boolean(groupFeatures.stock),
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
