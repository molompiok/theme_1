import React, { useMemo } from "react";
import { groupFeatures, ProductType } from "../S1_data";
import { usePanier } from "../store/cart";
import clsx from "clsx";

export default function AddRemoveItemCart({
  product,
}: {
  product: ProductType | null;
}) {
  const { add, substrat, panier } = usePanier();
  
  const itemInPanier = panier.find((item) => item.product.id === product?.id);
  const limit = useMemo(
    () => itemInPanier?.nbr === groupFeatures.stock,
    [itemInPanier?.nbr]
  );
  return (
    <div className="flex flex-col font-primary justify-center items-start">
      <div className="flex justify-center items-center">
        <span className="text-xs font-semibold mr-1">
          Quantité(s):
        </span>
        <button
          title="Retirer"
          onClick={(e) => {
            e.stopPropagation();
            if (product?.id && (itemInPanier?.nbr ?? 0) > 1) {
              substrat(product.id, product.price);
            }
          }}
          className="flex items-center cursor-pointer justify-center bg-gray-100 rounded-lg"
        >
          <span className="font-bold text-black text-center px-3 h-[26px]">
            -
          </span>
        </button>
        <span className="px-2 rounded-md  font-bold">
          {itemInPanier?.nbr}
        </span>
        <button
          title="Ajouter"
          onClick={(e) => {
            e.stopPropagation();
            if (
              groupFeatures.stock !== undefined &&
              (itemInPanier?.nbr ?? 0) >= groupFeatures.stock
            )
              return;
            if (product?.id) {
              add(product);
            }
          }}
          disabled={limit}
          className={clsx(
            "flex items-center cursor-pointer bg-gray-100 rounded-lg",
            {
              "cursor-not-allowed": limit,
              "opacity-50": limit,
              "opacity-100": !limit,
            }
          )}
        >
          <span
            className={clsx(
              "font-bold text-black text-center px-3 h-[26px]",
              {
                "cursor-not-allowed": limit,
                "opacity-50": limit,
                "opacity-100": !limit,
              }
            )}
          >
            +
          </span>
        </button>
      </div>
      <span className="text-xs">stock : {groupFeatures.stock}</span>
    </div>
  );
}
