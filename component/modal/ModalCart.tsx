import { BsCartX, BsHandbag, BsTrash, BsX } from "react-icons/bs";
import { BASE_URL } from "../../api";
import {
  CartResponse,
  GroupProductType,
  ProductClient,
} from "../../pages/type";
import AddRemoveItemCart from "./../AddRemoveItemCart";
import { CommandButton } from "./../Button";
import Modal from "./Modal";
import { get_features_with_values } from "../../api/products.api";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loading from "./../Loading";
import { DisplayPriceItemCart } from "./../DisplayPrice";
import { ProductMedia } from "../ProductMedia";
import { useproductFeatures } from "../../store/features";
import { navigate } from "vike/client/router";
import { formatPrice } from "../../utils";
import useCart from "../../hook/query/useCart";
import { useUpdateCart } from "../../hook/query/useUpdateCart";
import { useModalCart } from "../../store/cart";

interface CartItem {
  product: ProductClient;
  group_product: GroupProductType;
}

function ItemCart({ product, group_product }: CartItem) {
  const isOpen = useModalCart((state) => state.showCart);

  const removeMutation = useUpdateCart();

  const { data: feature, isPending } = useQuery({
    queryKey: ["get_features_with_values", product.default_feature_id],
    queryFn: () =>
      product.default_feature_id
        ? get_features_with_values({ feature_id: product.default_feature_id })
        : Promise.resolve(null),
    enabled: !!product.default_feature_id && isOpen,
  });

  const pFeature = useproductFeatures((state) => state.productFeatures);
  const featureV = pFeature.get(group_product?.id);

  if (isPending) {
    return <Loading />;
  }

  const mediaList = feature?.[0]?.values?.[0]?.views ?? [];

  return (
    <div className="flex flex-col items-center p-2">
      <div className="flex gap-1 justify-center w-full">
        <ProductMedia
          mediaList={mediaList}
          productName={product.name}
          className="aspect-square size-[80px] md:size-[100px]"
        />
        <div className="relative flex-1">
          <BsTrash
            className="text-lg absolute top-0 -right-4 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Suppression déclenchée pour", group_product.id);
              removeMutation.mutate({
                group_product_id: group_product.id,
                mode: "clear",
              });
            }}
            size={20}
          />
          <h1 className="text-base md:text-lg mr-2.5 font-bold line-clamp-1">
            {product.name}
          </h1>
          <div className="flex flex-wrap items-center mb-1 gap-1">
            {featureV
              ? Array.from(featureV.entries()).map(([key, value], i) => (
                  <span
                    key={`${key}-${i}`}
                    className="text-[.68rem] rotating-border text-gray-100 border border-gray-300 px-2 py-0.5 rounded-[5px]"
                  >
                    {value.valueFeature ?? "N/A"}
                  </span>
                ))
              : null}
          </div>
          <p className="text-xs/4 md:text-sm/4 mb-2 font-light line-clamp-2">
            {product.description || "Aucune description"}
          </p>
        </div>
      </div>
      <div className="w-full flex justify-between gap-2">
        <AddRemoveItemCart
          product={product}
          group_product={group_product}
          inList={false}
        />
        <DisplayPriceItemCart product={product} group_product={group_product} />
      </div>
    </div>
  );
}

function ListItemCart({ carts }: { carts: CartItem[] }) {
  return (
    <div className="flex flex-col divide-y-2 divide-blue-100 max-h-[60vh] overflow-y-auto scroll-smooth scrollbar-thin pr-2">
      {carts?.map((cart) => (
        <ItemCart key={cart.group_product.id} {...cart} />
      ))}
    </div>
  );
}

export default function ModalCart() {
  const showCart = useModalCart((state) => state.showCart);
  const toggleCart = useModalCart((state) => state.toggleCart);
  const { carts } = useCart();

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
        <div className="flex flex-col justify-around overflow-auto">
          <div className="absolute text-black top-0 pt-5 pb-0 pl-4 border-b border-b-gray-300 flex items-center gap-2">
            <BsHandbag size={20} />
            <span className="text-lg md:text-xl font-semibold">Mon panier</span>
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
            <div className="flex flex-col gap-2 my-5 overflow-auto">
              <div className="flex justify-between">
                <span className="font-light">
                  Sous-total ({totalItems} articles)
                </span>
                <span className="font-light">
                  {formatPrice(totalPrice)} {carts[0]?.product?.currency}
                </span>
              </div>
              <span className="text-xs italic text-gray-600">
                Coût de livraison sera appliqué à la prochaine step
              </span>
            </div>
          )}

          <CommandButton
            text="PROCEDER AU PAIEMENT"
            callBack={() => {
              handleModalCartClose();
              navigate("/confirmation");
            }}
          />
        </div>
      </div>
    </Modal>
  );
}
