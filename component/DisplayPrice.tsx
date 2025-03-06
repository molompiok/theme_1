import type { ProductClient } from "../pages/type";
import { usePanier } from "../store/cart";

const formatPrice = (price?: string | number): string => {
  if (!price) return "0";
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export function DisplayPrice({ price ,   currency , barred_price}: { price: string | number; currency: string; barred_price?: string | number }) {
  return (
    <div className="pl-2 flex justify-start list-product-breakpoint-4:items-center gap-1  items-start list-product-breakpoint-4:flex-row ">
      <h1 className=" whitespace-nowrap font-bold text-clamp-base text-red-500">
        {formatPrice(price)} {currency}
      </h1>
      {barred_price && <h1 className="line-through font-light text-clamp-xs text-black/80  whitespace-nowrap list-product-breakpoint-4:block">
        {formatPrice(barred_price)} <span className="">{currency}</span>
      </h1>}
    </div>
  );
}

export function DisplayPriceDetail({ price ,   currency , barred_price}: { price: string | number; currency: string; barred_price?: string | number }) {
  return (
    <div className="flex  justify-start gap-2  items-center flex-row">
      <h1 className="whitespace-nowrap text-black ">
        {formatPrice(price)} {currency}
      </h1>
      <div className="size-1 block rounded-4xl bg-black/70" />
      <h1 className="line-through   whitespace-nowrap text-black/70">
        {formatPrice(barred_price)} <span className="">{currency}</span>
      </h1>
    </div>
  );
}


export function DisplayPriceItemCart({ product }: { product: ProductClient | null }) {
  const carts = usePanier((state) => state.panier);
  const itemInPanier = carts.find((item) => item.product.id === product?.id);
  return (
    <h1 className=" whitespace-nowrap font-light text-clamp-base text-green-900">
      {formatPrice(itemInPanier ? itemInPanier.nbr * itemInPanier.product.price : 0)} {itemInPanier?.product.currency || ''}
    </h1>
  );
}