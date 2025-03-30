import { BsCartX, BsHandbag, BsTrash, BsX } from "react-icons/bs";
import { BASE_URL } from "../../api";
import {
  CartItem,
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
import { formatPrice, getFirstFeatureWithView, getOptions, isEmpty } from "../../utils";
import useCart from "../../hook/query/useCart";
import { useUpdateCart } from "../../hook/query/useUpdateCart";
import { useModalCart } from "../../store/cart";
import { useMemo } from "react";
import { features } from "process";
import { useMediaViews } from "../../hook/query/useMediaViews";



function ItemCart({ product, bind }: { product: ProductClient; bind: Record<string, string> }) {
  const isOpen = useModalCart((state) => state.showCart);

  const removeMutation = useUpdateCart();
  const selections = useproductFeatures((state) => state.selections);

  const { data: features, isPending } = useQuery({
    queryKey: ["get_features_with_values", product?.id],
    queryFn: () =>
      product?.id
        ? get_features_with_values({ product_id: product?.id })
        : Promise.resolve(null),
    enabled: !!product?.id && isOpen,
  });

  
  const lastSelectedFeatureId = useproductFeatures((state) => state.lastSelectedFeatureId);
  const lastValueId = useproductFeatures((state) => state.lastValueId);

  // const bind = useMemo(() => {

  //   const productSelections = selections?.get(product?.id);
  //   if (!productSelections) return {};
  //   const bind: Record<string, string> = {};
  //   productSelections.forEach((value, key) => {
  //     bind[key] = value.valueFeature;
  //   });
  //   return bind;

  // }, [selections, product?.id]);




  // const mediaViews = useMemo(() => {
  //   if (!features?.length) return ["/img/default_img.gif"];
  
  //   // const selectedViews = features?.find(f => f.id === lastSelectedFeatureId)?.values.find(v => v.id === lastValueId)?.views || [];
  //   // if (selectedViews.length > 0) {
  //   //   return selectedViews;
  //   // }
  
  //   const defaultFeature = getFirstFeatureWithView(features);
  //   const defaultViews = defaultFeature?.values[0]?.views || [];
  //   if (defaultViews.length > 0) {
  //     return defaultViews;
  //   }
  
  //   return ["/img/default_img.gif"];
  // }, [features]);


  const options = useMemo(() => getOptions({ bind, features: features || [], product_id: product.id }), [bind, features, product.id]);

  // console.log("🚀 ~ ItemCart ~ options:", options)

  const { isPendingFeatures , mediaViews } = useMediaViews({ bindNames : options.bindNames ,product_id :  product.id})

  if (isPending) {
    return <Loading />;
  }


  return (
    <div className="flex flex-col items-center p-2">
      <div className="flex gap-1 justify-center w-full">
        <ProductMedia
          mediaList={mediaViews}
          productName={product.name}
          className="aspect-square size-[80px] md:size-[100px]"
        />
        <div className="relative flex-1">
          <BsTrash
            className="text-lg absolute top-0 -right-4 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
            onClick={(e) => {
              e.stopPropagation();
              removeMutation.mutate({
                product_id: product.id,
                bind,
                mode: "clear",
              });
            }}
            size={20}
          />
          <h1 className="text-base md:text-lg mr-2.5 font-bold line-clamp-1">
            {product.name}
          </h1>
          <div className="flex flex-wrap items-center mb-1 gap-1">
            {Array.from(Object.entries(options?.bindNames || {})).map(([key, value], i) => (
                  <span
                    key={`${key}-${i}`}
                    className="text-[.68rem] rotating-border text-gray-100 border border-gray-300 px-2 py-0.5 rounded-[5px]"
                  >
                    {typeof value === 'string' ? value : value?.text || value?.key || 'N/A'}
                  </span>
                ))}
          </div>
          <p className="text-xs/4 md:text-sm/4 mb-2 font-light line-clamp-2">
            {product.description || "Aucune description"}
          </p>
        </div>
      </div>
      <div className="w-full flex justify-between gap-2">
        <AddRemoveItemCart
          product={product}
          bind={options.bind} 
          features={features ??  []}
          inList={false}
        />
        <DisplayPriceItemCart  product={product} bind={bind} features={features ??  []} />
      </div>
    </div>
  );
}

function ListItemCart({ cart }: { cart: CartItem[] }) {
  return (
    <div className="flex flex-col divide-y-2 divide-blue-100 max-h-[60vh] overflow-y-auto scroll-smooth scrollbar-thin pr-2">
      {cart?.map((item, i) => {
        let bind = item.realBind || item.bind;
        
        if (item.realBind && item.bind) { 
          //@ts-ignore
          bind = isEmpty(item.realBind) ? item.bind : item.realBind;
        }

        bind = typeof bind === 'string' ? JSON.parse(bind) : bind;

        bind = bind || {};

        return <ItemCart key={i} product={item.product} bind={bind} />;
      })}
    </div>
  );
}
export default function ModalCart() {
  const showCart = useModalCart((state) => state.showCart);
  const toggleCart = useModalCart((state) => state.toggleCart);
  const { data: cart } = useCart();

  const totalItems = cart?.cart?.items?.reduce((acc: number, item) => acc + item.quantity, 0) || 0;
  const totalPrice = cart?.total || 0;

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

          <ListItemCart cart={cart?.cart.items || []} />
          {cart?.cart?.items?.length === 0 ? (
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
                  {formatPrice(totalPrice , cart?.cart?.items?.[0]?.product?.currency)} 
                </span>
              </div>
              <span className="text-xs italic text-gray-600">
                Coût de livraison sera appliqué à la prochaine étape
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
