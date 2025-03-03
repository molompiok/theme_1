import React from "react";
import type { ProductClient } from "../pages/type";

export function DisplayPrice({ product }: { product: ProductClient }) {
  return (
    <div className="pl-2 flex justify-start list-product-breakpoint-4:items-center gap-1  items-start list-product-breakpoint-4:flex-row ">
      <h1 className=" whitespace-nowrap font-bold text-clamp-base text-red-500">
        {product.price} {product.currency}
      </h1>
      {product.barred_price && <h1 className="line-through font-light text-clamp-xs text-black/80  whitespace-nowrap list-product-breakpoint-4:block">
        {product.barred_price} <span className="lowercase">{product.currency}</span>
      </h1>}
    </div>
  );
}
export function DisplayPriceDetail({ product }: { product: ProductClient }) {
  return (
    <div className="flex  justify-start gap-2  items-center flex-row">
      <h1 className="whitespace-nowrap text-black ">
        {product.price} {product.currency}
      </h1>
      <div className="size-1 block rounded-4xl bg-black/70" />
      <h1 className="line-through   whitespace-nowrap text-black/70">
        {product.barred_price} <span className="lowercase">{product.currency}</span>
      </h1>
    </div>
  );
}
