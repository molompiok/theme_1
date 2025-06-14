import React from "react";
import useCart from "../../hook/query/useCart";
import { formatPrice, getFirstFeatureWithView, getOptions, InfoOrderOwner } from "../../utils";
import { CartItem, ProductClient, ProductType } from "../../pages/type";
import { useQuery } from "@tanstack/react-query";
import { get_features_with_values } from "../../api/products.api";
import { group } from "console";
import { ProductMedia } from "../ProductMedia";
import { useOrderInCart } from "../../store/cart";
import { usePageContext } from "vike-react/usePageContext";

type ProductGroup = {
  name: string;
  image_url: string;
  price: number;
};

type OrderItem = {
  id: string;
  quantity: number;
  group_product: ProductGroup;
  features: Record<string, string>;
};

type Order = {
  items: OrderItem[];
  with_delivery: boolean;
  delivery_price: number;
};

// type OrderSummaryProps = {
//   order: Order;
//   calculateSubtotal: () => number;
// };

export const OrderSummary = () => {
  const { with_delivery } = useOrderInCart();
  const { api } = usePageContext();
  const { data: cart } = useCart(api);
  //@ts-ignore
  const totalPrice = cart?.total || 0;
  //@ts-ignore
  const totalItems = cart?.cart?.items?.reduce((acc: number, item) => acc + item.quantity, 0) || 0;

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 tracking-tight">
        Resume de la commande
      </h2>
      <div className="max-h-[60vh] overflow-y-auto">
        {/* @ts-ignore */}
        {cart?.cart?.items?.map((item, index) => (
          <ItemOrder key={index} item={item} />
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <p>Sous-total <span className="text-gray-400 text-xs">({totalItems} articles)</span></p>
            <p>{formatPrice(totalPrice)}</p>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <p>Livraison</p>
            <p>
              {formatPrice((with_delivery ? InfoOrderOwner.delivery_price : 0))}
            </p>
          </div>
          <div className="flex justify-between text-base font-semibold text-gray-900 mt-4 pt-4 border-t border-gray-200">
            <p>Total</p>
            <p>
              {formatPrice(totalPrice + (with_delivery ? InfoOrderOwner.delivery_price : 0))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function ItemOrder({ item }: { item: CartItem }) {
  const { api } = usePageContext();
  const { data: features, isPending } = useQuery({
    queryKey: ["get_features_with_values", item.product.id],
    queryFn: () =>
      item.product.id
        ? get_features_with_values({ product_id: item.product.id }, api)
        : Promise.resolve(null),
    enabled: !!item.product.id,
  });

  const [mediaList, setMediaList] = React.useState<string[]>([]);
  const options = getOptions({ bind: item.realBind, features: features || [], product_id: item.product.id });
  React.useEffect(() => {
    if (features && options.bindNames) {
      let found = false;
      features.forEach((f) => {
        const featureName = f.name;
        const matchingValue = f.values.find((v) => {
          const valueText = v.text;
          return Object.keys(options.bindNames).some((key) => {
            return key === featureName && options.bindNames[key] === valueText;
          });
        });
        if (matchingValue && matchingValue.views.length > 0) {
          setMediaList(matchingValue.views);
          found = true;
        }
      });

      if (!found) {
        setMediaList(getFirstFeatureWithView(features)?.values[0].views || []);
      }
    }
  }, [features, options.bindNames]);


  return (
    <div
      key={item.product.id}
      className="flex items-start py-4 border-b border-gray-100 last:border-b-0"
    >
      <div className="relative mr-4">
        <ProductMedia
          productName={item.product.name}
          mediaList={mediaList}
          className="w-16 h-16 object-cover rounded-md"
        />
        <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-gray-600 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
          {item.quantity}
        </span>
      </div>

      <div className="flex-1">
        <p className="text-gray-800 text-[.8rem] font-medium">
          {item.product.name}
        </p>
        <div className="flex flex-wrap gap-2 mt-1">
          {Object.entries(options.bindNames).map(([key, value]) => (
            <span
              key={key}
              className="text-xs bg-gray-100 p-1 rounded-3xl text-gray-600"
            >
              {typeof value === 'string' ? value : value?.text || value?.key || 'N/A'}
            </span>
          ))}
        </div>
      </div>
      <p className="text-gray-900 text-[.85rem] font-semibold">
        {formatPrice(
          item.quantity * (item.product.price + options?.additional_price || 0)
        )}
      </p>
    </div>
  );
}

export default OrderSummary;
