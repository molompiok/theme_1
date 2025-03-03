export { Layout };

import React, { useEffect, useState } from "react";
import logoUrl from "./logo.svg";
import { PageContextProvider, usePageContext } from "./usePageContext";
import type { PageContext } from "vike/types";

import Modal from "../component/Modal";
import { LinkIcon } from "../component/LinkIcon";
import { Link } from "../component/Link";

import {
  BsChevronDown,
  BsHandbag,
  BsSearch,
  BsX,
} from "react-icons/bs";
import { usePanier } from "../store/cart";
import { CiMenuBurger } from "react-icons/ci";
import { navigate } from "vike/client/router";
import { BiArrowBack } from "react-icons/bi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../component/Popover";
import { FaUserAlt } from "react-icons/fa";
import { PiXThin } from "react-icons/pi";
import ModalCart from "../component/ModalCart";
import ModalChooseFeature from "../component/ModalChooseFeature";
function Layout({
  children,
  pageContext,
}: {
  children: React.ReactNode;
  pageContext: PageContext;
}) {
 
  /****************************************** */
  const toggleCart = usePanier((state) => state.toggleCart);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
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
    );
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
            <ModalCart/>

            {/***Modal feature */}
          <ModalChooseFeature/>
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
              navigate("/dev/icons");
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

                    <button className="text-red-500 mt-4" onClick={() => { }}>
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
                  <button onClick={() => { }}>Deconnexion</button>
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
