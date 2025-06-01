import React, { useMemo } from "react";
import clsx from "clsx";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { update_cart, view_cart } from "../api/cart.api";
import { CartResponse, Feature, GroupProductType, ProductClient } from "../pages/type";
import { useAuthStore } from "../store/user";
import { FaSpinner } from "react-icons/fa";
import { deepEqual, getOptions, isEmpty } from "../utils";
import useCart from "../hook/query/useCart";
import { useUpdateCart } from "../hook/query/useUpdateCart";

export default function AddRemoveItemCart({
  product,
  inList,
  bind,
  features
}: {
  product: ProductClient | undefined;
  inList: boolean;
  bind: Record<string, string>;
  features : Feature[]
}) {

  const { data: serverCart, isLoading: isCartLoading } = useCart()

  const itemInPanier = useMemo(
    () =>
      serverCart?.cart?.items.find(
        (item) => {
          let bindT = item.realBind || item.bind;
          
          if (item.realBind || item.bind) {
            //@ts-ignore
            bindT = isEmpty(item.realBind) ? item.bind : item.realBind;
          }
  
          bindT = typeof bindT === 'string' ? JSON.parse(bindT) : bindT;
  
          bindT = bindT || {};
          const isEqual = deepEqual(bind, bindT);
          return isEqual && product?.id == item?.product?.id
        }
      ),
    [serverCart?.cart?.items, bind]
  );

  const group_product =  getOptions({ bind: itemInPanier?.realBind || {}, features, product_id: product?.id || '' });

  const isStockLimitReached = useMemo(
    () => itemInPanier?.quantity === 0,
    [itemInPanier?.quantity]
  );

  const updateCartMutation = useUpdateCart()

  const handleClick = (type: "add" | "remove") => (e: React.MouseEvent) => {
    e.stopPropagation();
  
    if (!product?.id || updateCartMutation.isPending) return;
    const bindT = bind && Object.keys(bind).length > 0 
    ? bind 
    : itemInPanier?.realBind ?? {};
  
    const mutationPayload = {
      product_id: product.id,
      bind: bindT,
    };
  
    if (type === "remove") {
      const quantity = itemInPanier?.quantity ?? 0;
      updateCartMutation.mutate({
        ...mutationPayload,
        mode: quantity > 1 || inList ? "decrement" : "clear",
        value: quantity > 1 || inList ? 1 : undefined,
      });
    } else if (type === "add" && !isStockLimitReached) {
      updateCartMutation.mutate({
        ...mutationPayload,
        mode: "increment",
        value: 1,
      });
    }
  };

  const isLoading = isCartLoading || updateCartMutation.isPending;

  return (
    <div
      className={clsx(
        "w-full flex flex-col justify-start items-start sm:gap-x-3",
        {
          "cart-breakpoint-2:gap-y-1 items-center": inList,
          "items-start": !inList,
        }
      )}
    >
       <span  
        className={clsx("text-[.7rem]/4 mt-0.5 italic font-light", {
          hidden: inList,
          block: !inList,
        })}
      >
        disponible {(group_product.stock || 0) - (itemInPanier?.quantity || 0)}
      </span>
      <div
        className={clsx("flex items-center", {
          "w-fit justify-start border border-gray-300": inList,
          "justify-start border-2 border-gray-300": !inList,
        })}
      >
        <div
          className={clsx("flex items-center w-full sm:w-auto", {
            "justify-between": inList,
            "justify-center": !inList,
          })}
        >
          <button
            title="Retirer"
            onClick={handleClick("remove")}
            disabled={isLoading || !itemInPanier?.quantity}
            className={clsx(
              "flex flex-col hover:bg-gray-100 rounded-md justify-center items-center py-1 px-2 gap-y-2 sm:gap-x-3",
              {
                "cursor-not-allowed opacity-50":
                  isLoading || !itemInPanier?.quantity,
              }
            )}
          >
            <IoMdRemove
              size={20}
              className="p-0.5 text-black transition-all duration-500"
            />
          </button>

          <span className="px-2 rounded-md font-bold min-w-[30px] text-center text-clamp-base">
            {isLoading ? (
              <FaSpinner className="animate-spin text-gray-500" size={16} />
            ) : (
              itemInPanier?.quantity ?? 0
            )}
          </span>

          <button
            title="Ajouter"
            onClick={handleClick("add")}
            disabled={isLoading || isStockLimitReached}
            className={clsx(
              "flex flex-col hover:bg-gray-100 rounded-md justify-center items-center py-1 px-2 gap-y-2 sm:gap-x-3",
              {
                "cursor-not-allowed opacity-50":
                  isLoading || isStockLimitReached,
              }
            )}
          >
            <IoMdAdd
              size={20}
              className="p-0.5 text-black transition-all duration-500"
            />
          </button>
        </div>
      </div>
     
    </div>
  );
}