import { BsCartX, BsHandbag, BsTrash, BsX, BsArrowRight, BsHeart, BsPlus, BsDash } from "react-icons/bs";
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
import { useThemeSettingsStore } from "../../store/themeSettingsStore";
import FavoriteButton from "../FavoriteButton";

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
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const filterSideTextColor = useThemeSettingsStore((state) => state.filterSideTextColor);
  const filterSideBackgroundColor = useThemeSettingsStore((state) => state.filterSideBackgroundColor);
  
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

  const handleDelete = () => {
    removeMutation.mutate({
      product_id: product.id,
      bind,
      mode: "clear",
    });
    setShowConfirmDelete(false);
  };

  if (isPending) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div
      className="group relative p-4 rounded-xl transition-all duration-300 hover:shadow-lg border border-transparent hover:border-gray-200 bg-gradient-to-r from-white to-gray-50"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        backgroundColor: `${filterSideBackgroundColor}dd`,
        color: filterSideTextColor,
      }}
    >
      {product?.barred_price && product.price && (
        <div className="absolute top-2 left-5 z-10">
          <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>{(((product.barred_price - product.price) / product.barred_price) * 100).toFixed(0)}%</span>
          </div>
        </div>
      )}

      <div className="flex items-start gap-4 w-full">
        {/* Image produit avec effet de zoom */}
        <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-md group-hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
          <ProductMedia
            mediaList={mediaViews}
            productName={product.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
          {/* Bouton favori */}
          {/* <button className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110">
            <BsHeart size={12} className="text-red-500" />
          </button> */}

          <FavoriteButton product_id={product.id} className="absolute top-2 right-2 p-1.5 text-gray-400" size={14} />
        </div>

        {/* Contenu principal */}
        <div className="flex flex-col justify-between flex-grow min-h-[96px]">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h1 className="text-base md:text-lg font-bold line-clamp-2 pr-2 group-hover:text-blue-600 transition-colors duration-300">
                {product.name}
              </h1>
              
              {/* Bouton de suppression amélioré */}
              <div className="relative">
                <button
                  className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                    isHovering 
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg" 
                      : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowConfirmDelete(true);
                  }}
                  aria-label="Supprimer du panier"
                >
                  <BsTrash size={14} />
                </button>

                {/* Confirmation de suppression */}
                {showConfirmDelete && (
                  <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border p-3 z-50 w-48">
                    <p className="text-sm text-gray-700 mb-3">Supprimer cet article ?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleDelete}
                        className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                      >
                        Oui
                      </button>
                      <button
                        onClick={() => setShowConfirmDelete(false)}
                        className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors"
                      >
                        Non
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tags avec design amélioré */}
            <div className="flex flex-wrap gap-1">
              <BindTags
                tags={(options?.bindNames as Record<string, ProductFeature>) || {}}
              />
            </div>

            {/* Description tronquée avec style moderne */}
            <div className="text-sm text-gray-600 leading-relaxed">
              <MarkdownViewer
                markdown={
                  product.description
                    .substring(0, 80)
                    .trim()
                    .split("\n")
                    .slice(0, 3)
                    .join("\n") || ""
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section prix et quantité avec design moderne */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200/50">
        <div className="flex items-center">
          <AddRemoveItemCart
            product={product}
            bind={options.bind}
            features={features ?? []}
            inList={false}
          />
        </div>
        
        <div className="text-right">
          <DisplayPriceItemCart
            product={product}
            bind={bind}
            features={features ?? []}
          />
        </div>
      </div>

      {/* Barre de progression pour la livraison gratuite */}
      {/* <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="text-xs text-gray-500 mb-1">Ajoutez 25€ pour la livraison gratuite</div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full" style={{width: '60%'}}></div>
        </div>
      </div> */}
    </div>
  );
}

function ListItemCart({ cart }: { cart: CartItem[] }) {
  const toggleCart = useModalCart((state) => state.toggleCart);
  const filterSideTextColor = useThemeSettingsStore((state) => state.filterSideTextColor);

  if (!cart || cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <div className="relative mb-6">
          <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <BsCartX size={60} className="text-gray-400" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-bounce">
            <BsPlus size={24} className="text-white" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800 mb-3" style={{color: filterSideTextColor}}>
          Votre panier est vide
        </h3>
        <p className="text-gray-500 text-center mb-8 max-w-sm leading-relaxed" style={{color: filterSideTextColor}}>
          Découvrez nos produits exceptionnels et ajoutez vos favoris à votre panier
        </p>
        
        <button
          onClick={() => toggleCart(false)}
          className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 transform"
        >
          <span className="relative z-10 flex items-center gap-3">
            Découvrir nos produits
            <BsArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3 overflow-y-auto scroll-smooth px-2">
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
  const filterSideTextColor = useThemeSettingsStore((state) => state.filterSideTextColor);
  const filterSideBackgroundColor = useThemeSettingsStore((state) => state.filterSideBackgroundColor);
  const { data: cart, isLoading, isPending } = useCart();

  const totalItems = cart?.cart?.items?.reduce((acc: number, item) => acc + item.quantity, 0) || 0;
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
      <div 
        className="font-primary relative flex flex-col h-dvh w-full sm:w-[420px] md:w-[480px] lg:w-[520px] backdrop-blur-xl"
        style={{
          background: `linear-gradient(145deg, ${filterSideBackgroundColor}f0, ${filterSideBackgroundColor}dd)`,
          color: filterSideTextColor,
        }}
      >
        {/* En-tête moderne avec effet glassmorphism */}
        <div className="relative p-6 border-b border-white/10 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
          <div className="relative flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BsHandbag size={20} className="text-white" />
                </div>
                {totalItems > 0 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-white text-xs font-bold">{totalItems}</span>
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold">Mon Panier</h2>
                <p className="text-sm opacity-70">{totalItems} article{totalItems > 1 ? 's' : ''}</p>
              </div>
            </div>
            
            <button
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110 transform"
              onClick={handleModalCartClose}
              aria-label="Fermer le panier"
            >
              <BsX size={24} className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* Contenu principal */}
        {isPending || isLoading ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-gray-500">Chargement de votre panier...</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto py-4">
            <ListItemCart cart={cart?.cart?.items || []} />
          </div>
        )}

        {/* Footer avec résumé et actions */}
        {hasItems && (
          <div 
            className="border-t border-white/10 p-6 backdrop-blur-sm"
            style={{
              background: `linear-gradient(135deg, ${filterSideBackgroundColor}f0, ${filterSideBackgroundColor}dd)`,
            }}
          >
            {/* Résumé des prix avec design moderne */}
            <div className="space-y-4 mb-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-semibold">
                    {formatPrice(totalPrice, cart?.cart?.items?.[0]?.product?.currency)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Livraison</span>
                  <span className="text-gray-500 text-xs font-light">calculé à l'étape suivante</span>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-green-600">
                      {formatPrice(totalPrice, cart?.cart?.items?.[0]?.product?.currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Boutons d'action avec design moderne */}
            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                className="group relative w-full py-4 px-6 rounded-xl font-bold text-white overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] transform"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Procéder au paiement
                  <BsArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={18} />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <button
                onClick={handleModalCartClose}
                className="w-full py-3 px-6 rounded-xl font-medium transition-all duration-300 hover:bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/30"
                style={{color: filterSideTextColor}}
              >
                Continuer mes achats
              </button>
            </div>

            {/* Badges de confiance */}
            <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                Paiement sécurisé
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                Livraison rapide
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}