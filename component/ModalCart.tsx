import { BsHandbag, BsX } from 'react-icons/bs';
import { BASE_URL } from '../api';
import { ProductClient } from '../pages/type';
import { usePanier } from '../store/cart';
import AddRemoveItemCart from './AddRemoveItemCart';
import { CommandButton } from './Button';
import { DisplayPriceItemCart } from './FeatureDetailProduct/DisplayPriceItemCart';
import Modal from './Modal';
import { get_features_with_values, get_group_features } from '../api/products.api';
import { useQuery } from '@tanstack/react-query';
import Loading from './Loading';



export default function ModalCart() {
  const toggleCart = usePanier((state) => state.toggleCart);

  const carts = usePanier((state) => state.panier);

  const totalItems = carts.reduce((acc, item) => acc + item.nbr, 0);
  const totalPrice = carts.reduce((acc, item) => acc + item.totalPrice, 0);
  const showCart = usePanier((state) => state.showCart);

  const handleModalcartClose = () => {
    toggleCart(false);
    document.body.style.overflow = "auto";
  };


  return (
    <Modal
      styleContainer="flex items-center select-none size-full justify-end"
      position="start"
      zIndex={100}
      setHide={handleModalcartClose}
      isOpen={showCart}
      animationName="translateRight"
    >
      <div className="font-primary relative bg-white min-h-dvh md:w-[550px] w-full px-2 pt-10">
        <div className="absolute top-8 right-8">
          <BsX
            size={50}
            className="cursor-pointer text-black"
            onClick={handleModalcartClose}
          />
        </div>
        <div className="flex flex-col gap-4 justify-center items-start">
          <div className="flex justify-center items-center gap-0.5 w-full">
            <BsHandbag size={20} className="text-black" />
            <span className="text-clamp-base whitespace-nowrap underline underline-offset-2  decoration-black/70">
              Mon panier
            </span>
            <span className="text-sm">( {totalItems} articles)</span>
          </div>
          <ListItemCart carts={carts} />
          <div className="flex w-full flex-col gap-3">
            <div className="flex justify-between w-full">
              <span className="font-bold">Sous-total</span>
              <span className="font-light">
                {totalPrice} {carts[0]?.product?.currency}
              </span>
            </div>

            <div className="flex justify-between w-full">
              <span className="font-bold">Livraison</span>
              <span className="font-light">
                0 {carts[0]?.product?.currency}
              </span>
            </div>
          </div>
          <CommandButton text="PROCEDER AU PAIEMENT" />
        </div>
      </div>
    </Modal>
  )
}

function ListItemCart({ carts }: {
  carts: {
    product: ProductClient;
    nbr: number;
    totalPrice: number;
  }[]
}) {

  return <div className="flex flex-col gap-2 divide-y-2 divide-blue-100 max-h-[65vh] overflow-y-auto scroll-smooth scrollbar-thin">
    {carts?.map((cart) => {
      return <ItemCart key={cart.product.id} {...cart} />
    })}
  </div>;

}

function ItemCart(cart: { product: ProductClient; nbr: number; totalPrice: number; }) {
  const removeItem = usePanier((state) => state.remove);

  const { data: feature, status } = useQuery({
    queryKey: ['get_features_with_values', cart?.product.default_feature_id],
    queryFn: () => get_features_with_values({ feature_id: cart?.product.default_feature_id }),
    enabled: !!cart?.product?.default_feature_id
  });

  const { data: group_features, status: status_group_feature } = useQuery({
    queryKey: ['get_group_features', cart?.product?.id],
    queryFn: () => get_group_features({ product_id: cart?.product?.id }),
    enabled: !!cart?.product?.id
});
  return <div

    className="flex items-center justify-between h-[150px] py-2 "
  >
    {status === 'pending' ? <Loading /> :
      (<>
        <div className="flex h-full">
          <img
            src={BASE_URL + feature?.[0]?.views[0]}
            className="size-32" />
          <div className="flex items-stretch flex-col px-2">
            <div className="flex flex-col h-full">
              <h1 className="text-clamp-base font-bold">
                {cart.product.name}
              </h1>
              <p className="text-clamp-xs font-light line-clamp-1 ">
                {cart.product.description}
              </p>
            </div>
            <AddRemoveItemCart product={cart.product} stock={group_features?.[0]?.stock ?? 0}/>
          </div>
        </div>
        <div className="flex flex-col justify-between items-end h-full">
          <button
            onClick={() => {
              removeItem(cart.product.id);
            }}
            className="px-2 cursor-pointer whitespace-nowrap text-clamp-xs underline text-gray-400"
          >
            supprimer
          </button>
          <DisplayPriceItemCart product={cart.product} />
        </div>
      </>)}
  </div>
}