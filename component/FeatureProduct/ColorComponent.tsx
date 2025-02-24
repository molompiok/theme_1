import React from "react";
import { FeaturesType, ValuesType } from "../../S1_data";
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
    <div className="flex items-center justify-start overflow-x-auto gap-3 scrollbar-thin my-0.5 p-0.5">
      {feature.values.map((v) => {
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              add(productId, feature.name, v.text);
            }}
            key={v.id}
            className={clsx(`relative cursor-pointer size-10 `)}
          >
            <div
              className={clsx(
                `absolute top-0 size-full bg-gray-400 rounded-3xl duration-300 transition-all`
              )}
            />
            <div
              className={clsx(
                `absolute top-0 size-full border-2 border-white rounded-3xl duration-300 transition-all ${
                  colorVariants[v.text as keyof typeof colorVariants]
                }` ,
                {
                  "scale-90":
                    pfeature.get(productId)?.get(feature.name) === v.text,
                  "scale-105":
                    pfeature.get(productId)?.get(feature.name) !== v.text
                }
              )}
            />

          </button>
        );
      })}
    </div>
  );
}
