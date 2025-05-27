import { useMemo } from "react";
import { useproductFeatures, useProductSelectFeature } from "../store/features";
import clsx from "clsx";
import { useModalCart } from "../store/cart";
import { Feature, GroupProductType, ProductClient } from "../pages/type";
import { useQuery } from "@tanstack/react-query";
import { get_features_with_values } from "../api/products.api";
import AddRemoveItemCart from "./AddRemoveItemCart";
import Loading from "./Loading";
import { useUpdateCart } from "../hook/query/useUpdateCart";
import useCart from "../hook/query/useCart";
import { getFeatureValuePairs, getMinimumStock, getOptions, hasContinueSelling } from "../utils";
export function CartButton({
  text = "Ajouter au panier",
  product,
}: {
  text?: string;
  product: ProductClient | undefined;
}) {
  const setFeatureModal = useProductSelectFeature(
    (state) => state.setFeatureModal
  );
  const { data: cart } = useCart();
  const toggleCart = useModalCart((state) => state.toggleCart);
  const updateCartMutation = useUpdateCart();
  const product_id = product?.id;
  const {
    data: features,
    status: featuresStatus,
    error: featuresError,
  } = useQuery({
    queryKey: ["get_features_with_values", product_id],
    queryFn: () =>
      product_id ? get_features_with_values({ product_id }) : null,
    enabled: !!product_id,
  });



  // const featureValuePairs = useMemo(
  //   () => features ? getFeatureValuePairs(features) : {},
  //   [features]
  // );

  const requiresOptionSelection = useMemo(
    () => features?.some((feature) => feature.values.length >= 2) ?? false,
    [features]
  );
  
  const hasContinue = useMemo(
    () => (features ? hasContinueSelling({ features }) : false),
    [features]
  );
  const stock = useMemo(
    () => (features ? getMinimumStock({ features, ignoreStock: hasContinue }) : 0),
    [features, hasContinue]
  );

  const itemInCart = useMemo(() =>
    cart?.cart?.items?.find((item) => item?.product?.id === product_id),
    [cart, product_id]
  );
  const handleOpenFeatureModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    document.body.style.overflow = "hidden"; 
    setFeatureModal(true, product);
  };
  const handleDirectAddToCart = (e: React.MouseEvent) => {
    if (!product_id) return;
    e.stopPropagation();
    if (stock <= 0 && !hasContinue) return; 
    toggleCart(true); 
    document.body.style.overflow = "hidden"; 
    updateCartMutation.mutate({
      product_id: product_id,
      mode: "increment",
      value: 1,
      bind: {},
      ignoreStock: hasContinue,
    });
  };
  if (featuresStatus === "pending") {
    return (
      <div className="w-full font-secondary group relative mt-auto inline-block">
        <div className="flex justify-center items-center w-full border border-gray-300 py-1 px-2 rounded-xs bg-gray-100 min-h-[34px]">
          <Loading size="small" />  
        </div>
      </div>
    );
  }
  if (featuresStatus === "error") {
    console.error("Error fetching features:", featuresError);
    return (
      <div className="w-full font-secondary group relative mt-auto inline-block">
        <button
          disabled
          className="flex justify-center items-center w-full border py-1 border-gray-500 rounded-xs cursor-not-allowed relative z-10 bg-white overflow-hidden text-red-600 text-clamp-xs"
        >
          Erreur
        </button>
      </div>
    );
  }
  const buttonClasses = clsx(
    `flex justify-center items-center w-full border py-1 px-2
     border-gray-500 rounded-xs relative z-10
     bg-white overflow-hidden transition-colors duration-300`,
    {
      "cursor-pointer group-hover:bg-gray-100": stock > 0 || hasContinue,
      "cursor-not-allowed bg-gray-200 text-gray-500": stock === 0 && !hasContinue,
    }
  );
  const textClasses = `
    whitespace-nowrap z-20 group-hover:text-black
    transition-all duration-300
    text-clamp-base
  `;

  const isOutOfStock = stock === 0 && !hasContinue;
  
  return (
    <div className="w-full font-secondary group relative mt-auto overflow-hidden inline-block">
      {requiresOptionSelection ? (
        <button
          disabled={isOutOfStock}
          onClick={handleOpenFeatureModal}
          className={buttonClasses}
        >
          <div className={textClasses}>
            <span>{isOutOfStock ? "Indisponible" : "Choisir options"}</span>
          </div>
        </button>
      ) : (
        <>
          {itemInCart && itemInCart.quantity > 0 ? (
            <AddRemoveItemCart
              product={product}
              bind={itemInCart?.realBind || {}}
              features={features || []}
              // stock={stock}
              // hasContinueSelling={hasContinue} 
              inList 
            />
          ) : (
            <button
              disabled={isOutOfStock}
              onClick={handleDirectAddToCart}
              className={buttonClasses}
            >
              <div className={textClasses}>
                <span>{isOutOfStock ? "Indisponible" : text}</span>
              </div>
            </button>
          )}
        </>
      )}
    </div>
  );
}
export function CommandButton({
  text,
  callBack,
  disabled = false, 
}: {
  text: string;
  callBack?: () => void;
  disabled?: boolean;
}) {
  const toggleCart = useModalCart((state) => state.toggleCart);
  const { data: cart } = useCart();
  const totalItems = cart?.cart?.items?.reduce(
      (acc, item) => acc + item.quantity,
      0
    ) || 0;
  const isEmpty = totalItems === 0;
  const handleModalCartClose = () => {
    toggleCart(false);
    document.body.style.overflow = "auto"; 
  };
  const handleClick = () => {
    if (isEmpty) {
      handleModalCartClose();
      return;
    }
    if (callBack) {
      callBack();
    }
  };
  const buttonClasses = clsx(
    "w-full border border-gray-300 px-4 py-2.5 relative z-10 overflow-hidden rounded-sm transition-all duration-300",
    {
      "bg-black text-white cursor-pointer group": !isEmpty && !disabled,
      "bg-gray-400 text-gray-700 cursor-not-allowed": isEmpty || disabled,
    }
  );
  const textClasses = `
    relative whitespace-nowrap z-20 text-clamp-base transition-all duration-500
    ${!isEmpty && !disabled ? "group-hover:underline" : ""}
  `;
  const hoverEffectClasses = `
    absolute top-0 left-0 w-full h-full bg-gray-800 z-10
    transition-transform duration-500 transform translate-y-full group-hover:translate-y-0
    ${isEmpty || disabled ? "hidden" : ""}
  `;

  return (
    <div className="w-full group relative inline-block">
      <button
        onClick={handleClick}
        disabled={isEmpty || disabled}
        aria-disabled={isEmpty || disabled}
        className={buttonClasses}
      >
        <span className={textClasses}>
          {isEmpty ? "Panier vide" : text}
        </span>
        <div className={hoverEffectClasses}></div>
      </button>
    </div>
  );
}
interface ButtonValidCartProps {
  features?: Feature[];
  product: ProductClient | null;
}
function SingleValuedFeaturesButton({
  handleAddToCart,
  stock,
  hasContinue,
}: {
  handleAddToCart: () => void;
  stock: number;
  hasContinue: boolean;
}) {
  const isOutOfStock = stock <= 0 && !hasContinue;
  return (
    <button
      onClick={handleAddToCart}
      disabled={isOutOfStock}
      className={clsx(
        "mx-auto text-center text-clamp-base uppercase w-full py-3 px-4  min-h-[48px] transition-colors duration-300 rounded", 
        {
          "bg-black text-gray-50 cursor-pointer hover:bg-gray-800": !isOutOfStock,
          "bg-gray-400 text-gray-700 cursor-not-allowed": isOutOfStock,
        }
      )}
    >
      {isOutOfStock ? "Indisponible" : "Ajouter au panier"}
    </button>
  );
}
function MultiValuedFeaturesButton({
  missingRequiredFeature,
  handleAddToCart,
  matchingGroup,
  stock,
  hasContinue,
}: {
  missingRequiredFeature: Feature | undefined;
  handleAddToCart: () => void;
  matchingGroup: GroupProductType | undefined;
  stock: number;
  hasContinue: boolean;
}) {
  const isDisabled = !!missingRequiredFeature || !matchingGroup;
  const isOutOfStock = stock <= 0 && !hasContinue;
  let buttonText = "Ajouter au panier";
  if (missingRequiredFeature) {
    buttonText = `Sélectionnez ${missingRequiredFeature.name}`;
  } else if (!matchingGroup) {
    buttonText = "Variante indisponible";
  } else if (isOutOfStock) {
    buttonText = "Indisponible";
  }
  return (
    <button
      disabled={isDisabled || isOutOfStock}
      onClick={handleAddToCart}
      className={clsx(
        "mx-auto text-center text-clamp-base uppercase w-full py-3 px-4  min-h-[48px] transition-colors duration-300 rounded",
        {
          "bg-black text-gray-50 cursor-pointer hover:bg-gray-900": !isDisabled && !isOutOfStock,
          "bg-gray-400 text-gray-700 cursor-not-allowed": isDisabled || isOutOfStock,
        }
      )}
    >
      {buttonText}
    </button>
  );
}
export function ButtonValidCart({
  features = [],
  product,
}: ButtonValidCartProps) {
  if (!product) return null;
  const updateCartMutation = useUpdateCart();
  const toggleCart = useModalCart((st) => st.toggleCart);
  const setFeatureModal = useProductSelectFeature(
    (state) => state.setFeatureModal
  );
  const selections = useproductFeatures((state) => state.selections);
  const allFeaturesAreSingleValued = features.every(
    (feature) => feature.values.length <= 1
  );
  const bind = useMemo(() => {
    const productSelections = selections?.get(product.id);
    if (!productSelections) return {};
    const bind: Record<string, string> = {};
    productSelections.forEach((value, key) => {
      bind[key] = value.valueFeature;
    });
    return bind;
  }, [selections, product.id]);
  
  const matchingGroup = useMemo(() =>
    getOptions({ bind, features, product_id: product.id }),
    [bind, features, product.id]
  );
  const missingRequiredFeature = useMemo(() => {
    const productSelectionsMap = selections.get(product.id);
    return features?.find(
      (feature) => feature.required && !productSelectionsMap?.has(feature.id)
    );
  }, [features, selections, product.id]);
  const hasContinue = useMemo(() => hasContinueSelling({ features }), [features]);
  const stock = useMemo(() => {
    if (matchingGroup?.stock !== undefined && matchingGroup.stock !== null) {
      return matchingGroup.continue_selling ? Infinity : matchingGroup.stock;
    }
    return getMinimumStock({ features, ignoreStock: hasContinue });
  }, [matchingGroup, features, hasContinue]);

  const handleAddToCart = () => {
    if (missingRequiredFeature || (!allFeaturesAreSingleValued && !matchingGroup)) return;
    if (stock <= 0 && !hasContinue) return;
    setFeatureModal(false); 
    toggleCart(true); 
    document.body.style.overflow = "hidden";
    updateCartMutation.mutate({
      product_id: product.id,
      bind,
      mode: "increment",
      value: 1,
    });
  };
  return allFeaturesAreSingleValued ? (
    <SingleValuedFeaturesButton
      handleAddToCart={handleAddToCart}
      stock={stock}
      hasContinue={hasContinue}
    />
  ) : (
    <MultiValuedFeaturesButton
      missingRequiredFeature={missingRequiredFeature}
      handleAddToCart={handleAddToCart}
      matchingGroup={matchingGroup}
      stock={stock}
      hasContinue={hasContinue}
    />
  );
}