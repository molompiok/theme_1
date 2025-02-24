import React, { useMemo } from "react";
import { useproductFeatures } from "../../store/features";
import { FeaturesType } from "../../S1_data";
import clsx from "clsx";

export default function ButtonValidCart({
  features,
  productId,
}: {
  features: FeaturesType[];
  productId: string;
}) {
  const pfeature = useproductFeatures((state) => state.productFeatures);
  const ProductWhoRequired = useMemo(() => {
    let val = features.find((f) => {
      const v = f.required;
      let validIsFIll = false;
      if (v) {
        validIsFIll = Boolean(pfeature.get(productId)?.get(f.name));
        return !validIsFIll;
      } else {
        return validIsFIll;
      }
    });
    return val;
  }, [pfeature,features]);
  return (
    <div
      className={clsx(
        ` text-center text-clamp-base text-cyan-50 w-full py-2 mt-7`,
        {
          "bg-black/45": Boolean(ProductWhoRequired?.id),
          "bg-black": Boolean(!ProductWhoRequired?.id),
        }
      )}
    >
      {Boolean(ProductWhoRequired?.id)
        ? "selectionnez " + ProductWhoRequired?.name
        : "Ajouter au panier"}
    </div>
  );
}
