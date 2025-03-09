import { BsHandbag, BsX } from "react-icons/bs";
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

  const { data: feature, status } = useQuery({
    queryKey: ["get_features_with_values", product.default_feature_id],
    queryFn: () =>
      get_features_with_values({ feature_id: product.default_feature_id }),
    enabled: !!product.default_feature_id,
  });

  const { data: group_features } = useQuery({
    queryKey: ["get_group_features", product.id],
    queryFn: () => get_group_features({ product_id: product.id }),
    enabled: !!product.id,
  });

  if (status === "pending") {
    return <Loading />;
  }
  const mediaList = feature?.[0]?.values?.[0]?.views || [];

  return (
    <div className=" flex items-center justify-between py-2 overflow-y-auto">
      <div className="flex flex-col justify-center items-center h-full">
        <div className="flex items-stretch gap-2 p-2 h-full">
          <ProductMedia
            mediaList={mediaList}
            productName={product.name}
            className="aspect-square cart-breakpoint-1:size-[130px]"
          />
          <div className="flex flex-col gap-1 items-stretch justify-between h-full">
            <h1 className="text-clamp-md font-bold cart-breakpoint-1:line-clamp-2 line-clamp-1 overflow-hidden text-ellipsis">
              {product.name}
            </h1>
            <p className="text-clamp-base font-light line-clamp-2">
              {product.description}
            </p>
          </div>
        </div>
        <div className="w-full flex justify-between">
          <AddRemoveItemCart
            product={product}
            stock={group_features?.[0]?.stock ?? 0}
            inList={false}
          />
          <div className="flex flex-col justify-between items-center gap-y-3 h-full">
            <button
              onClick={() => removeItem(product.id)}
              className="px-2 cursor-pointer whitespace-nowrap text-clamp-xs underline text-gray-400"
            >
              supprimer
            </button>
            <div>
              <DisplayPriceItemCart product={product} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ListItemCart({ carts }: { carts: CartItem[] }) {
  return (
    <div className="flex flex-col gap-2 divide-y-2 divide-blue-100 max-h-[65vh] overflow-y-auto scroll-smooth scrollbar-thin">
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
      <div className="font-primary relative bg-white min-h-dvh md:w-[550px] w-full px-2 pt-10">
        <div className="absolute top-0 right-2">
          <BsX
            size={50}
            className="cursor-pointer text-black"
            onClick={handleModalCartClose}
          />
        </div>

        <div className="flex flex-col gap-4 justify-center items-start">
          <div className="flex justify-center items-center gap-0.5 w-full">
            <BsHandbag size={20} className="text-black" />
            <span className="text-clamp-base whitespace-nowrap underline underline-offset-2 decoration-black/70">
              Mon panier
            </span>
            <span className="text-sm">({totalItems} articles)</span>
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
  );
}
