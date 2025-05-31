import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/user';
import { view_cart } from '../../api/cart.api';



const useCart = () => {
  const authUser = useAuthStore((state) => state.user);
  // La clé ici sera 'guest' si non connecté, ou l'ID de l'utilisateur si connecté.
  // view_cart_api saura utiliser le guest_cart_id du localStorage si 'guest'.
  const cartKeyUserIdentifier = authUser?.id || 'guest';
  const  query = useQuery({
    queryKey: ['cart', cartKeyUserIdentifier],
    queryFn: view_cart,
  });

  return query
};

export default useCart;