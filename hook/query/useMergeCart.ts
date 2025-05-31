import { createQueryClient } from "../../renderer/ReactQueryProvider";
import { useAuthStore } from "../../store/user";
import { useMutation } from "@tanstack/react-query";
import { api } from "../../api";
import { CartResponse } from "../../pages/type";
import { getGuestCartId, removeGuestCartId } from "../../utils/storeCart";

export const useMergeCart = () => {
    const queryClient = createQueryClient;
    const authUser = useAuthStore((state) => state.user);
  
    return useMutation({
      mutationFn: async () => {
        if (!authUser) {
          console.warn("useMergeCart called without an authenticated user. Skipping merge.");
          return; 
        }
        const guestCartId = getGuestCartId();
        if (!guestCartId) {
          console.log("No guest cart ID found in localStorage. Nothing to merge.");
          queryClient.invalidateQueries({ queryKey: ['cart', authUser.id] });
          return; 
        }
        try {
          const response = await api.api?.post<CartResponse>('/v1/cart/merge', { guest_cart_id: guestCartId });
          console.log('Cart merge response:', response?.data);
          removeGuestCartId();
          console.log('Guest cart ID removed after successful merge attempt.');
          return response?.data;
        } catch (error) {
          console.error('Error during cart merge:', error);
          throw error;
        }
      },
      onSuccess: () => {
        if (authUser?.id) {
          queryClient.invalidateQueries({ queryKey: ['cart', authUser.id] });
          console.log('User cart query invalidated after merge success for user:', authUser.id);
        }
      },
      onError: (error) => {
          console.error('Failed to merge cart:', error);
      }
    });
  };