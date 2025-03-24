import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/user';
import { view_cart } from '../../api/cart.api';



const useCart = () => {
    const user = useAuthStore((state) => state.user?.id || 'guest');
  const  query = useQuery({
    queryKey: ['cart', user],
    queryFn: view_cart,
  });

  const carts = query.data?.cart?.items?.map((item) => ({
    product: item.group_product.product,
    group_product: item.group_product,
    nbr: item.quantity,
    totalPrice:
      item.quantity *
      ((item.group_product.product.price || 0) +
        (item.group_product.additional_price || 0)),
  })) || [];

  return { carts, ...query };
};

export default useCart;