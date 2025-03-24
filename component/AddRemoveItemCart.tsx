import React, { useMemo } from "react";
import clsx from "clsx";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { update_cart, view_cart } from "../api/cart.api";
import { CartResponse, GroupProductType, ProductClient } from "../pages/type";
import { useAuthStore } from "../store/user";
import { FaSpinner } from "react-icons/fa";
import { createQueryClient } from "../utils";
import useCart from "../hook/query/useCart";

export default function AddRemoveItemCart({
  product,
  group_product,
  inList,
}: {
  product: ProductClient | null;
  group_product: GroupProductType;
  inList: boolean;
}) {
  const user = useAuthStore((state) => state.user?.id || 'guest');

  const { data: serverCart, isLoading: isCartLoading } = useCart()

  const itemInPanier = useMemo(
    () =>
      serverCart?.cart?.items.find(
        (item) => item.group_product_id === group_product?.id
      ),
    [serverCart?.cart?.items, group_product?.id]
  );

  const isStockLimitReached = useMemo(
    () => itemInPanier?.quantity === group_product.stock,
    [itemInPanier?.quantity, group_product.stock]
  );

  const updateCartMutation = useMutation({
    mutationFn: update_cart,
    onMutate: async (params) => {
      await createQueryClient.cancelQueries({ queryKey: ["cart", user] });
      const previousCart = createQueryClient.getQueryData(["cart", user]) as CartResponse;

      let updatedItems = previousCart?.cart?.items
        ? [...previousCart.cart.items]
        : [];
      const itemIndex = updatedItems.findIndex(
        (item) => item.group_product_id === params.group_product_id
      );

      if (params.mode === "increment") {
        if (itemIndex >= 0) {
          updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            quantity: updatedItems[itemIndex].quantity + (params.value || 1),
          };
        }
      } else if (params.mode === "decrement" && itemIndex >= 0) {
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          quantity: updatedItems[itemIndex].quantity - (params.value || 1),
        };
        if (updatedItems[itemIndex].quantity <= 0) {
          updatedItems.splice(itemIndex, 1);
        }
      } else if (params.mode === "clear" && itemIndex >= 0) {
        updatedItems.splice(itemIndex, 1);
      }

      createQueryClient.setQueryData(["cart", user], {
        ...previousCart,
        cart: { ...previousCart?.cart, items: updatedItems },
        total: updatedItems.reduce(
          (sum, item) =>
            sum +
            item.quantity *
              ((item.group_product.product?.price || 0) +
                (item.group_product.additional_price || 0)),
          0
        ),
      });

      return { previousCart };
    },
    onError: (err, params, context) => {
      createQueryClient.setQueryData(["cart", user], context?.previousCart);
    },
    onSettled: () => {
      createQueryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const handleClick = (type: "add" | "remove") => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product?.id || updateCartMutation.isPending) return;

    if (type === "remove") {
      if (inList || (itemInPanier?.quantity ?? 0) > 1) {
        updateCartMutation.mutate({
          group_product_id: group_product.id,
          mode: "decrement",
          value: 1,
        });
      } else {
        updateCartMutation.mutate({
          group_product_id: group_product.id,
          mode: "clear",
        });
      }
    } else if (!isStockLimitReached) {
      updateCartMutation.mutate({
        group_product_id: group_product.id,
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
        disponible {group_product.stock}
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