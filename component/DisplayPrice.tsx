import React from 'react'
import { ProductType } from '../S1_data'

export  function DisplayPrice({product } : {product: ProductType}) {
  return (
    <div className="flex justify-start list-product-breakpoint-4:items-center items-start list-product-breakpoint-4:flex-row flex-col">
    <h1 className="px-2 whitespace-nowrap text-clamp-xs text-green-500">
      {product.price} {product.currency}
    </h1>
    <div className="size-1 list-product-breakpoint-4:block hidden rounded-4xl bg-black/80" />
    <h1 className="px-2 line-through text-clamp-xs whitespace-nowrap ">
      {product.barred_price} {product.currency}
    </h1>
  </div>
  )
}
export  function DisplayPriceDetail({product } : {product: ProductType}) {
    return (
      <div className="flex justify-start gap-2  items-center flex-row">
      <h1 className="whitespace-nowrap text-black">
        {product.price} {product.currency}
      </h1>
      <div className="size-1 block rounded-4xl bg-black/70" />
      <h1 className="line-through  whitespace-nowrap text-black/70">
        {product.barred_price} {product.currency}
      </h1>
    </div>
    )
  }
