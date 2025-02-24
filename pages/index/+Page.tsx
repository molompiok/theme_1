import { useMemo, useState } from "react";
import { generateRandomProducts, ProductType } from "../../S1_data";
import { BsHandbag, BsHeart, BsX } from "react-icons/bs";
import clsx from "clsx";
import Modal from "../../component/Modal";
import { usePanier } from "../../store/cart";
import { CiSliderHorizontal } from "react-icons/ci";
import AddRemoveItemCart from "../../component/AddRemoveItemCart";
import { CartButton, CommandButton } from "../../component/AnimateButton";
import { navigate } from "vike/client/router";
import { DisplayPrice } from "../../component/DisplayPrice";
export { Page };

function Page() {
  const products = useMemo(() => generateRandomProducts(10), []);
  const showCart = usePanier((state) => state.showCart);
  const carts = usePanier((state) => state.panier);
  const toggleCart = usePanier((state) => state.toggleCart);
  const removeItem = usePanier((state) => state.remove);

  const totalItems = carts.reduce((acc, item) => acc + item.nbr, 0);
  const totalPrice = carts.reduce((acc, item) => acc + item.totalPrice, 0);

  const handleModalOpen = () => {
    toggleCart(true);
    document.body.style.overflow = "hidden";
  };

  const handleModalClose = () => {
    toggleCart(false);
    document.body.style.overflow = "auto";
  };
  return (
    <>
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
            <div className="grid list-product-breakpoint-3:grid-cols-3 list-product-breakpoint-6:grid-cols-2 grid-cols-1 gap-3">
              {products.map((product, index) => (
                <ProductCard
                  key={index}
                  product={product}
                  handleModalOpen={handleModalOpen}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Modal
        styleContainer="flex items-center select-none size-full justify-end"
        position="start"
        zIndex={100}
        setHide={handleModalClose}
        isOpen={showCart}
        animationName="translateRight"
      >
        <div className="font-primary relative bg-white min-h-dvh md:w-[550px] w-full px-2 pt-10">
          <div className="absolute top-8 right-8">
            <BsX
              size={50}
              className="cursor-pointer text-black"
              onClick={handleModalClose}
            />
          </div>
          <div className="flex flex-col gap-4 justify-center items-start">
            <div className="flex justify-center items-center gap-0.5 w-full">
              <BsHandbag size={20} className="text-black" />
              <span className="text-clamp-base whitespace-nowrap underline underline-offset-2  decoration-black/70">
                Mon panier
              </span>
              <span className="text-sm">( {totalItems} articles)</span>
            </div>
            <div className="flex flex-col gap-2 divide-y-2 divide-blue-100 max-h-[65vh] overflow-y-auto scroll-smooth scrollbar-thin">
              {carts.map((cart) => {
                return (
                  <div
                    key={cart.product.id}
                    className="flex items-center justify-between h-[150px] py-2 "
                  >
                    <div className="flex h-full">
                      <img src={cart.product.views[0]} className="size-32" />
                      <div className="flex items-stretch flex-col px-2">
                        <div className="flex flex-col h-full">
                          <h1 className="text-clamp-base font-bold">
                            {cart.product.name}
                          </h1>
                          <p className="text-clamp-xs font-light line-clamp-1 ">
                            {cart.product.description}
                          </p>
                        </div>
                        <AddRemoveItemCart product={cart.product} />
                      </div>
                    </div>
                    <div className="flex flex-col justify-between items-end h-full">
                      <button
                        onClick={() => {
                          removeItem(cart.product.id);
                        }}
                        className="px-2 cursor-pointer whitespace-nowrap text-clamp-xs underline text-gray-400"
                      >
                        supprimer
                      </button>
                      <DisplayPriceItemCart product={cart.product} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex w-full flex-col gap-3">
              <div className="flex justify-between w-full">
                <span className="font-bold">Sous-total</span>
                <span className="font-light">
                  {totalPrice} {carts[0]?.product?.currency}
                </span>
              </div>

              <div className="flex justify-between w-full">
                <span className="font-bold">Livraison</span>
                <span className="font-light">
                  0 {carts[0]?.product?.currency}
                </span>
              </div>
            </div>
            <CommandButton text="PROCEDER AU PAIEMENT" />
          </div>
        </div>
      </Modal>
    </>
  );
}

function DisplayPriceItemCart({ product }: { product: ProductType | null }) {
  const carts = usePanier((state) => state.panier);
  const itemInPanier = carts.find((item) => item.product.id === product?.id);
  return (
    <h1 className="px-2 whitespace-nowrap text-clamp-xs">
      {itemInPanier?.totalPrice} {product?.currency}
    </h1>
  );
}

function ProductCard({
  product,
  handleModalOpen,
}: {
  product: any;
  handleModalOpen: () => void;
}) {
  const [currentImg, setCurrentImg] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleGo = () => {
    navigate("/product");
  };

  return (
    <div
      onClick={handleGo}
      className="flex flex-col pb-2 items-stretch justify-baseline relative overflow-hidden px-2 border-b-white font-primary  aspect-[2/3]"
    >
      <BsHeart
        className={clsx(
          "absolute top-3 right-4 z-50 cursor-pointer text-2xl ",
          isLiked ? "text-orange-600" : "text-gray-600"
        )}
        onClick={() => setIsLiked(!isLiked)}
      />
      <img
        src={product.views[currentImg]}
        onMouseEnter={() => setCurrentImg(1)}
        onMouseLeave={() => setCurrentImg(0)}
        className="w-full aspect-square rounded-sm list-product-breakpoint-4:h-2/3 object-cover cursor-pointer hover:scale-95 transition-all duration-500 ease-in-out"
        alt={product.name}
      />
      <div className="w-full items-stretch flex-col flex">
        <div className="flex flex-col items-start max-w-[90%]">
          <h1 className="px-2 text-clamp-base font-bold whitespace-nowrap max-w-[95%] line-clamp-1">
            {product.name}
          </h1>
          {/* <h1 className="px-2 text-clamp-base font-light line-clamp-1 whitespace-nowrap max-w-[99%] ">
            {product.description}
          </h1> */}
        </div>
        <DisplayPrice product={product} />
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="w-full hidden items-center overflow-x-auto list-product-breakpoint-4:flex gap-3 px-3 scrollbar-thin my-0.5 snap-x snap-mandatory whitespace-nowrap"
        >
          {["XL", "XXL", "X", "L", "M", "W", "S"].map((size) => {
            return (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(size);
                }}
                key={size}
                className="border cursor-pointer text-clamp-xs flex justify-center items-center border-gray-300 max-w-[70px] px-3 min-h-[34px]"
              >
                {size}
              </button>
            );
          })}
        </div>
        <div className=" p-1 flex self-center w-full">
          <CartButton
            text="Ajouter au panier"
            textMobile="Ajouter"
            setIsModalOpen={handleModalOpen}
            product={product}
          />
        </div>
      </div>
    </div>
  );
}
