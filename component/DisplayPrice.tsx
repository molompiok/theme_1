import React, { useMemo } from "react";
import type { Feature, ProductClient } from "../pages/type";
import { useproductFeatures } from "../store/features";
import {
  deepEqual,
  formatPrice,
  getOptions,
  isEmpty,
  safeParsePrice,
} from "../utils";
import useCart from "../hook/query/useCart";
import clsx from "clsx";
import { useThemeSettingsStore } from "../store/themeSettingsStore";

interface DisplayPriceProps {
  price: string | number;
  currency: string;
  barred_price?: string | number;
  product_id: string;
  className?: string;
}

const PriceWrapper: React.FC<{
  children: React.ReactNode;
  label: string;
  className?: string;
}> = ({ children, label, className }) => (
  <div
    role="region"
    aria-label={label}
    className={clsx("flex justify-start gap-2 items-center", className)}
  >
    {children}
  </div>
);

export const DisplayPrice: React.FC<DisplayPriceProps> = React.memo(
  ({ price, currency, barred_price, product_id, className }) => {
    const displayPrice = safeParsePrice(price);
    const displayBarredPrice = safeParsePrice(barred_price);
    const { setSettings, resetSettings, ...settings } = useThemeSettingsStore();
    const { selections } = useproductFeatures();
    function getTotalPriceValue() {
      const productSelections = selections.get(product_id);
      if (!productSelections) return 0;

      let total = 0;
      for (const variant of productSelections.values()) {
        total += variant.priceValue;
      }

      return total;
    }

    return (
      <PriceWrapper label={`Prix en ${currency}`} className={className}>
        <span
          className="whitespace-nowrap font-bold text-[0.85rem]"
          aria-label={`Prix actuel: ${formatPrice(displayPrice, currency)}`}
          style={{
            color: settings?.productPriceColor,
          }}
        >
          {formatPrice(displayPrice + getTotalPriceValue(), currency)}
        </span>

        {barred_price !== undefined && settings?.reductionDisplay === "barred-price" && (
          <span
            className="line-through font-light text-[0.8rem] whitespace-nowrap list-product-breakpoint-4:block"
            aria-label={`Prix original: ${formatPrice(
              displayBarredPrice + getTotalPriceValue(),
              currency
            )}`}
            style={{
              color: settings?.productPriceColor + "cc",
            }}
          >
            {formatPrice(displayBarredPrice + getTotalPriceValue(), currency)}
          </span>
        )}
        {barred_price !== undefined && settings?.reductionDisplay === "percent-reduction" &&
          displayBarredPrice > displayPrice && (
            <span
              className="text-sm whitespace-nowrap"
              aria-label={`Réduction de ${Math.round(
                ((displayBarredPrice - displayPrice) / displayBarredPrice) * 100
              )}%`}
              style={{
                color: settings?.productPriceColor,
              }}
            >
              -
              {Math.round(
                ((displayBarredPrice - displayPrice) / displayBarredPrice) * 100
              )}
              %
            </span>
          )}
      </PriceWrapper>
    );
  },
  (prev, next) =>
    prev.price === next.price &&
    prev.currency === next.currency &&
    prev.barred_price === next.barred_price &&
    prev.product_id === next.product_id
);

export const DisplayPriceDetail: React.FC<DisplayPriceProps> = React.memo(
  ({ price, currency, barred_price, product_id, className }) => {
    const { selections } = useproductFeatures();

    function getTotalPriceValue() {
      const productSelections = selections.get(product_id);
      if (!productSelections) return 0;

      let total = 0;
      for (const variant of productSelections.values()) {
        total += variant.priceValue;
      }

      return total;
    }

    const { setSettings, resetSettings, ...settings } = useThemeSettingsStore();
    const totalPrice = useMemo(() => {
      const basePrice = safeParsePrice(price);
      const featurePrice = safeParsePrice(getTotalPriceValue() || 0);
      return basePrice + featurePrice;
    }, [price, selections]);

    const barredPrice = useMemo(() => {
      const basePrice = safeParsePrice(barred_price);
      const featurePrice = safeParsePrice(getTotalPriceValue());
      return basePrice + featurePrice;
    }, [price, selections, barred_price]);

    return (
      <PriceWrapper
        label={`Prix détaillé en ${currency}`}
        className={className}
      >
        <span
          className="whitespace-nowrap text-lg font-bold"
          aria-label={`Prix total: ${formatPrice(totalPrice, currency)}`}
          style={{
            color: settings?.productPriceColor,
          }}
        >
          {formatPrice(totalPrice, currency)}
        </span>
        {barred_price !== undefined && settings?.reductionDisplay === "barred-price" && (
          <span
            className="line-through font-light text-[0.8rem] whitespace-nowrap list-product-breakpoint-4:block"
            aria-label={`Prix original: ${formatPrice(
              barredPrice,
              currency
            )}`}
            style={{
              color: settings?.productPriceColor + "cc",
            }}
          >
            {formatPrice(barredPrice, currency)}
          </span>
        )}
        {barred_price !== undefined && settings?.reductionDisplay === "percent-reduction" &&
          barredPrice > totalPrice && (
            <span
              className="text-sm whitespace-nowrap"
              aria-label={`Réduction de ${Math.round(
                ((barredPrice - totalPrice) / barredPrice) * 100
              )}%`}
              style={{
                color: settings?.productPriceColor,
              }}
            >
              -
              {Math.round(
                ((barredPrice - totalPrice) / barredPrice) * 100
              )}
              %
            </span>
          )}
      </PriceWrapper>
    );
  },
  (prev, next) =>
    prev.price === next.price &&
    prev.currency === next.currency &&
    prev.barred_price === next.barred_price &&
    prev.product_id === next.product_id
);

interface DisplayPriceItemCartProps {
  product: ProductClient | null;
  bind: Record<string, string>;
  features: Feature[];
}

export const DisplayPriceItemCart: React.FC<DisplayPriceItemCartProps> =
  React.memo(
    ({ product, bind, features }) => {
      const { data: cart } = useCart();
      const { setSettings, resetSettings, ...settings } =
        useThemeSettingsStore();
      const itemInPanier = useMemo(
        () =>
          cart?.cart?.items.find((item) => {
            let bindT = item.realBind || item.bind;

            if (item.realBind || item.bind) {
              //@ts-ignore
              bindT = isEmpty(item.realBind) ? item.bind : item.realBind;
            }

            bindT = typeof bindT === "string" ? JSON.parse(bindT) : bindT;

            bindT = bindT || {};
            const isEqual = deepEqual(bind, bindT);

            return isEqual && product?.id == item?.product?.id;
          }),
        [cart?.cart?.items, bind]
      );

      const options = getOptions({
        bind,
        features: features || [],
        product_id: product?.id || "",
      });

      const totalPrice = useMemo(() => {
        if (!itemInPanier || !itemInPanier.product) return 0;

        const basePrice =
          Number(itemInPanier.quantity) *
          (Number(itemInPanier.product.price) +
            Number(options.additional_price));

        return basePrice;
      }, [itemInPanier, options.additional_price]);

      const currency = itemInPanier?.product?.currency || "";

      return (
        <PriceWrapper label={`Prix du panier en ${currency}`}>
          {totalPrice > 0 ? (
            <span
              className="whitespace-nowrap font-light text-lg"
              aria-label={`Prix total du panier: ${formatPrice(
                totalPrice,
                currency
              )}`}
              style={{
                color: settings?.productPriceColor,
              }}
            >
              {formatPrice(totalPrice, currency)}
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
    (prev, next) => prev.product?.id === next.product?.id
  );
