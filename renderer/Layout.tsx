export { Layout };

import React, { useEffect, useState } from "react";
import logoUrl from "./logo.svg";
import { PageContextProvider, usePageContext } from "./usePageContext";
import type { PageContext } from "vike/types";

import Modal from "../component/Modal";
import { LinkIcon } from "../component/LinkIcon";
import { Link } from "../component/Link";

import {
  BsCaretDown,
  BsChevronDown,
  BsHandbag,
  BsHouse,
  BsJournal,
  BsList,
  BsPerson,
  BsSearch,
  BsTypeH1,
  BsX,
} from "react-icons/bs";
import { usePanier } from "../store/cart";
import { CiMenuBurger, CiSearch, CiShoppingCart } from "react-icons/ci";
import { navigate } from "vike/client/router";
import AddRemoveItemCart from "../component/AddRemoveItemCart";
import { DisplayPriceItemCart } from "../component/FeatureDetailProduct/DisplayPriceItemCart";
import { ButtonValidCart, CommandButton } from "../component/Button";
import { useProductSelectFeature } from "../store/features";
import { DisplayPriceDetail } from "../component/DisplayPrice";
import TextComponent from "../component/FeatureDetailProduct/TextComponent";
import ColorComponent from "../component/FeatureDetailProduct/ColorComponent";
import { HiOutlineBackward } from "react-icons/hi2";
import { BiArrowBack, BiArrowToBottom, BiUser, BiX } from "react-icons/bi";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverHeading,
  PopoverTrigger,
} from "../component/Popover";
import { SlUser } from "react-icons/sl";
import { FaUser } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import { PiXThin } from "react-icons/pi";
function Layout({
  children,
  pageContext,
}: {
  children: React.ReactNode;
  pageContext: PageContext;
}) {
  const toggleCart = usePanier((state) => state.toggleCart);
  const showCart = usePanier((state) => state.showCart);
  const carts = usePanier((state) => state.panier);
  const addItems = usePanier((state) => state.add);
  const removeItem = usePanier((state) => state.remove);
  const totalItems = carts.reduce((acc, item) => acc + item.nbr, 0);
  const totalPrice = carts.reduce((acc, item) => acc + item.totalPrice, 0);

  console.log(carts);

  const handleModalcartClose = () => {
    toggleCart(false);
    document.body.style.overflow = "auto";
  };
  const handleModalcartOpen = () => {
    toggleCart(true);
    document.body.style.overflow = "hidden";
  };

  /****************** */
  const Product = useProductSelectFeature((state) => state.productSelected);
  const features = useProductSelectFeature((state) => state.features);
  const isVisibleFeatureModal = useProductSelectFeature(
    (state) => state.isVisible
  );
  const showModalFeature = useProductSelectFeature(
    (state) => state.setFeatureModal
  );

  const handleModalFeature = () => {
    showModalFeature(false);
    document.body.style.overflow = "auto";
  };
  /****************************************** */

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set to true when the component is mounted on the client
  }, []);

  if (!isClient) {
    return (
      <div className="flex h-dvh w-dvw justify-center items-center animate-pulse">
        <button className="flex items-center gap-1.5 transition-all duration-300">
          <img src={logoUrl} className="size-28 object-contain" alt="logo" />
          <h1 className="hidden xs:block text-sm sm:text-base md:text-lg lg:text-2xl text-black font-primary transition-all duration-300">
            Marque
          </h1>
        </button>
      </div>
    ); // Render something generic on the server
  }
  return (
    <>
      <PageContextProvider pageContext={pageContext}>
        <Frame>
          <Header>
            <Category categories={["Hommes", "Femmes", "Enfant"]} />
            <Logo />
            <nav className="flex items-center gap-5">
              <BsSearch
                size={24}
                className="cursor-pointer"
                onClick={() => {
                  navigate("/search");
                }}
              />
              <BsHandbag
                size={24}
                className="cursor-pointer"
                onClick={() => {
                  toggleCart(true);
                  document.body.style.overflow = "hidden";
                }}
              />
              <div className="lg:flex lg:gap-5 lg:justify-center  hidden">
                <LinkIcon href="/">Welcome</LinkIcon>
                <LinkIcon href="/profile/commandes">Mon compte</LinkIcon>
              </div>
            </nav>
          </Header>
          {children}

          {/* Modal cart */}
          <Modal
            styleContainer="flex items-center select-none size-full justify-end"
            position="start"
            zIndex={100}
            setHide={handleModalcartClose}
            isOpen={showCart}
            animationName="translateRight"
          >
            <div className="font-primary relative bg-white min-h-dvh md:w-[550px] w-full px-2 pt-10">
              <div className="absolute top-8 right-8">
                <BsX
                  size={50}
                  className="cursor-pointer text-black"
                  onClick={handleModalcartClose}
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
                          <img
                            src={
                              features?.find(
                                (f) => f.id === cart.product.default_feature_id
                              )?.values[0].views[0]
                            }
                            className="size-32"
                          />
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

          {/***Modal feature */}
          <Modal
            styleContainer="flex items-center select-none size-full justify-center"
            position="start"
            zIndex={100}
            setHide={handleModalFeature}
            isOpen={isVisibleFeatureModal}
            animationName="zoom"
          >
            <div className="font-primary relative bg-white rounded-3xl max-h-[60dvh] md:w-[550px] overflow-auto w-full px-2 py-10">
              <div className="absolute top-8 right-8">
                <BsX
                  size={50}
                  className="cursor-pointer text-black"
                  onClick={handleModalFeature}
                />
              </div>
              {Product?.id ? (
                <div className="flex size-full flex-col justify-between items-start img-pdetail-breakpoint-2:pr-0 px-5">
                  <div className="img-pdetail-breakpoint-2:block hidden">
                    <h1 className="text-clamp-md pt-4 font-bold">
                      {Product.name}
                    </h1>
                    <h1 className="text-clamp-xs mb-2">
                      {Product.description}
                    </h1>
                    <DisplayPriceDetail product={Product} />
                  </div>
                  <div className="mt-6 flex flex-col gap-2 img-pdetail-breakpoint-2:p-0 pl-9 max-h-[60dvh] overflow-auto">
                    {features.map((feature, index) => {
                      return (
                        <div key={index}>
                          <div className="flex items-center justify-start overflow-x-auto gap-1 scrollbar-thin my-0">
                            {feature.type === "Color" && (
                              <ColorComponent
                                feature={feature}
                                productId={Product.id}
                              />
                            )}
                            {feature.type === "Text" && (
                              <TextComponent
                                feature={feature}
                                productId={Product.id}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <ButtonValidCart
                    features={features}
                    product={Product}
                    onClick={() => {
                      handleModalFeature();
                      handleModalcartOpen();
                      addItems(Product);
                    }}
                  />
                  <button
                    onClick={handleModalFeature}
                    className="text-clamp-base cursor-pointer font-light self-center text-center my-2 underline underline-offset-2"
                  >
                    Continuer vos achats
                  </button>
                </div>
              ) : (
                <h1 className="size-full flex justify-center items-center text-clamp-md">
                  Produit non disponible
                </h1>
              )}
            </div>
          </Modal>
        </Frame>
      </PageContextProvider>
    </>
  );
}

function Category({ categories }: { categories: string[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const shouldShowModal = categories.length > 2;

  return (
    <>
      <ul className="gap-5 flex-wrap hidden lg:flex">
        {categories
          .slice(0, shouldShowModal ? 2 : categories.length)
          .map((category) => (
            <li key={category}>
              <Link href={`/category/${category}`}>{category}</Link>
            </li>
          ))}
        {shouldShowModal && (
          <li className="hidden lg:block">
            <button
              onClick={handleModalOpen}
              className="text-blue-500 underline"
            >
              <BsChevronDown strokeLinecap="round" size={24} color="black" />
            </button>
          </li>
        )}
      </ul>
      <CiMenuBurger
        className="flex lg:hidden cursor-pointer"
        size={35}
        color="black"
        onClick={handleModalOpen}
      />
      <Modal
        styleContainer="flex items-center select-none size-full justify-start"
        position="start"
        zIndex={100}
        setHide={handleModalClose}
        isOpen={isModalOpen}
        animationName="translateLeft"
      >
        <div className="relative bg-white min-h-dvh w-sm pl-8 pr-28 pt-10">
          <div className="absolute top-8 left-2">
            <PiXThin
              size={50}
              className="cursor-pointer text-black"
              onClick={handleModalClose}
            />
          </div>
          <div className="flex flex-col gap-4 justify-center mt-16 items-start">
            <Logo />
            <Link href="/">Welcome</Link>
            <Link href="/profile">Mon compte</Link>
          </div>

          <div className="flex flex-col justify-center items-start mt-16 ">
            <h1 className="text-clamp-md decoration-2 underline underline-offset-2">
              Catalogue
            </h1>
            <ul className="flex flex-col gap-y-2">
              {categories.map((category) => (
                <li key={category} className="text-clamp-sm">
                  <Link href={`/category/${category}`}>{category}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>
    </>
  );
}
function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-full w-full scrollbar-thin">{children}</div>
  );
}

function Header({ children }: { children: React.ReactNode }) {
  const { urlPathname } = usePageContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };
  console.log({ urlPathname });
  return (
    <>
      {!urlPathname.startsWith("/profile") ? (
        <>
          <button
            onClick={() => {
              navigate("/icons");
            }}
            className="relative w-full top-0  z-40 bg-black text-white flex justify-center items-center"
          >
            <span className="text-clamp-base font-medium text-white py-2 font-primary">
              Livraison gratuite en Côte d'Ivoire
            </span>
          </button>
          <header className="sticky inset-x-0 top-0 w-full font-primary z-90 px-5 bg-slate-50 flex items-center justify-between py-2 shadow-xl border-b border-slate-100">
            {children}
          </header>
        </>
      ) : (
        <>
          <header className="sticky inset-x-0 top-0 w-full font-primary z-90 bg-white px-5 flex items-center justify-between py-5 shadow-xl border-b border-slate-100">
            <CiMenuBurger
              className="flex sm:hidden cursor-pointer"
              size={35}
              color="black"
              onClick={handleModalOpen}
            />
            <div className="mx-auto block sm:hidden ">
              <Logo />
            </div>
            <div className="sm:flex hidden  gap-5 justify-center">
              <LinkIcon href="/">
                <BiArrowBack className="text-2xl" />
              </LinkIcon>
              <Logo />
              <LinkIcon href="/profile/commandes">Mes commanes</LinkIcon>
              <LinkIcon isSimple={true} href="/profile/favoris">
                Mes favoris
              </LinkIcon>
            </div>
            <Popover>
              <PopoverTrigger
                asChild
                className=" gap-2 justify-center items-center bg-white sm:flex hidden "
              >
                <FaUserAlt
                  className="bg-gray-200 p-1 rounded-3xl text-gray-500"
                  size={35}
                />
                <BsChevronDown className="text-xl" />
              </PopoverTrigger>
              <PopoverContent className="bg-transparent border border-black/20 z-[99]  rounded-2xl overflow-hidden">
                <div className="font-primary bg-white p-4 text-clamp-base shadow-2xl rounded-2xl">
                  <div className="flex items-center ">
                    <FaUserAlt
                      className="bg-gray-200 p-1 rounded-3xl text-gray-400"
                      size={35}
                    />
                    <div className="text-clamp-xs mx-3 flex flex-col">
                      <span>sijean619@gmail.com</span>
                      <span className="font-light">+225 0759091098</span>
                    </div>
                  </div>
                  <div className="flex flex-col text-clamp-base gap-y-2.5 mt-5">
                    <LinkIcon href="/profile">Profile</LinkIcon>
                    <LinkIcon href="/profile/commandes" className="">
                      Parametre
                    </LinkIcon>

                    <button className="text-red-500 mt-4" onClick={() => {}}>
                      Deconnexion
                    </button>
                  </div>
                  {/* <PopoverClose>Close</PopoverClose> */}
                </div>
              </PopoverContent>
            </Popover>
          </header>
          <Modal
            styleContainer="flex items-center select-none size-full justify-start"
            position="start"
            zIndex={100}
            setHide={handleModalClose}
            isOpen={isModalOpen}
            animationName="translateLeft"
          >
            <div className="relative font-primary bg-white min-h-dvh w-sm pl-8 pr-28 pt-10">
              <div className="absolute top-8 left-2">
                <PiXThin
                  size={50}
                  className="cursor-pointer text-black"
                  onClick={handleModalClose}
                />
              </div>
              <div>
                <div className="flex flex-col text-clamp-md gap-4 justify-center mt-16 items-start">
                  <div className="flex items-center">
                    <FaUserAlt
                      className="bg-gray-200 p-1 rounded-3xl text-gray-500"
                      size={40}
                    />
                    <div className="text-clamp-sm mx-3 flex flex-col">
                      <span>sijean619@gmail.com</span>
                      <span className="font-light">+225 0759091098</span>
                    </div>
                  </div>
                  <div className="text-clamp-md flex items-start gap-3.5 flex-col ">
                    <LinkIcon href="/profile">Mon profile</LinkIcon>
                    <LinkIcon href="/profile/commandes">Mes commanes</LinkIcon>
                    <LinkIcon isSimple={true} href="/profile/favoris">
                      Mes favoris
                    </LinkIcon>
                  </div>
                </div>
                <div className="flex flex-col text-clamp-md gap-y-2.5 justify-center items-start absolute bottom-8 ">
                  <LinkIcon href="/profile/commandes">Parametre</LinkIcon>
                  <button onClick={() => {}}>Deconnexion</button>
                </div>
              </div>
            </div>
          </Modal>
        </>
      )}
    </>
  );
}

function Logo() {
  return (
    <button
      onClick={() => {
        navigate("/");
      }}
      className="flex items-center gap-1.5 transition-all duration-300"
    >
      <img
        src={logoUrl}
        className="size-10 md:size-12 object-contain"
        alt="logo"
      />
      <h1 className="hidden xs:block text-sm sm:text-base md:text-lg lg:text-2xl text-black font-primary transition-all duration-300">
        Marque
      </h1>
    </button>
  );
}
