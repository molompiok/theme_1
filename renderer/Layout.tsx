export { Layout };

import React, { useEffect, useState } from "react";
import logoUrl from "./logo.svg";
import { PageContextProvider } from "./usePageContext";
import type { PageContext } from "vike/types";
import "./css/index.css";
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
  BsX,
} from "react-icons/bs";
import { usePanier } from "../store/cart";
import { CiMenuBurger, CiSearch, CiShoppingCart } from "react-icons/ci";
import { navigate } from 'vike/client/router'
function Layout({
  children,
  pageContext,
}: {
  children: React.ReactNode;
  pageContext: PageContext;
}) {
  const toggleCart = usePanier((state) => state.toggleCart);
  return (
    <>
      <PageContextProvider pageContext={pageContext}>
        <Frame>
          <Header>
            <Category categories={["Hommes", "Femmes", "Enfant"]} />
            <Logo />
            <nav className="flex items-center gap-5">
              <BsSearch size={24} className="cursor-pointer" onClick={() => {
                navigate('/search')
              }}/>
              <BsHandbag
                size={24}
                onClick={() => {
                  toggleCart(true);
                }}
              />
              <div className="lg:flex lg:gap-5 lg:justify-center  hidden">
                <LinkIcon href="/">Welcome</LinkIcon>
                <LinkIcon href="/about">Mon compte</LinkIcon>
              </div>
            </nav>
          </Header>
          {children}
        </Frame>
      </PageContextProvider>
    </>
  );
}

function Category({ categories }: { categories: string[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
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
            <BsX
              size={50}
              className="cursor-pointer text-black"
              onClick={handleModalClose}
            />
          </div>
          <div className="flex flex-col gap-4 justify-center mt-16 items-start">
          <Logo />
            <Link href="/">Welcome</Link>
            <Link href="/about">Mon compte</Link>
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
  return (
    <>
      <div className="relative w-full top-0  z-40 bg-black text-white flex justify-center items-center">
        <span className="text-clamp-base font-medium text-white py-1 font-primary">
          Livraison gratuite en Côte d'Ivoire
        </span>
      </div>
      <header className="sticky inset-x-0 top-0 w-full font-primary z-90 px-5 bg-slate-50 flex items-center justify-between py-3 shadow-xl border-b border-slate-100">
        {children}
      </header>
    </>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-1.5">
      <a href="/">
        <img src={logoUrl} className="md:size-12 size-8 " alt="logo" />
      </a>
      <h1 className="text-[0px] xs:text-lg md:text-2xl text-black font-primary">
        marque
      </h1>
    </div>
  );
}
