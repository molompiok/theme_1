import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { BiCheck } from "react-icons/bi";
import { BsCartCheck, BsClipboard } from "react-icons/bs";
import {
  MdCheck,
  MdLocalShipping,
  MdRateReview,
  MdStorefront,
  MdFilterList,
} from "react-icons/md";
import { get_orders } from "../../../api/cart.api";
import { get_comment } from "../../../api/comment.api";
import FilterPopover from "../../../component/FilterPopover";
import Loading from "../../../component/Loading";
import { ReviewModal } from "../../../component/modal/ReviewModal";
import ReviewProduct from "../../../component/modal/ReviewProduct";
import { ProductMedia } from "../../../component/ProductMedia";
import { useAuthRedirect } from "../../../hook/authRedirect";
import { useMediaViews } from "../../../hook/query/useMediaViews";
import { useClipboard } from "../../../hook/useClipboard";
import { useFiltersAndUrlSync } from "../../../hook/useUrlFilterManager";
import { usePageContext } from "../../../renderer/usePageContext";
import { useSelectedFiltersStore } from "../../../store/filter";
import { useModalCommentStore, useModalReview } from "../../../store/modal";
import { formatPrice, statusStyles } from "../../../utils";
import {
  defaultOptionsOrder,
  filterOptionsOrder,
  OrderByTypeOrder,
  UserOrder,
  UserOrderItem,
} from "../../type";

export default function OrdersPage() {
  useAuthRedirect();
  const pageContext = usePageContext();
  const { urlPathname } = pageContext;
  const { setSelectedFilters, selectedFilters, setFilter } =
    useSelectedFiltersStore();
  useFiltersAndUrlSync([], urlPathname, setSelectedFilters, selectedFilters);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 font-primary">
        {/* Header moderne avec effet glassmorphism */}
        <div
          className={`sticky inset-x-0 transition-all duration-500 ease-out z-50 ${
            isScrolled
              ? "backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-lg shadow-gray-200/20"
              : "bg-transparent"
          }`}
          style={{
            top: isScrolled ? "44px" : "0px",
          }}
        >
          <div className="container mx-auto px-4 pb-2 pt-7">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20"></div>
                    <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl">
                      <BsCartCheck className="text-xl sm:text-2xl text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                      Mes Commandes
                    </h1>
                    <p className="text-gray-600 text-sm mt-1">
                      Suivez et gérez vos commandes
                    </p>
                  </div>
                </div>
                <div className="relative ml-auto">
                  <FilterPopover
                    setFilter={setFilter}
                    selectedFilters={selectedFilters}
                    defaultOptions={[...defaultOptionsOrder]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="container mx-auto px-4 pb-12">
          <div className="max-w-6xl mx-auto">
            <WrapOrderList />
          </div>
        </div>
      </div>
      <ReviewModal />
      <ReviewProduct />
    </>
  );
}

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-xl shadow-gray-200/20">
    <div className="relative inline-block mb-6">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full blur opacity-20"></div>
      <div className="relative bg-gradient-to-r from-gray-300 to-gray-400 p-4 rounded-full">
        <BsCartCheck className="text-2xl text-white" />
      </div>
    </div>
    <p className="text-gray-600 text-xl font-medium">{message}</p>
    <p className="text-gray-500 text-sm mt-2">Vos futures commandes apparaîtront ici</p>
  </div>
);

