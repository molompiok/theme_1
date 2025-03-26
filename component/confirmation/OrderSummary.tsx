import React from "react";
import useCart from "../../hook/query/useCart";
import { formatPrice, getFirstFeatureWithView } from "../../utils";
import { GroupProductCart, ProductType } from "../../pages/type";
import { useQuery } from "@tanstack/react-query";
import { get_features_with_values } from "../../api/products.api";
import { group } from "console";
import { ProductMedia } from "../ProductMedia";

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
  const { carts } = useCart();
  const totalItems = carts.reduce((acc, item) => acc + item.nbr, 0);
  console.log("🚀 ~ OrderSummary ~ carts:", carts);
  const totalPrice = carts.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 tracking-tight">
        Resume de la commande
      </h2>
      <div className="max-h-[60vh] overflow-y-auto">
        {carts.map((item, index) => (
          <ItemOrder item={item} key={index} />
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <p>Sous-total <span className="text-gray-400 text-xs">({totalItems} articles)</span></p> 
            <p>CFA {formatPrice(totalPrice)}</p>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <p>Livraison</p>
            <p>
              CFA{" "}
              {/* {(order.with_delivery ? order.delivery_price : 0).toLocaleString()} */}
            </p>
          </div>
          <div className="flex justify-between text-lg font-semibold text-gray-900 mt-4 pt-4 border-t border-gray-200">
            <p>Total</p>
            <p>
              {formatPrice(totalPrice)}
              CFA{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function ItemOrder({
  item,
}: {
  item: {
    product: ProductType;
    group_product: GroupProductCart;
    nbr: number;
    totalPrice: number;
  };
}) {
  const { data: feature, isPending } = useQuery({
    queryKey: ["get_features_with_values", item.product.default_feature_id],
    queryFn: () =>
      item.product.default_feature_id
        ? get_features_with_values({
            feature_id: item.product.default_feature_id,
          })
        : Promise.resolve(null),
    enabled: !!item.product.default_feature_id,
  });

  const [mediaList, setMediaList] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (feature && item.group_product.bind) {
      let found = false;
      feature.forEach((f) => {
        const featureName = f.name;
        const matchingValue = f.values.find((v) => {
          const valueText = v.text;
          return Object.keys(item.group_product.bind).some((key) => {
            return key === featureName && item.group_product.bind[key] === valueText;
          });
        });
        if (matchingValue && matchingValue.views.length > 0) {
          setMediaList(matchingValue.views);
          found = true;
        }
      });

      if (!found) {
        setMediaList(getFirstFeatureWithView(feature)?.values[0].views || []);
      }
    }
  }, [feature, item.group_product.bind]);
  return (
    <div
      key={item.group_product.id}
      className="flex items-start py-4 border-b border-gray-100 last:border-b-0"
    >
      <div className="relative mr-4">
        <ProductMedia
          productName={item.product.name}
          mediaList={mediaList}
          className="w-16 h-16 object-cover rounded-md"
        />
        <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-gray-600 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
          {item.nbr}
        </span>
      </div>

      <div className="flex-1">
        <p className="text-gray-800 text-[.8rem] font-medium">
          {item.group_product.product.name}
        </p>
        <div className="flex gap-2 mt-1">
          {Object.entries(item.group_product.bind).map(([key, value]) => (
            <span
              key={key}
              className="text-xs bg-gray-100 p-1 rounded-3xl text-gray-600"
            >
              {value}
            </span>
          ))}
        </div>
      </div>
      <p className="text-gray-900 text-[.85rem] font-semibold">
        {formatPrice(
          item.nbr * (item.product.price + item.group_product.additional_price)
        )}{" "}
        CFA
      </p>
    </div>
  );
}

export default OrderSummary;
