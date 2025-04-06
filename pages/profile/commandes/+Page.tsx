import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { BsCartCheck, BsClipboard } from 'react-icons/bs';
import clsx from 'clsx';
import FilterPopover from '../../../component/FilterPopover';
import { get_orders } from '../../../api/cart.api';
import { useAuthRedirect } from '../../../hook/authRedirect';
import Loading from '../../../component/Loading';
import { useEffect, useMemo, useRef, useState } from 'react';
import { filterNameToId, findFirstBindNameWithViews, formatPrice, getFirstFeatureWithView, getOptions, statusStyles } from '../../../utils';
import { get_features_with_values } from '../../../api/products.api';
import { ProductMedia } from '../../../component/ProductMedia';
import { defaultOptions, defaultOptionsOrder, filterOptions, filterOptionsOrder, OrderByType, OrderByTypeOrder, UserOrder, UserOrderItem } from '../../type';
import { useMediaViews } from '../../../hook/query/useMediaViews';
import { useClipboard } from '../../../hook/useClipboard';
import { BiCheck } from 'react-icons/bi';
import { usePageContext } from '../../../renderer/usePageContext';
import { useFiltersAndUrlSync } from '../../../hook/useUrlFilterManager';
import { useSelectedFiltersStore } from '../../../store/filter';
import { MdCheck, MdLocalShipping, MdOutlineRateReview, MdRateReview, MdStorefront } from 'react-icons/md';
import Modal from '../../../component/modal/Modal';
import { useModalCommentStore, useModalReview } from '../../../store/modal';
import ReviewsStars from '../../../component/comment/ReviewsStars';
import { ReviewModal } from '../../../component/modal/ReviewModal';
import { get_comment } from '../../../api/comment.api';
import ReviewProduct from '../../../component/modal/ReviewProduct';