const WrapOrderList = () => {
  const { selectedFilters } = useSelectedFiltersStore();
  const observerTarget = useRef<HTMLDivElement>(null);
  const filterNameToId = useMemo(() => {
    return filterOptionsOrder.reduce((acc, filter) => {
      acc[filter.name.toLowerCase()] = filter.id;
      return acc;
    }, {} as Record<string, string>);
  }, []);

  const orderText = selectedFilters?.order_by?.[0]?.text || "date_desc";
  const order =
    (filterNameToId[orderText.toLowerCase()] as OrderByTypeOrder) ||
    "date_desc";

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["get_orders_infinite", order],
      queryFn: ({ pageParam = 1 }) =>
        get_orders({ order_by: order, limit: 3, page: pageParam }),
      getNextPageParam: (lastPage) => {
        const currentPage = lastPage?.meta?.current_page;
        const lastPageNum = lastPage?.meta?.last_page;
        return currentPage && lastPageNum
          ? currentPage < lastPageNum
            ? currentPage + 1
            : undefined
          : undefined;
      },
      initialPageParam: 1,
    });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const allOrders = data?.pages.flatMap((page) => page?.list) || [];

  if (status === "pending") {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-20 animate-pulse"></div>
          <Loading size="large" color="bg-gradient-to-r from-blue-500 to-purple-600" className="relative" />
        </div>
      </div>
    );
  }

  if (status === "error") {
    return <EmptyState message="Une erreur est survenue lors du chargement" />;
  }

  return (
    <div className="space-y-8">
      {/* Grille des commandes avec animation */}
      <div className="space-y-6">
        {allOrders.map((order, index) => (
          <div
            key={order?.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <OrderList order={order} />
          </div>
        ))}
      </div>

      {!allOrders.length ? (
        <EmptyState message="Aucune commande pour le moment" />
      ) : (
        <div
          ref={observerTarget}
          className="py-8 flex justify-center min-h-[100px]"
        >
          {isFetchingNextPage ? (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-20 animate-pulse"></div>
              <Loading size="medium" className="relative" />
            </div>
          ) : hasNextPage ? (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-gray-200/50 shadow-lg">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                <span className="text-gray-600 font-medium">
                  Faites défiler pour charger plus...
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200 shadow-sm">
                <MdCheck className="text-green-600" />
                <span className="text-green-700 font-medium text-sm">
                  Toutes les commandes ont été chargées
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const OrderList = ({ order }: { order: UserOrder | undefined }) => {
  const { isCopied, copyToClipboard } = useClipboard();

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "delivered":
        return "Livrée";
      case "picked_up":
        return "Récupérée";
      case "returned":
        return "Retournée";
      case "canceled":
        return "Annulée";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
      case "picked_up":
        return <MdCheck className="w-4 h-4" />;
      case "pending":
        return <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (!order)
    return (
      <div className="text-center py-8 bg-red-50 rounded-3xl border border-red-200">
        <h1 className="text-red-600 font-semibold">Commande non trouvée</h1>
      </div>
    );

  return (
    <div className="group relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl overflow-hidden shadow-xl shadow-gray-200/20 hover:shadow-2xl hover:shadow-gray-300/25 transition-all duration-500 hover:-translate-y-1">
      {/* Gradient de fond subtil */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Header de la commande */}
      <div className="relative border-b border-gray-200/50 p-6 bg-gradient-to-r from-gray-50/50 to-transparent">
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div className="space-y-3">
            {/* Référence avec copie */}
            <div
              onClick={() => copyToClipboard(order.reference)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:border-gray-300/50 transition-all duration-300 cursor-pointer group/ref shadow-sm hover:shadow-md"
              title="Cliquez pour copier la référence"
            >
              <span className="text-sm font-mono text-gray-700 font-medium">
                #{order.reference}
              </span>
              <BsClipboard
                size={14}
                className="text-gray-500 group-hover/ref:text-gray-700 transition-colors"
              />
              {isCopied && (
                <span className="text-sm font-medium text-green-600 animate-fade-in flex items-center">
                  <BiCheck className="w-4 h-4" />
                </span>
              )}
            </div>

            {/* Date */}
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-900/90 backdrop-blur-sm text-white text-sm rounded-xl shadow-lg">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              Commandé le {formatDate(order.created_at)}
            </div>
          </div>

          {/* Statut modernisé */}
          <div className="self-start">
            <span
              className={clsx(
                "inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105",
                statusStyles[order.status]
              )}
            >
              {getStatusIcon(order.status)}
              {getStatusText(order.status)}
            </span>
          </div>
        </div>
      </div>

      {/* Items de la commande */}
      <div className="relative p-6">
        <div className="space-y-6">
          {order?.items?.map((item: any, index: number) => (
            <div
              key={item.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <OrderItemProduct item={item} order_id={order.id} />
            </div>
          ))}
        </div>
      </div>

      {/* Footer avec informations de livraison et total */}
      <div className="relative p-6 pt-0">
        <div className="bg-gradient-to-r from-gray-50/80 to-blue-50/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-200/50">
          <div className="flex flex-col lg:flex-row justify-between gap-4 lg:items-center">
            {/* Informations de livraison */}
            <div className="text-sm text-gray-700">
              {order.with_delivery ? (
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <MdLocalShipping className="text-blue-600" size={18} />
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Livraison</span>
                    <p className="text-gray-600 mt-0.5">
                      {order.delivery_address_name}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <MdStorefront className="text-green-600" size={18} />
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Retrait en magasin</span>
                    <p className="text-gray-600 mt-0.5">
                      {order.pickup_address_name}
                      {order.pickup_date && (
                        <span className="block">
                          Avant le {formatDate(order.pickup_date)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="text-right lg:text-left">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">
                  Total <span className="text-gray-400 text-xs">(livraison incluse)</span>
                </p>
                <p className="font-bold text-2xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {formatPrice(order.total_price + order.delivery_price)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderItemProduct = ({
  item,
  order_id,
}: {
  item: UserOrderItem;
  order_id: string;
}) => {
  const { mediaViews } = useMediaViews({
    bindNames: item.bind_name,
    product_id: item.product_id,
  });

  const setModalOpen = useModalCommentStore((state) => state.setModalOpen);
  const { setModalOpen: setReviewModalOpen } = useModalReview();

  const { data: comment, isLoading } = useQuery({
    queryKey: ["comment", { order_item_id: item.id }],
    queryFn: () => get_comment({ order_item_id: item.id }),
  });

  const canReview = !isLoading && true;
  const hasReviewed = !isLoading && !!comment;

  const handleOpenModal = () => {
    setModalOpen(true, {
      order_item_id: item.id,
      product_id: item.product_id,
      name: item.product?.name || "",
      user_id: item.user_id,
    });
  };

  return (
    <div className="group/item flex flex-col lg:flex-row justify-between items-start gap-6 p-4 rounded-2xl hover:bg-white/50 transition-all duration-300">
      <div className="flex gap-4 flex-1 min-w-0">
        {/* Image du produit avec effet hover */}
        <div className="relative group/image">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-purple-200 rounded-2xl blur opacity-0 group-hover/image:opacity-20 transition-all duration-300"></div>
          <ProductMedia
            mediaList={mediaViews}
            productName={item.product?.name}
            showFullscreen={true}
            className="relative size-[100px] sm:size-[120px] lg:size-[140px] object-cover rounded-2xl border-2 border-gray-200/50 flex-shrink-0 transition-all duration-300 group-hover/image:border-gray-300/70 group-hover/image:shadow-xl"
          />
        </div>

        {/* Informations du produit */}
        <div className="flex flex-col justify-between min-w-0 flex-1">
          <div>
            <h3 className="font-semibold text-gray-900 text-base lg:text-lg mb-2 group-hover/item:text-blue-600 transition-colors duration-300">
              {item.product?.name}
            </h3>

            {/* Variants/Options */}
            {item.bind_name && Object.entries(item.bind_name).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {Object.entries(item.bind_name).map(([_, value]) => (
                  <span
                    key={value.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border border-gray-200/50 shadow-sm"
                  >
                    {value.text}
                    {value.key && (
                      <span
                        className="w-3 h-3 rounded-full border border-white shadow-sm"
                        style={{ background: value.key }}
                        aria-label={`Color: ${value.text}`}
                      />
                    )}
                  </span>
                ))}
              </div>
            )}

            {/* Quantité */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm">
              <span className="text-sm text-gray-600">Quantité:</span>
              <span className="font-semibold text-gray-900">{item.quantity}</span>
            </div>
          </div>

          {/* Boutons d'action pour les avis */}
          <div className="mt-4">
            {canReview && !hasReviewed && (
              <button
                className="group/btn inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium text-sm transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
                onClick={handleOpenModal}
                aria-label="Laisser un avis"
              >
                <MdRateReview className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300" />
                Laisser un avis
              </button>
            )}

            {canReview && hasReviewed && (
              <button
                onClick={() => setReviewModalOpen(true, comment)}
                className="group/btn inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-medium text-sm transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
              >
                <MdCheck className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
                Avis publié
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Prix */}
      <div className="flex flex-col items-end lg:items-start mt-4 lg:mt-0 lg:ml-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-sm text-right lg:text-left">
          <p className="font-bold text-xl text-gray-900 mb-1">
            {formatPrice(item.quantity * item.price_unit)}
          </p>
          <p className="text-sm text-gray-600">
            {formatPrice(item.price_unit)} × {item.quantity}
          </p>
        </div>
      </div>
    </div>
  );
};