import { BsCartX, BsHandbag, BsTrash, BsX, BsArrowRight } from "react-icons/bs";
import {
  CartItem,
  CartResponse,
  GroupProductType,
  ProductClient,
  ProductFeature,
} from "../../pages/type";
import AddRemoveItemCart from "./../AddRemoveItemCart";
import { CommandButton } from "./../Button";
import Modal from "./Modal";
import { get_features_with_values } from "../../api/products.api";
import { useQuery } from "@tanstack/react-query";
import Loading from "./../Loading";
import { DisplayPriceItemCart } from "./../DisplayPrice";
import { ProductMedia } from "../ProductMedia";
import { navigate } from "vike/client/router";
import { formatPrice, getOptions, isEmpty } from "../../utils";
import useCart from "../../hook/query/useCart";
import { useUpdateCart } from "../../hook/query/useUpdateCart";
import { useModalCart } from "../../store/cart";
import { useMemo, useState } from "react";
import { useMediaViews } from "../../hook/query/useMediaViews";
import BindTags from "../product/BindTags";
import { MarkdownViewer } from "../MarkdownViewer";

function ItemCart({
  product,
  bind,
}: {
  product: ProductClient;
  bind: Record<string, string>;
}) {
  const isOpen = useModalCart((state) => state.showCart);
  const removeMutation = useUpdateCart();
  const [isHovering, setIsHovering] = useState(false);

  const { data: features, isPending } = useQuery({
    queryKey: ["get_features_with_values", product?.id],
    queryFn: () =>
      product?.id
        ? get_features_with_values({ product_id: product?.id })
        : Promise.resolve(null),
    enabled: !!product?.id && isOpen,
  });

  const options = useMemo(
    () =>
      getOptions({ bind, features: features || [], product_id: product.id }),
    [bind, features, product.id]
  );
  const { isPendingFeatures, mediaViews } = useMediaViews({
    bindNames: options.bindNames,
    product_id: product.id,
  });
  console.log("🚀 ~ ItemCart ~ options:", options.bindNames);

  if (isPending) {
    return (
      <div className="flex justify-center py-6">
        <Loading />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col p-3 rounded-lg transition-all duration-200 hover:bg-gray-50"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-center gap-3 w-full">
        {/* Conteneur avec une taille fixe pour l'image */}
        <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-md overflow-hidden bg-white border border-gray-100">
          <ProductMedia
            mediaList={mediaViews}
            productName={product.name}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="relative flex flex-col justify-between flex-grow">
          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-base md:text-lg font-bold line-clamp-1 pr-6">
                {product.name}
              </h1>
              <button
                className={`p-2 rounded-full transition-all duration-200 ${
                  isHovering ? "bg-red-50 text-red-500" : "text-gray-400"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  removeMutation.mutate({
                    product_id: product.id,
                    bind,
                    mode: "clear",
                  });
                }}
                aria-label="Supprimer du panier"
              >
                <BsTrash size={16} />
              </button>
            </div>
            <BindTags
              tags={
                (options?.bindNames as Record<string, ProductFeature>) || {}
              }
            />

            {/* {Object.keys(options?.bindNames || {}).length > 0 && (
              <div className="flex flex-wrap items-center mt-1 mb-2 gap-1.5">
                {Array.from(Object.entries(options?.bindNames || {})).map(([key, value], i) => (
                  <span
                    key={`${key}-${i}`}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                  >
                    {typeof value === 'string' ? value : value?.text || value?.key || 'N/A'}
                  </span>
                ))}
              </div>
            )} */}
            <MarkdownViewer
              markdown={
                product.description
                  .substring(0, 100)
                  .trim()
                  .split("\n")
                  .slice(0, 5)
                  .join("\n") || ""
              }
            />
            {
              // product.description && (
              //   <p className="text-xs md:text-sm max-w-[300px] overflow-y-auto text-gray-600 line-clamp-2">
              //     {product.description}
              //   </p>
              // )
            }
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
        <AddRemoveItemCart
          product={product}
          bind={options.bind}
          features={features ?? []}
          inList={false}
        />
        <DisplayPriceItemCart
          product={product}
          bind={bind}
          features={features ?? []}
        />
      </div>
    </div>
  );
}

function ListItemCart({ cart }: { cart: CartItem[] }) {
  const toggleCart = useModalCart((state) => state.toggleCart);

  if (!cart || cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <BsCartX size={80} className="text-gray-300 mb-4" />
        <p className="text-xl font-medium text-gray-700 mb-2">
          Votre panier est vide
        </p>
        <p className="text-sm text-gray-500 text-center mb-6">
          Ajoutez des articles à votre panier pour pouvoir passer commande
        </p>
        <button
          onClick={() => toggleCart(false)}
          className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Continuer mes achats
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-gray-200 overflow-y-auto scroll-smooth scrollbar-thin pr-1">
      {cart.map((item, i) => {
        let bind = item.realBind || item.bind;

        if (item.realBind && item.bind) {
          //@ts-ignore
          bind = isEmpty(item.realBind) ? item.bind : item.realBind;
        }

        bind = typeof bind === "string" ? JSON.parse(bind) : bind;
        bind = bind || {};

        return <ItemCart key={i} product={item.product} bind={bind} />;
      })}
    </div>
  );
}

export default function ModalCart() {
  const showCart = useModalCart((state) => state.showCart);
  const toggleCart = useModalCart((state) => state.toggleCart);
  const { data: cart, isLoading, isPending } = useCart();

  const totalItems =
    cart?.cart?.items?.reduce((acc: number, item) => acc + item.quantity, 0) ||
    0;
  const totalPrice = cart?.total || 0;
  const hasItems = (cart?.cart?.items?.length ?? 0) > 0;

  const handleModalCartClose = () => {
    toggleCart(false);
    document.body.style.overflow = "auto";
  };

  const handleCheckout = () => {
    handleModalCartClose();
    navigate("/confirmation");
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
      <div className="font-primary relative bg-white flex flex-col h-dvh w-full sm:w-[400px] md:w-[450px] lg:w-[500px]">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="relative">
              <BsHandbag size={20} className="text-gray-600" />
              {totalItems > 0 && (
                <span className="absolute -top-3 -right-5 text-xs  bg-gray-500 text-white  font-medium px-2 p-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="ml-5 text-lg font-semibold">Mon panier</span>
          </div>
          <button
            className="rounded-full p-1 hover:bg-gray-100 transition-colors"
            onClick={handleModalCartClose}
            aria-label="Fermer le panier"
          >
            <BsX size={30} className="text-gray-700" />
          </button>
        </div>

        {isPending || isLoading ? (
          <div className="flex-1 flex justify-center items-center">
            <Loading />
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <ListItemCart cart={cart?.cart?.items || []} />
          </div>
        )}

        {hasItems && (
          <div className="border-t border-gray-200 bg-white p-4 pt-3">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sous-total</span>
                <span>
                  {formatPrice(
                    totalPrice,
                    cart?.cart?.items?.[0]?.product?.currency
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Livraison</span>
                <span className="text-gray-600 italic">
                  Calculé à l'étape suivante
                </span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>
                  {formatPrice(
                    totalPrice,
                    cart?.cart?.items?.[0]?.product?.currency
                  )}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleCheckout}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                Procéder au paiement
                <BsArrowRight size={18} />
              </button>
              <button
                onClick={handleModalCartClose}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Continuer mes achats
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
