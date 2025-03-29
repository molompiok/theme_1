import React, { useMemo } from "react";
import type {  Feature, ProductClient } from "../pages/type";
import { useproductFeatures } from "../store/features";
import { formatPrice, getOptions } from "../utils";
import useCart from "../hook/query/useCart";

interface DisplayPriceProps {
  price: string | number;
  currency: string;
  barred_price?: string | number;
}

const safeParsePrice = (value: string | number | undefined | null): number => {
  if (value === undefined || value === null) return 0;
  const parsed = parseFloat(String(value));
  return isNaN(parsed) ? 0 : Math.max(0, parsed);
};

const PriceWrapper: React.FC<{
  children: React.ReactNode;
  label: string;
}> = ({ children, label }) => (
  <div
    role="region"
    aria-label={label}
    className="flex justify-start gap-2 items-center"
  >
    {children}
  </div>
);

export const DisplayPrice: React.FC<DisplayPriceProps> = React.memo(
  ({ price, currency, barred_price }) => {
    const displayPrice = safeParsePrice(price);
    const displayBarredPrice = safeParsePrice(barred_price);

    return (
      <PriceWrapper label={`Prix en ${currency}`}>
        <span
          className="whitespace-nowrap font-bold text-clamp-xs text-gray-900"
          aria-label={`Prix actuel: ${formatPrice(displayPrice , currency)}`}
        >
          {formatPrice(displayPrice , currency)}
        </span>
        {barred_price !== undefined && displayBarredPrice > 0 && (
          <span
            className="line-through font-light text-[0.8rem] text-black/80 whitespace-nowrap list-product-breakpoint-4:block"
            aria-label={`Prix original: ${formatPrice(
              displayBarredPrice , currency
            )}`}
          >
            {formatPrice(displayBarredPrice , currency)}
          </span>
        )}
      </PriceWrapper>
    );
  },
  (prev, next) =>
    prev.price === next.price &&
    prev.currency === next.currency &&
    prev.barred_price === next.barred_price
);

export const DisplayPriceDetail: React.FC<DisplayPriceProps> = React.memo(
  ({ price, currency, barred_price }) => {
    const { selections ,lastValueId ,lastSelectedFeatureId } =
      useproductFeatures();

    const getLatestPriceValue = () => {
      const lastFeatureType = Array.from(Object.keys(selections)).pop();
      if (!lastFeatureType) {
        return 0;
      }
      const priceValue = selections.get(lastFeatureType)?.get(lastValueId)?.priceValue;

      return priceValue || 0;
    };

    const totalPrice = useMemo(() => {
      const basePrice = safeParsePrice(price);
      const featurePrice = safeParsePrice(getLatestPriceValue() || 0);
      return basePrice + featurePrice;
    }, [price, selections]);

    const barredPrice = useMemo(() => {
      const basePrice = safeParsePrice(barred_price);
      const featurePrice = safeParsePrice(getLatestPriceValue());
      return basePrice + featurePrice;
    }, [price, selections, barred_price]);

    return (
      <PriceWrapper label={`Prix détaillé en ${currency}`}>
        <span
          className="whitespace-nowrap text-black font-medium"
          aria-label={`Prix total: ${formatPrice(totalPrice , currency)}`}
        >
          {formatPrice(totalPrice , currency)}
        </span>
        {barred_price !== undefined && barredPrice > 0 && (
          <span
            className="line-through font-light text-[0.8rem] text-black/80 whitespace-nowrap list-product-breakpoint-4:block"
            aria-label={`Prix original: ${formatPrice(
              barredPrice , currency
            )}`}
          >
            {formatPrice(barredPrice , currency)} 
          </span>
        )}
      </PriceWrapper>
    );
  },
  (prev, next) =>
    prev.price === next.price &&
    prev.currency === next.currency &&
    prev.barred_price === next.barred_price
);

interface DisplayPriceItemCartProps {
  product: ProductClient | null;
  bind: Record<string, string>;
  features : Feature[]
}

export const DisplayPriceItemCart: React.FC<DisplayPriceItemCartProps> =
  React.memo(
    ({ product, bind, features }) => {
      const { data: cart } = useCart();
      const itemInPanier = useMemo(
        () => cart?.cart?.items?.find((item) => item?.product?.id === product?.id),
        [cart, product]
      );

      const options = getOptions({ bind, features: features || [], product_id: product?.id || '' });

      const totalPrice = useMemo(() => {
        const basePrice = itemInPanier && itemInPanier.product
          ? itemInPanier.quantity * safeParsePrice(itemInPanier.product.price)
          : 0;
        return basePrice + safeParsePrice(options.additional_price);
      }, [itemInPanier, options.additional_price]);

      const currency = itemInPanier?.product.currency || "";

      return (
        <PriceWrapper label={`Prix du panier en ${currency}`}>
          {totalPrice > 0 ? (
            <span
              className="whitespace-nowrap font-light text-clamp-base text-green-900"
              aria-label={`Prix total du panier: ${formatPrice(
                totalPrice , currency
              )}`}
            >
              {formatPrice(totalPrice , currency)}
            </span>
          ) : (
            <span
              className="text-gray-600 text-xs italic"
              aria-label="Prix indisponible"
            >
              Prix non disponible
            </span>
          )}
        </PriceWrapper>
      );
    },
    (prev, next) =>
      prev.product?.id === next.product?.id
  );
