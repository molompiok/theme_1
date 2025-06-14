import { useMutation, useQueryClient } from "@tanstack/react-query";
import { update_cart } from "../../api/cart.api";
import { CartResponse } from "../../pages/type";
import { useAuthStore } from "../../store/user";
import { AxiosInstance } from "axios";

interface UpdateCartParams {
  product_id: string;
  mode: "increment" | "decrement" | "clear" | "set" | "max";
  value?: number;
  bind: Record<string, string>;
  ignoreStock?: boolean;
}

interface MutationContext {
  previousCart?: CartResponse;
}

export const useUpdateCart = (api: AxiosInstance) => {

  const queryClient = useQueryClient();
  const authUser = useAuthStore((state) => state.user);
  const cartKeyUserIdentifier = authUser?.id || 'guest';
  return useMutation({
    mutationFn: (params: UpdateCartParams) => update_cart(params, api),
    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: ["cart", cartKeyUserIdentifier] });

      const previousCartData = queryClient.getQueryData<CartResponse>(["cart", cartKeyUserIdentifier]);

      return { previousCartData };
    },
    onError: (err, params, context) => {
      if (context?.previousCartData) {
        queryClient.setQueryData(["cart", cartKeyUserIdentifier], context.previousCartData);
      }
      console.error("Mutation error in useUpdateCart:", err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", cartKeyUserIdentifier] });
      console.log('Cart query invalidated after mutation settled for user/guest:', cartKeyUserIdentifier);
    },
  });
};