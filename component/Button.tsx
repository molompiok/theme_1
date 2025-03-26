import { useMemo } from "react";
import { useproductFeatures, useProductSelectFeature } from "../store/features";
import clsx from "clsx";
import { useModalCart } from "../store/cart";
import { Feature, GroupProductType, ProductClient } from "../pages/type";
import { useQuery } from "@tanstack/react-query";
import {
  get_features_with_values,
  get_group_by_feature,
  // get_group_by_feature,
} from "../api/products.api";
import AddRemoveItemCart from "./AddRemoveItemCart";
import Loading from "./Loading";
import { useAuthStore } from "../store/user";
import { useUpdateCart } from "../hook/query/useUpdateCart";
import useCart from "../hook/query/useCart";
import { getAllCombinations } from "../utils";
export function CartButton({
  text,
  product,
}: {
  text: string;
  product: ProductClient;
}) {
  const setFeatureModal = useProductSelectFeature(
    (state) => state.setFeatureModal
  );
  const { carts } = useCart();
  const toggleCart = useModalCart((state) => state.toggleCart);

  const product_id = product?.id;
  const updateCartMutation = useUpdateCart();
  // const {
  //   data: group_products,
  //   isPending,
  //   isLoading,
  //   isError,
  // } = useQuery({
  //   queryKey: ["get_group_by_feature", { product_id }],
  //   queryFn: () => get_group_by_feature({ product_id }),
  //   enabled: !!product_id,
  // });
  const { data: features, status } = useQuery({
    queryKey: ["get_features_with_values", product_id],
    queryFn: () =>
      product_id ? get_features_with_values({ product_id }) : null,
    enabled: !!product_id,
  });

  if (!features) {
    return <div>⛔</div>;
  }

  const group_products = getAllCombinations({ features: features, product_id: product_id });


  const allFeaturesHaveAtMostOneValue = features.every(
    (feature) => feature.values.length > 1
  );

  const stock = group_products.reduce((sum, group) => sum + (group.stock || 0), 0);
  const itemInPanier = carts.find((item) => item.product.id === product_id);

  const handleFeatureModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    document.body.style.overflow = "hidden";
    setFeatureModal(true, product);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!allFeaturesHaveAtMostOneValue) {
      toggleCart(true);
      const groupProduct = group_products.find(
        (p) => p.id === product_id
      );
      if (groupProduct) {
        updateCartMutation.mutate({
          group_product_id: groupProduct.id,
          mode: "increment",
        });
      }
    } else {
      setFeatureModal(true, product);
    }
  };

  const buttonClasses = `
    flex justify-center items-center w-full border py-1 
    border-gray-500 rounded-xs cursor-pointer relative z-10 
    bg-white overflow-hidden
  `;

  const textClasses = `
    whitespace-nowrap z-20 group-hover:text-black 
    group-hover:font-bold transition-all duration-500 
    text-clamp-base group-hover:translate-y-0
  `;

  return (
    <div className="w-full font-secondary group relative mt-auto overflow-hidden inline-block">
      {allFeaturesHaveAtMostOneValue ? (
        <button
          disabled={status !== "success" || stock === 0}
          onClick={handleFeatureModalClick}
          className={buttonClasses}
        >
          <div className={textClasses}>
            <span className="inline">
              {stock !== 0 ? "Voir plus" : "Indisponible"}
            </span>
          </div>
        </button>
      ) : (
        <>
          {itemInPanier?.nbr === 0 || !itemInPanier ? (
            <button
              disabled={status !== "success" || stock === 0}
              onClick={handleAddToCartClick}
              className={buttonClasses}
            >
              <div className={textClasses}>
                <span className="inline">
                  {stock !== 0 ? text : "Indisponibles"}
                </span>
              </div>
            </button>
          ) : (
            <AddRemoveItemCart
              product={product}
              group_product={group_products[0]}
              inList
            />
          )}
        </>
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
  const toggleCart = useModalCart((state) => state.toggleCart);
  const { carts, isLoading } = useCart();
  const handleModalCartClose = () => {
    toggleCart(false);
    document.body.style.overflow = "auto";
  };

  const totalItems = carts.reduce((acc, item) => acc + item.nbr, 0);

  return (
    <div className="w-full group relative inline-block">
      <button
        onClick={() => {
          if (totalItems === 0) return handleModalCartClose();
          callBack?.();
        }}
        className="w-full border border-gray-300 px-2 py-2.5 cursor-pointer relative z-10 bg-black/60 overflow-hidden rounded-sm"
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

interface ButtonValidCartProps {
  features?: Feature[];
  product: ProductClient;
}

function SingleValuedFeaturesButton({
  group_products,
  handleAddToCart,
}: {
  group_products: GroupProductType[];
  handleAddToCart: (group: GroupProductType) => void;
}) {
  

  return (
    <button
      onClick={() => handleAddToCart(group_products[0])}
      className={clsx(
        "mx-auto cursor-pointer text-center text-clamp-base uppercase bg-black text-gray-50 w-full py-3 px-4 mt-7 min-h-[48px]"
      )}
    >
      Ajouter au panier
    </button>
  );
}

function MultiValuedFeaturesButton({
  productWhoRequired,
  matchingGroup,
  handleAddToCart,
}: {
  productWhoRequired: Feature | undefined;
  handleAddToCart: (group: GroupProductType) => void;
  matchingGroup: GroupProductType | undefined
}) {
  if (!matchingGroup) {
    return (
      <div className="min-h-[48px] mx-auto text-center text-clamp-base uppercase text-gray-50 w-full py-3 px-4 mt-1 bg-black/45">
        Sélectionnez une variante
      </div>
    );
  }
  return (
    <button
      disabled={!!productWhoRequired}
      onClick={() => handleAddToCart(matchingGroup)}
      className={clsx(
        "mx-auto cursor-pointer text-center text-clamp-base uppercase text-gray-50 w-full py-3 px-4 mt-7 min-h-[48px]",
        {
          "bg-black/45": !!productWhoRequired,
          "bg-black hover:bg-gray-900": !productWhoRequired,
        }
      )}
    >
      {productWhoRequired
        ? `Sélectionnez ${productWhoRequired.name}`
        : "Ajouter au panier"}
    </button>
  );
}

export function ButtonValidCart({
  features = [],
  product,
}: ButtonValidCartProps) {
  const allFeaturesAreSingleValued = features.every(
    (feature) => feature.values.length <= 1
  );
  const updateCartMutation = useUpdateCart();

  const toggleCart = useModalCart((st) => st.toggleCart);
  const setFeatureModal = useProductSelectFeature(
    (state) => state.setFeatureModal
  );

  const {
    data: group_products,
    isPending,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["get_group_by_feature", { product_id: product.id }],
    queryFn: () => get_group_by_feature({ product_id: product.id }),
    enabled: !!product.id,
  });

  const { selectedFeatures, groupProducts, lastGroupProductId } =
    useproductFeatures();

  const matchingGroup = useMemo(() => {
    const groups = groupProducts.get(lastGroupProductId) || [];
    return groups.find((gp) =>
      Array.from(selectedFeatures.entries()).every(
        ([key, val]) => !gp.bind[key] || gp.bind[key] === val
      )
    );
  }, [groupProducts, lastGroupProductId, selectedFeatures]);

  const productWhoRequired = useMemo(() => {
    return features?.find((feature) => {
      if (feature.required) {
        return !selectedFeatures.has(feature.name);
      }
      return false;
    });
  }, [selectedFeatures, features]);

  const handleAddToCart = (group: GroupProductType) => {
    toggleCart(true);
    document.body.style.overflow = "hidden";
    setFeatureModal(false);
    updateCartMutation.mutate({
      group_product_id: group.id,
      mode: "increment",
    });
  };

  if (isLoading || isPending) {
    return <Loading />;
  }

  if (!group_products || isError) {
    return <div>⛔</div>;
  }

  return allFeaturesAreSingleValued ? (
    <SingleValuedFeaturesButton
      group_products={group_products}
      handleAddToCart={handleAddToCart}
    />
  ) : (
    <MultiValuedFeaturesButton
      productWhoRequired={productWhoRequired}
      handleAddToCart={handleAddToCart}
      matchingGroup={matchingGroup}
    />
  );
}
