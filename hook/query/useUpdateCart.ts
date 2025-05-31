import { useMutation, QueryClient } from "@tanstack/react-query";
import { update_cart } from "../../api/cart.api";
import { CartResponse, Currency, Feature } from "../../pages/type";
import { useAuthStore } from "../../store/user";
import { createQueryClient } from "../../renderer/ReactQueryProvider";

interface UpdateCartParams {
  product_id: string;
  mode: "increment" | "decrement" | "clear" | "set" | "max";
  value?: number;
  bind: Record<string, string>;
}

interface MutationContext {
  previousCart?: CartResponse;
}

export const useUpdateCart = () => {
  const authUser = useAuthStore((state) => state.user);
  const cartKeyUserIdentifier = authUser?.id || 'guest';
  return useMutation({
    mutationFn: update_cart,
    onMutate: async (params) => {
      await createQueryClient.cancelQueries({ queryKey: ["cart", cartKeyUserIdentifier] });

      const previousCartData = createQueryClient.getQueryData<CartResponse>(["cart", cartKeyUserIdentifier]);

      return { previousCartData };
    },
    onError: (err, params, context) => {
      if (context?.previousCartData) {
        createQueryClient.setQueryData(["cart", cartKeyUserIdentifier], context.previousCartData);
      }
      console.error("Mutation error in useUpdateCart:", err);
    },
    onSettled: () => {
      createQueryClient.invalidateQueries({ queryKey: ["cart", cartKeyUserIdentifier] });
      console.log('Cart query invalidated after mutation settled for user/guest:', cartKeyUserIdentifier);
    },
  });
};