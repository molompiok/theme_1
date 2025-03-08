import { useMemo } from "react";
import { useproductFeatures, useProductSelectFeature } from "../store/features";
import clsx from "clsx";
import { usePanier } from "../store/cart";
import { Feature, ProductClient } from "../pages/type";
import { useQuery } from "@tanstack/react-query";
import { get_features_with_values } from "../api/products.api";
import AddRemoveItemCart from "./AddRemoveItemCart";
import { BsHandbag, BsPlus } from "react-icons/bs";

export function CartButton({
  text,
  product,
  stock,
}: {
  text: string;
  product: ProductClient;
  stock: number;
}) {
  const setFeatureModal = useProductSelectFeature(
    (state) => state.setFeatureModal
  );
  const addProduct = usePanier((state) => state.add);
  const carts = usePanier((state) => state.panier);

  const toggleCart = usePanier((state) => state.toggleCart);
  const { data: feature, status } = useQuery({
    queryKey: ["get_features_with_values", product.default_feature_id],
    queryFn: () =>
      get_features_with_values({ feature_id: product.default_feature_id }),
  });
  const itemInPanier = carts.find((item) => item.product.id === product?.id);

  return (
    // <div className="px-2 w-full group relative overflow-hidden inline-block">
    //   {!itemInPanier || itemInPanier.nbr === 0 ? <button
    //     disabled={status !== 'success' || stock === 0}
    //     onClick={(e) => {
    //       e.stopPropagation();
    //       document.body.style.overflow = "hidden";
    //       if (feature?.length ?? 0 <= 1) {
    //         toggleCart(true)
    //         addProduct(product, stock)
    //       } else {
    //         setFeatureModal(true, product);
    //       }
    //     }}
    //     className="w-full border py-1 border-gray-300 px-1 rounded-xs cursor-pointer relative z-10 bg-white overflow-hidden"
    //   >
    //     <span className="relative whitespace-nowrap z-20 font-light group-hover:text-white group-hover:font-bold  transition-all duration-500 text-clamp-base -translate-y-1/2 group-hover:translate-y-0">
    //       <span className="inline">{stock !== 0 ? text : 'indisponible'}</span>
    //     </span>
    //     <div className="absolute -top-1 left-0 w-full h-[calc(100%+.25rem)] bg-black z-10 transition-transform duration-500 transform -translate-y-full group-hover:translate-y-0"></div>
    //   </button> : <AddRemoveItemCart product={product} stock={stock} inList={true}/>}
    // </div>
    <div className="w-full font-secondary group relative overflow-hidden inline-block">
      {!itemInPanier || itemInPanier.nbr === 0 ? (
        <button
          disabled={status !== "success" || stock === 0}
          onClick={(e) => {
            e.stopPropagation();
            document.body.style.overflow = "hidden";
            if (feature?.length ?? 0 <= 1) {
              toggleCart(true);
              addProduct(product, stock);
            } else {
              setFeatureModal(true, product);
            }
          }}
          className="flex justify-center items-center w-full border py-1 border-gray-500 rounded-xs cursor-pointer relative z-10 bg-white overflow-hidden"
        >
          <div className="whitespace-nowrap z-20 group-hover:text-black group-hover:font-bold  transition-all duration-500 text-clamp-base group-hover:translate-y-0">
            <span className="inline">
              {stock !== 0 ? text : "indisponible"}
            </span>
          </div>
        </button>
      ) : (
        <AddRemoveItemCart product={product} stock={stock} inList={true} />
      )}
    </div>
  );
}
export function CommandButton({
  text,
  callBack,
}: {
  text: string;
  callBack?: () => void;
}) {
  const carts = usePanier((state) => state.panier);
  const toggleCart = usePanier((state) => state.toggleCart);

  const handleModalcartClose = () => {
    toggleCart(false);
    document.body.style.overflow = "auto";
  };
  const totalItems = carts.reduce((acc, item) => acc + item.nbr, 0);
  return (
    <div className="w-full group relative inline-block">
      <button
        onClick={() => {
          if (totalItems === 0) return handleModalcartClose();
          callBack?.();
        }}
        className="w-full border border-gray-300 px-2 py-1.5 cursor-pointer relative z-10 bg-black/60 overflow-hidden rounded-sm"
      >
        <span className="relative whitespace-nowrap z-20 group-hover:underline text-white transition-all duration-500 text-clamp-base -translate-y-1/2 group-hover:translate-y-0">
          <span className="inline">
            {totalItems === 0 ? "Ajouter un produit" : text}
          </span>
        </span>
        <div className="absolute top-0 left-0 w-full h-full bg-black z-10 transition-transform duration-500 transform translate-y-full group-hover:translate-y-0"></div>
      </button>
    </div>
  );
}

export function ButtonValidCart({
  features,
  // productId,
  product,
  onClick,
}: {
  features: Feature[];
  product: ProductClient;
  onClick: () => void;
  // productId: string;
}) {
  const pfeature = useproductFeatures((state) => state.productFeatures);

  const ProductWhoRequired = useMemo(() => {
    let val = features.find((f) => {
      const v = f.required;
      let validIsFIll = false;
      if (v) {
        validIsFIll = Boolean(pfeature.get(product?.id)?.get(f.name));
        return !validIsFIll;
      } else {
        return validIsFIll;
      }
    });
    return val;
  }, [pfeature, features]);
  return (
    <button
      disabled={!!ProductWhoRequired?.id}
      onClick={() => {
        if (ProductWhoRequired?.id) return;
        onClick?.();
      }}
      className={clsx(
        `mx-auto cursor-pointer text-center text-clamp-base uppercase text-cyan-50 w-[90%] py-2 px-4 mt-7`,
        {
          "bg-black/45": Boolean(ProductWhoRequired?.id),
          "bg-black": Boolean(!ProductWhoRequired?.id),
        }
      )}
    >
      {Boolean(ProductWhoRequired?.id)
        ? "selectionnez " + ProductWhoRequired?.name
        : "Ajouter au panier"}
    </button>
  );
}
