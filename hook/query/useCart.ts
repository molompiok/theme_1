import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/user';
import { view_cart } from '../../api/cart.api';



const useCart = () => {
    const user = useAuthStore((state) => state.user?.id || 'guest');
  const  query = useQuery({
    queryKey: ['cart', user],
    queryFn: view_cart,
  });

  return query
};

export default useCart;