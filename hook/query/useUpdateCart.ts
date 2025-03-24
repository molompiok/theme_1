import { useMutation, useQueryClient } from "@tanstack/react-query";
import { update_cart } from "../../api/cart.api";
import { CartResponse } from "../../pages/type";
import { createQueryClient } from "../../utils";
import { useAuthStore } from "../../store/user";


interface UpdateCartParams {
  group_product_id: string;
  mode: "increment" | "decrement" | "clear" | "set" | "max";
  value?: number;
}

export const useUpdateCart = () => {
  const user = useAuthStore((state) => state.user?.id || 'guest');

  return useMutation({
    mutationFn: update_cart,
    onMutate: async (params: UpdateCartParams) => {
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
};
