import { useQuery } from '@tanstack/react-query';
import { BsCartCheck, BsClipboard } from 'react-icons/bs';
import clsx from 'clsx';
import FilterPopover from '../../../component/FilterPopover';
import { get_orders } from '../../../api/cart.api';
import { useAuthRedirect } from '../../../hook/authRedirect';
import Loading from '../../../component/Loading';
import { useMemo } from 'react';
import { findFirstBindNameWithViews, formatPrice, getFirstFeatureWithView, getOptions, statusStyles } from '../../../utils';
import { get_features_with_values } from '../../../api/products.api';
import { ProductMedia } from '../../../component/ProductMedia';
import { UserOrder, UserOrderItem } from '../../type';
import { useMediaViews } from '../../../hook/query/useMediaViews';
import { useClipboard } from '../../../hook/useClipboard';
import { BiCheck } from 'react-icons/bi';



export default function OrdersPage() {
  useAuthRedirect();

  const { data: orders, isPending } = useQuery({
    queryKey: ['get_orders'],
    queryFn: get_orders,
  });



  if (isPending) {
    return (
      <Loading size="large" color="bg-neutral-500" className='mt-28' />
    );
  }



  const userOrders = orders || [];

  return (
    <div className="min-h-screen bg-white py-6 px-4 font-primary sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BsCartCheck className="text-3xl sm:text-4xl text-gray-900" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Mes Commandes
              </h1>
            </div>
            <FilterPopover />
          </div>
        </div>

        <div className="grid gap-6">
          {userOrders.map((order) => (
            <OrderList order={order} key={order.id} />
          ))}
        </div>

        {!userOrders.length && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <BsCartCheck className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">
              Aucune commande pour le moment
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Vos commandes apparaîtront ici une fois passées
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


const OrderList = ({ order }: { order: UserOrder }) => {
  const { isCopied, copyToClipboard } = useClipboard();
  return (
    <div
      className="relative mb-3  bg-white border border-gray-400 rounded-xl p-4 sm:p-6  transition-all duration-200"
    >
      <div className="border-b-2 border-gray-200 pb-4 mb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className='flex items-start flex-col'>
          <div title={'Copiez la reference'} onClick={() => copyToClipboard(order.reference)} className=" text-gray-900 cursor-pointer p-2">
              <span className='text-xs lowercase italic text-gray-800'>{order.reference}</span>
              <BsClipboard size={14} className="mx-1 inline-block" />
              {isCopied && (
                <span className="text-xs font-semibold text-green-600">
                  Copié
                  <BiCheck  className='text-sm inline-block'/>
                </span>
              )}
            </div>
            <p className="text-sm bg-black text-gray-200 px-2 rounded-sm">
              Passée le{' '}
              {new Date(order.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
      
          </div>
          <span
            className={clsx(
              'px-3 py-1 rounded-full text-sm font-medium',
              statusStyles[order.status]
            )}
          >
            {order.status === 'pending'
              ? 'En attente'
              : order.status === 'delivered'
                ? 'Livrée'
                : order.status === 'picked_up'
                  ? 'Récupérée'
                  : order.status === 'returned'
                    ? 'Retournée'
                    : order.status === 'canceled'
                      ? 'Annulée'
                      : order.status}
          </span>
        </div>
      </div>
      <div className="space-y-3 sm:space-y-4">
        {order.items.map((item: any) => (
          <OrderItemProduct key={item.id} item={item} />
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <p className="text-xs sm:text-sm italic text-gray-600">
          {order.with_delivery
            ? `Livraison: ${order.delivery_address_name}`
            : `Retrait: ${order.pickup_address_name} - avant le ${new Date(order.pickup_date ?? '').toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}`}
        </p>
        <div className="text-right">
          <p className="text-sm whitespace-nowrap text-gray-600">
            Total (livraison):{' '}
            <span className="font-semibold text-sm text-gray-900">
              {formatPrice(order.total_price + order.delivery_price)}
            </span>
          </p>
        </div>
      </div>

    </div>
  )
}


const OrderItemProduct = ({ item }: { item: UserOrderItem }) => {

  const { isPendingFeatures, mediaViews } = useMediaViews({ bindNames: item.bind_name, product_id: item.product_id })

  return (
    <div
      key={item.id}
      className="grid grid-cols-1 md:grid-cols-[120px_1fr_auto] gap-4"
    >
      {/* <div className="flex-shrink-0">
      <img
        src={
          item.product?.views?.[0] || '/placeholder-image.jpg'
        }
        alt={item.product?.name}
        className="w-24 h-24 object-cover rounded-lg border border-gray-100"
      />
    </div> */}
      <ProductMedia
        mediaList={mediaViews}
        productName={item.product?.name}
        className="size-[80px] md:size-[120px] object-cover rounded-lg border border-gray-100"
      />
      <div className="space-y-1">
        <h3 className=" text-sm sm:text-lg font-medium text-gray-900">
          {item.product?.name}
        </h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(item?.bind_name || {}).map(
            ([key, value]) => (
              <span
                key={value.id}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {value.text}
                {value.key && (
                  <span
                    className="size-4 ml-1 rounded-full inline-block"
                    style={{ background: value.key }}
                  />
                )}
              </span>
            )
          )}
        </div>
        <p className="text-sm text-gray-600">
          Quantité: {item.quantity}
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold text-gray-900">
          {formatPrice(item.quantity * item.price_unit)}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          {formatPrice(item.price_unit)} x {item.quantity}
        </p>
      </div>
    </div>
  )
}