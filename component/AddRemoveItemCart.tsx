import React, { useMemo } from "react";
import { usePanier } from "../store/cart";
import clsx from "clsx";
import { GroupProductType, ProductClient } from "../pages/type";
import { IoMdAdd, IoMdRemove } from "react-icons/io";

const className = {
  button:
    "flex flex-col border border-gray-400 hover:bg-gray-50 cursor-pointer rounded-md px-0.5 justify-center items-center w-7 h-6 gap-y-2 sm:gap-x-3",
  span: "font-bold border-gray-300 text-center text-clamp-base px-2",
};
export default function AddRemoveItemCart({
  product,
  group_product,
  inList,
}: {
  product: ProductClient | null;
  group_product: GroupProductType;
  inList: boolean;
}) {
  const { add, subtract, panier } = usePanier();
  const itemInPanier = panier.find(
    (item) => item.group_product.id === group_product?.id
  );

  const limit = useMemo(
    () => itemInPanier?.nbr === group_product.stock,
    [itemInPanier?.nbr]
  );

  const handleClick = (type: "add" | "remove") => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product?.id) return;

    if (type === "remove") {
      if (inList || (itemInPanier?.nbr ?? 0) > 1) {
        subtract(group_product, product.price);
      }
    } else if (!limit) {
      add(product, group_product);
    }
  };

  return (
    <div
      className={clsx(
        "flex flex-col justify-center items-start gap-y-2 sm:gap-x-3 w-full",
        {
          "cart-breakpoint-2:gap-y-1": inList,
        }
      )}
    >
      <div
        className={clsx("flex items-center", {
          "w-full ": inList,
          "justify-start": !inList,
        })}
      >
        <span className="text-[.68rem] mr-1 hidden cart-breakpoint-1:block">
          Quantité:
        </span>
        <div
          className={clsx("flex items-center w-full sm:w-auto", {
            "justify-between": inList,
            "justify-center": !inList,
          })}
        >
          <button
            title="Retirer"
            onClick={handleClick("remove")}
            className={className.button}
          >
            <IoMdRemove
              size={20}
              className=" p-0.5 text-black transition-all duration-500"
            />
          </button>

          <span className="px-2 rounded-md font-bold min-w-[30px] text-center text-clamp-base">
            {itemInPanier?.nbr ?? 0}
          </span>

          <button
            title="Ajouter"
            onClick={handleClick("add")}
            disabled={limit}
            className={clsx(className.button, {
              "cursor-not-allowed opacity-20": limit,
            })}
          >
            <IoMdAdd
              size={20}
              className=" p-0.5 text-black transition-all duration-500"
            />
          </button>
        </div>
      </div>
      <span className="text-[.7rem] font-light">
        disponible {group_product.stock}
      </span>
    </div>
  );
}
