import { useMemo, useState } from "react";
import { features, generateRandomProducts, ProductType } from "../../S1_data";
import { BsHandbag, BsHeart, BsX } from "react-icons/bs";
import clsx from "clsx";
import { usePanier } from "../../store/cart";
import { CiSliderHorizontal } from "react-icons/ci";
import { CartButton } from "../../component/Button";
import { navigate } from "vike/client/router";
import { DisplayPrice } from "../../component/DisplayPrice";
import { useProductSelectFeature } from "../../store/features";

export { Page };

function Page() {
  const products = useMemo(() => generateRandomProducts(10), []);

  return (
    <div>
      <div className="px-3 list-product-breakpoint-6:px-0 list-product-breakpoint-4:px-5 py-2 bg-gray-200 font-primary ">
        <div className="grid list-product-breakpoint-2:grid-cols-[350px_1fr] grid-cols-1 gap-4 list-product-breakpoint-5:mx-1.5 mx-0 list-product-breakpoint-1:mx-40 mt-14">
          <div className="border-2 border-amber-50 list-product-breakpoint-2:block hidden">
            <h1>Filtres</h1>
          </div>
          <div className="">
            <div className="justify-between my-4 list-product-breakpoint-2:hidden flex">
              <span className="">Filtres</span>
              <button
                onClick={() => {}}
                className="flex items-center border rounded-3xl gap-1.5 px-3"
              >
                <span className="">Filtres</span>
                <CiSliderHorizontal size={28} color="black" />
              </button>
            </div>
            <div className="grid list-product-breakpoint-3:grid-cols-3 list-product-breakpoint-6:grid-cols-2 grid-cols-1 list-product-breakpoint-3:gap-3 gap-x-2">
              {products.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: ProductType }) {
  const [currentImg, setCurrentImg] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleGo = () => {
    navigate("/product");
  };

  return (
    <div
      onClick={handleGo}
      className="flex flex-col border border-black/15 items-stretch pb-4 justify-baseline relative overflow-hidden font-primary"
    >
      <BsHeart
        className={clsx(
          "absolute top-3 right-4 z-50 cursor-pointer list-product-breakpoint-4:text-2xl text-lg ",
          isLiked
            ? "text-orange-600 font-extrabold"
            : "text-gray-600 font-light"
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
        onMouseEnter={() => setCurrentImg(1)}
        onMouseLeave={() => setCurrentImg(0)}
        className="w-full rounded-sm  object-cover aspect-square cursor-pointer hover:scale-95 transition-all duration-500 ease-in-out"
        alt={product.name}
        loading="lazy"
      />
      <div className="w-full items-stretch h-full justify-start gap-y-1 flex-col flex">
      <DisplayPrice product={product} />
        <div className="flex flex-col items-start pl-2 max-w-[92%]">
          <h1 className=" text-clamp-sm  whitespace-nowrap line-clamp-1">
            {product.name}
          </h1>
          <h1 className="text-clamp-sm font-light line-clamp-1 whitespace-nowrap max-w-[99%] ">
            {product.description}
          </h1>
        </div>
    
        <CartButton text="Ajouter au panier" product={product} />
      </div>
    </div>
  );
}
