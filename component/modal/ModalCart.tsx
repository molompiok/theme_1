import { BsCartX, BsHandbag, BsTrash, BsX } from "react-icons/bs";
import { BASE_URL } from "../../api";
import { ProductClient } from "../../pages/type";
import { usePanier } from "../../store/cart";
import AddRemoveItemCart from "./../AddRemoveItemCart";
import { CommandButton } from "./../Button";
import Modal from "./Modal";
import {
  get_features_with_values,
  get_group_features,
} from "../../api/products.api";
import { useQuery } from "@tanstack/react-query";
import Loading from "./../Loading";
import { DisplayPriceItemCart } from "./../DisplayPrice";
import { ProductMedia } from "../ProductMedia";

interface CartItem {
  product: ProductClient;
  nbr: number;
  totalPrice: number;
}

function ItemCart({ product }: CartItem) {
  const removeItem = usePanier((state) => state.remove);
  const isOpen = usePanier((state) => state.showCart);

  const { data: feature, status } = useQuery({
    queryKey: ["get_features_with_values", product.default_feature_id],
    queryFn: () =>
      get_features_with_values({ feature_id: product.default_feature_id }),
    enabled: !!product.default_feature_id || isOpen,
  });

  const { data: group_features } = useQuery({
    queryKey: ["get_group_features", product.id],
    queryFn: () => get_group_features({ product_id: product.id }),
    enabled: !!product.id || isOpen,
  });

  if (status === "pending") {
    return <Loading />;
  }
  const mediaList = feature?.[0]?.values?.[0]?.views || [];

  return (
    <div className="flex flex-col items-center p-2">
      <div className="flex jus">
        <ProductMedia
          mediaList={mediaList}
          productName={product.name}
          className="aspect-square size-[80px] md:size-[100px]"
        />
        <div className=" relative flex-1">
          <BsTrash
            className="text-lg absolute top-0 -right-4 text-gray-400 hover:text-gray-600"
            onClick={() => removeItem(product.id)}
            size={20}
          />
          <h1 className="text-base md:text-lg mt-1 mr-2.5 font-bold line-clamp-1">
            {product.name}
          </h1>
          <p className="text-sm/5 md:text-base/5 font-light line-clamp-2">
            {product.description}
          </p>
        </div>
      </div>
      <div className="w-full flex justify-between gap-2">
        <AddRemoveItemCart
          product={product}
          stock={group_features?.[0]?.stock ?? 0}
          inList={false}
        />
        <div>
          <DisplayPriceItemCart product={product} />
        </div>
      </div>
    </div>
  );
}

function ListItemCart({ carts }: { carts: CartItem[] }) {
  return (
    <div className="flex flex-col divide-y-2 divide-blue-100 max-h-[70vh] overflow-y-auto scroll-smooth scrollbar-thin pr-2">
      {carts?.map((cart) => (
        <ItemCart key={cart.product.id} {...cart} />
      ))}
    </div>
  );
}

export default function ModalCart() {
  const toggleCart = usePanier((state) => state.toggleCart);
  const carts = usePanier((state) => state.panier);
  const showCart = usePanier((state) => state.showCart);

  const totalItems = carts.reduce((acc, item) => acc + item.nbr, 0);
  const totalPrice = carts.reduce((acc, item) => acc + item.totalPrice, 0);

  const handleModalCartClose = () => {
    toggleCart(false);
    document.body.style.overflow = "auto";
  };

  return (
    <Modal
      styleContainer="flex items-center select-none size-full justify-end"
      position="start"
      zIndex={100}
      setHide={handleModalCartClose}
      isOpen={showCart}
      animationName="translateRight"
    >
      <div className="font-primary relative bg-white min-h-dvh w-full overflow-auto sm:w-[400px] md:w-[450px] lg:w-[550px] p-4 pt-12">
        <div className="absolute top-2 right-2">
          <BsX
            size={40}
            className="cursor-pointer text-black z-50"
            onClick={handleModalCartClose}
            aria-label="Fermer le panier"
          />
        </div>

        <div className=" flex flex-col justify-around overflow-auto">
          <div className="absolute text-black top-0 pt-5 pb-1 pl-4 border-b border-b-gray-300 flex items-center gap-2">
            <BsHandbag size={20}/>
            <span className="text-lg md:text-xl font-semibold">
              Mon panier
            </span>
            <span className="text-sm">({totalItems} articles)</span>
          </div>

          <ListItemCart carts={carts} />
          {carts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 mt-10">
              <BsCartX size={70} className="text-gray-400 animate-pulse" />
              <p className="text-lg font-medium text-gray-600">
                Votre panier est vide
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 mt-2 overflow-auto">
              <div className="flex justify-between">
                <span className="font-bold">Sous-total</span>
                <span>
                  {totalPrice} {carts[0]?.product?.currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Livraison</span>
                <span>0 {carts[0]?.product?.currency}</span>
              </div>
            </div>
          )}

          <CommandButton
            text="PROCEDER AU PAIEMENT"
            // className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-800"
          />
        </div>
      </div>
    </Modal>
  );
}
