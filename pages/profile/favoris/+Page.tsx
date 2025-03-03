import React, { useMemo, useState } from "react";
import { BsHeartFill } from "react-icons/bs";
import clsx from "clsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../component/Popover";
import { DisplayPrice } from "../../../component/DisplayPrice";

export default function Page() {
  return (
    <div className="bg-gray-200 px-3 font-primary">
      <div className="relative w-full min-h-dvh pt-10 max-w-[1200px] mx-auto ">
        <div className="flex gap-2 items-center font-light">
          <BsHeartFill className="text-4xl text-red-500/60" />
          <h1 className="text-3xl font-semibold">Mes favoris</h1>
        </div>
        <div className="flex justify-end mb-5 border-b border-b-black/70">
          <Popover>
            <PopoverTrigger
              asChild
              className=" gap-2 justify-center items-center bg-white sm:flex hidden "
            >
              <button className="flex gap-1 mb-5 ">
                <span className="font-light">Filtrez par</span>
                <span className="cursor-pointer">Plus recents</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="z-20">
              <div className="bg-white shadow-2xl  flex flex-col gap-y-3 px-6 rounded-2xl py-2">
                {[
                  "plus recent",
                  "plus ancien",
                  "mieux mote",
                  "Prix eleve",
                  "Prix bas",
                ].map((sort, index) => {
                  return (
                    <div
                      className="text-lg capitalize underline-animation cursor-pointer"
                      key={index}
                    >
                      {sort}
                    </div>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="grid place-content-center list-product-breakpoint-2:grid-cols-4 list-product-breakpoint-4:grid-cols-3  grid-cols-2 gap-3 ">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: ProductType }) {
  const [currentImg, setCurrentImg] = useState(0);
  const [isLiked, setIsLiked] = useState(true);
  return (
    <div className="relative overflow-hidden border  border-b-white font-primary border-black/15 rounded-2xl pb-4">
      <BsHeartFill
        className={clsx(
          "absolute top-3 right-4 z-10 cursor-pointer list-product-breakpoint-4:text-2xl text-lg ",
          isLiked
            ? "text-orange-600 font-extrabold"
            : "text-gray-400 font-light"
        )}
        onClick={(e) => {
          e.stopPropagation();
          setIsLiked(!isLiked);
        }}
      />
      <img
        src={
          features.find((f) => f.id === product.default_feature_id)?.values[0]
            .views[currentImg]
        }
        onMouseEnter={() => {
          setCurrentImg(1);
        }}
        onMouseLeave={() => setCurrentImg(0)}
        className="w-full aspect-square rounded-sm object-cover cursor-pointer hover:scale-95 transition-all duration-500 ease-in-out"
        alt={product.name}
      />
      <div className="w-full flex-col flex">
        <div className="max-w-full py-1">
        <DisplayPrice product={product} />
          <h1 className="px-2 text-clamp-base font-bold whitespace-nowrap line-clamp-1">
            {product.name}
          </h1>
          <h1 className="px-2 text-clamp-base font-light line-clamp-0 whitespace-nowrap ">
            {product.description}
          </h1>
        </div>
  
      </div>
    </div>
  );
}
