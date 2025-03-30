import { useMutation, QueryClient } from "@tanstack/react-query";
import { update_cart } from "../../api/cart.api";
import { CartResponse, Currency, Feature } from "../../pages/type";
import { createQueryClient, deepEqual, getOptions } from "../../utils";
import { useAuthStore } from "../../store/user";

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
  const user = useAuthStore((state) => state.user?.id || "guest");
  const queryClient: QueryClient = createQueryClient;

  return useMutation({
    mutationFn: update_cart,
    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: ["cart", user] });

      // const previousCart = queryClient.getQueryData<CartResponse>(["cart", user]);

      // let updatedItems = previousCart?.cart?.items ? [...previousCart.cart.items] : [];
      // const itemIndex = updatedItems.findIndex((item) => deepEqual(item.bind, params.bind));

      // if (params.mode === "increment") {
      //   if (itemIndex >= 0) {
      //     updatedItems[itemIndex] = {
      //       ...updatedItems[itemIndex],
      //       quantity: updatedItems[itemIndex].quantity + (params.value || 1),
      //     };
      //   } else {
      //     updatedItems.push({
      //       product: { id: params.product_id  , store_id: '', categories_id: [], name: '', description: '', default_feature_id: '', price: 0, barred_price: 0, slug: '', currency: Currency.FCFA, createdAt: new Date(), updatedAt: new Date() },
      //       quantity: params.value || 1,
      //       // bind: params.bind,
      //       realBind: params.bind,
      //       id: '',
      //       cart_id: '',
      //       bind: JSON.stringify(params.bind),
      //       created_at: '',
      //       updated_at: '',
      //     });
      //   }
      // } else if (params.mode === "decrement" && itemIndex >= 0) {
      //   updatedItems[itemIndex] = {
      //     ...updatedItems[itemIndex],
      //     quantity: updatedItems[itemIndex].quantity - (params.value || 1),
      //   };
      //   if (updatedItems[itemIndex].quantity <= 0) {
      //     updatedItems.splice(itemIndex, 1);
      //   }
      // } else if (params.mode === "clear" && itemIndex >= 0) {
      //   updatedItems.splice(itemIndex, 1);
      // } else if (params.mode === "set" && itemIndex >= 0) {
      //   updatedItems[itemIndex] = {
      //     ...updatedItems[itemIndex],
      //     quantity: params.value || 0,
      //   };
      // } else if (params.mode === "max") {
        
      // }

      // const features = queryClient.getQueryData<Feature[]>(["get_features_with_values", params.product_id]) || [];
      // const option = getOptions({ bind: params.bind, features, product_id: params.product_id });

      // let sum = 0;
      // for (const item of updatedItems) {
      //   const product = item.product;
      //   const itemPrice = (option?.additional_price || 0) + (product?.price || 0);
      //   sum += item.quantity * itemPrice;
      // }

      // const updatedCart: CartResponse = {
      //   ...previousCart,
      //   //@ts-ignore
      //   cart: { ...previousCart?.cart, items: updatedItems, id: previousCart?.cart?.id || "" },
      //   total: sum,
      // };
      // queryClient.setQueryData(["cart", user], updatedCart);

      // return { previousCart };
    },
    onError: (err, params, context) => {
      // queryClient.setQueryData(["cart", user], context?.previousCart);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user] });
    },
  });
};