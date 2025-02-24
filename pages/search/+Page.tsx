import React, { useMemo, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { generateRandomProducts } from "../../S1_data";

export default function Page() {
  const products = useMemo(() => generateRandomProducts(10), []);
  return (
    <div className="relative bg-gray-100 min-h-dvh w-full">
      <div className="font-primary list-product-breakpoint-2:mx-64 list-product-breakpoint-4:mx-11 mx-3 pt-10 ">
        <h1 className="text-clamp-sm font-bold my-2">Recherche des produits</h1>

        <div className="flex gap-2 items-center  bg-gray-200 w-full py-3 pl-5 mb-10 rounded-xl sticky top-0 ">
          <BsSearch />
          <input
            className="w-full focus:border-none focus:outline-none"
            placeholder="Entrez le nom du produit"
          />
        </div>

        <div>
          <div className="grid list-product-breakpoint-2:grid-cols-3 list-product-breakpoint-5:grid-cols-2  grid-cols-1 gap-3">
            {products.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
function ProductCard({ product }: { product: any }) {
  const [currentImg, setCurrentImg] = useState(0);

  return (
      <div className="relative overflow-hidden border  border-b-white font-primary border-black/15 rounded-2xl pb-4">
        <img
          src={product.views[currentImg]}
          onMouseEnter={() => setCurrentImg(1)}
          onMouseLeave={() => setCurrentImg(0)}
          className="w-full aspect-square rounded-sm object-cover cursor-pointer hover:scale-95 transition-all duration-500 ease-in-out"
          alt={product.name}
        />
        <div className="w-full flex-col flex">
          <div className="max-w-[90%] py-1">
            <h1 className="px-2 text-clamp-base font-bold whitespace-nowrap line-clamp-1">
              {product.name}
            </h1>
            <h1 className="px-2 text-clamp-base font-light  line-clamp-1 whitespace-nowrap ">
              {product.description}
            </h1>
          </div>
          <div className="flex justify-start list-product-breakpoint-4:items-center items-start">
            <h1 className="px-2 whitespace-nowrap text-clamp-xs">
              {product.price} {product.currency}
            </h1>
            <div className="size-1.5 list-product-breakpoint-4:block hidden rounded-4xl bg-black/80" />
            <h1 className="px-2 line-through font-light text-gray-700 whitespace-nowrap text-clamp-xs">
              {product.barred_price} {product.currency}
            </h1>
          </div>
        </div>
      </div>
  );
}