export default function OrdersPage() {
  useAuthRedirect();
  const pageContext = usePageContext();
  const { urlPathname } = pageContext;
  const { setSelectedFilters, selectedFilters, setFilter } = useSelectedFiltersStore();
  useFiltersAndUrlSync([], urlPathname, setSelectedFilters, selectedFilters);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>

      <div className="container min-h-dvh bg-white py-6 px-4 font-primary ">
        <div
          className={`sticky inset-x-0 bg-white border-gray-200 transition-all w-full duration-300 py-5 ${isScrolled ? 'border-b mt-0 top-11 sm:top-14 z-40' : 'top-0 mt-7 z-40'
            }`}
          style={{
            paddingLeft: isScrolled ? '1rem' : '0',
            paddingRight: isScrolled ? '1rem' : '0',
          }}
        >
          <div className="max-w-5xl mx-auto ">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <BsCartCheck className="text-3xl sm:text-4xl text-gray-900" />
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Mes Commandes
                </h1>
              </div>
              <FilterPopover
                setFilter={setFilter}
                selectedFilters={selectedFilters}
                defaultOptions={[...defaultOptionsOrder]}
              />
            </div>
          </div>
        </div>
        <div className="h-6"></div>
        <div className="max-w-5xl mx-auto">
          <WrapOrderList />
        </div>
      </div>
      <ReviewModal
      />
      <ReviewProduct />
    </>
  );
}

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
    <BsCartCheck className="mx-auto text-4xl text-gray-400 mb-4" />
    <p className="text-gray-600 text-lg">{message}</p>
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

  const orderText = selectedFilters?.order_by?.[0]?.text || 'date_desc';
  const order = (filterNameToId[orderText.toLowerCase()] as OrderByTypeOrder) || 'date_desc';

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ['get_orders_infinite', order],
    queryFn: ({ pageParam = 1 }) => get_orders({ order_by: order, limit: 3, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.meta.current_page;
      const lastPageNum = lastPage.meta.last_page;
      return currentPage < lastPageNum ? currentPage + 1 : undefined;
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
      { threshold: 0.1, rootMargin: '100px' }
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

  const allOrders = data?.pages.flatMap(page => page.list) || [];

  if (status === 'pending') {
    return <Loading size="large" color="bg-neutral-500" className="mt-28" />;
  }

  if (status === 'error') {
    return <EmptyState message="Une erreur est survenue" />;
  }

  return (
    <div>
      <div className="grid gap-6">
        {allOrders.map((order) => (
          <OrderList order={order} key={order.id} />
        ))}
      </div>

      {!allOrders.length ? (
        <EmptyState message="Aucune commande pour le moment" />
      ) : (
        <div ref={observerTarget} className="py-4 flex justify-center min-h-[50px]">
          {isFetchingNextPage ? (
            <Loading size="medium" className="my-16" />
          ) : hasNextPage ? (
            <span className="text-gray-500">Faites défiler pour charger plus...</span>
          ) : (
            <p className="text-gray-500 text-sm">Toutes les commandes ont été chargées</p>
          )}
        </div>
      )}
    </div>
  );
};


const OrderList = ({ order }: { order: UserOrder }) => {
  const { isCopied, copyToClipboard } = useClipboard();

  // Fonction pour obtenir le texte du statut en français
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'delivered': return 'Livrée';
      case 'picked_up': return 'Récupérée';
      case 'returned': return 'Retournée';
      case 'canceled': return 'Annulée';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="relative mb-4 bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
      <div className="border-b border-gray-200 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <div className="space-y-2">
            <div
              onClick={() => copyToClipboard(order.reference)}
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded hover:bg-gray-100 transition-colors cursor-pointer group"
              title="Cliquez pour copier la référence"
            >
              <span className="text-xs font-mono text-gray-700">{order.reference}</span>
              <BsClipboard size={14} className="text-gray-500 group-hover:text-gray-700" />
              {isCopied && (
                <span className="text-xs font-medium text-green-600 animate-fadeIn flex items-center">
                  Copié
                  <BiCheck className="ml-0.5" />
                </span>
              )}
            </div>

            <div className="inline-flex items-center px-2.5 py-1 bg-gray-800 text-gray-100 text-xs rounded">
              Passée le {formatDate(order.created_at)}
            </div>
          </div>

          <span
            className={clsx(
              'self-start px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap',
              statusStyles[order.status]
            )}
          >
            {getStatusText(order.status)}
          </span>
        </div>
      </div>

      <div className="px-4 sm:px-5">
        <div className="divide-y divide-gray-100">
          {order.items.map((item: any) => (
            <OrderItemProduct key={item.id} item={item} order_id={order.id} />
          ))}
        </div>
      </div>

      <div className="mt-3 p-4 sm:p-5 pt-3 sm:pt-4 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:items-center">
          <div className="text-xs sm:text-sm text-gray-600">
            {order.with_delivery ? (
              <div className="flex items-center">
                <MdLocalShipping className="mr-1.5 text-gray-500" size={16} />
                <span>Livraison : <span className="font-medium">{order.delivery_address_name}</span></span>
              </div>
            ) : (
              <div className="flex items-center">
                <MdStorefront className="mr-1.5 text-gray-500" size={16} />
                <span>
                  Retrait : <span className="font-medium">{order.pickup_address_name}</span>
                  {order.pickup_date && (
                    <> - avant le <span className="font-medium">{formatDate(order.pickup_date)}</span></>
                  )}
                </span>
              </div>
            )}
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-600">
              Total (livraison incluse)
            </p>
            <p className="font-semibold text-base text-gray-900">
              {formatPrice(order.total_price + order.delivery_price)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
const OrderItemProduct = ({ item , order_id }: { item: UserOrderItem , order_id: string }) => {

  const { isPendingFeatures, mediaViews } = useMediaViews({
    bindNames: item.bind_name,
    product_id: item.product_id
  });
  
  const setModalOpen = useModalCommentStore(state => state.setModalOpen);

  const {  setModalOpen: setReviewModalOpen } = useModalReview();
  
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
      name: item.product?.name || '',
    });
  };

  return (
    <div
      key={item.id}
      className="flex flex-col sm:flex-row justify-between items-start gap-4 py-4 border-b border-gray-100 last:border-0"
    >
      <div className="flex space-x-3 flex-1 min-w-0">
        <ProductMedia
          mediaList={mediaViews}
          productName={item.product?.name}
          showFullscreen={true}
          // showNavigation={true}
          className="size-[80px] sm:size-[100px] md:size-[120px] object-cover rounded-lg border border-gray-200 flex-shrink-0 transition-all duration-200"
        />
        
        <div className="flex flex-col min-w-0">
          <h3 className="font-medium text-gray-900 text-sm sm:text-base md:text-lg truncate">
            {item.product?.name}
          </h3>
          
          {item.bind_name && Object.entries(item.bind_name).length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {Object.entries(item.bind_name).map(
                ([_, value]) => (
                  <span
                    key={value.id}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {value.text}
                    {value.key && (
                      <span
                        className="size-3 ml-1 rounded-full inline-block"
                        style={{ background: value.key }}
                        aria-label={`Color: ${value.text}`}
                      />
                    )}
                  </span>
                )
              )}
            </div>
          )}
          
          <p className="text-sm text-gray-600 mt-2">
            Quantité: <span className="font-medium">{item.quantity}</span>
          </p>
          
          {canReview && !hasReviewed && (
            <button
              className="mt-3 inline-flex cursor-pointer bg-gray-200 py-1 px-2 hover:bg-gray-100 rounded-md items-center text-xs md:text-sm text-gray-600 hover:text-gray-500 transition-colors font-medium"
              onClick={handleOpenModal}
              aria-label="Laisser un avis"
            >
              <MdRateReview className="mr-1 text-gray-600" size={16} />
              Laisser un avis
            </button>
          )}
          
          {canReview && hasReviewed && (
            <div onClick={() => setReviewModalOpen(true, comment)} className="mt-3 inline-flex items-center text-xs md:text-sm text-green-600">
              <MdCheck className="mr-1 text-green-600" size={16} />
              Avis publié - affichez
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col items-end ml-auto sm:ml-0 mt-2 sm:mt-0">
        <p className="text-sm md:text-base font-semibold text-gray-900">
          {formatPrice(item.quantity * item.price_unit)}
        </p>
        <p className="text-xs md:text-sm text-gray-600 mt-1">
          {formatPrice(item.price_unit)} × {item.quantity}
        </p>
      </div>
    </div>
  );
};