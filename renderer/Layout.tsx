export { Layout };
import React, { useEffect, useState } from "react";
import logoUrl from "./logo.svg";
import { PageContextProvider, usePageContext } from "./usePageContext";
import type { PageContext } from "vike/types";
import { Toaster } from "react-hot-toast";
import { LinkIcon } from "../component/LinkIcon";
import { Link } from "../component/Link";
import { BsChevronDown, BsHandbag, BsPerson, BsSearch } from "react-icons/bs";
import { useModalCart } from "../store/cart";
import { CiMenuBurger } from "react-icons/ci";
import { navigate } from "vike/client/router";
import { BiArrowBack, BiSolidUser } from "react-icons/bi";
import { Popover, PopoverContent, PopoverTrigger } from "../component/Popover";
import { FaUserAlt } from "react-icons/fa";
import { PiXThin } from "react-icons/pi";
import { useGoogleOneTapLogin } from "@react-oauth/google";
import { api } from "../api";
import { useAuthStore, useModalAuth } from "../store/user";
import ModalCart from "../component/modal/ModalCart";
import ModalChooseFeature from "../component/modal/ModalChooseFeature";
import ModalAuth from "../component/modal/ModalAuth";
import SideBarCategories from "../component/modal/SideBarCategories";
import Modal from "../component/modal/Modal";

function Layout({
  children,
  pageContext,
}: {
  children: React.ReactNode;
  pageContext: PageContext;
}) {
  const toggleCart = useModalCart((state) => state.toggleCart);
  const openModalAuth = useModalAuth((state) => state.open);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex h-dvh w-dvw justify-center items-center animate-pulse">
        <Logo />
      </div>
    );
  }

  return (
    <PageContextProvider pageContext={pageContext}>
      <Frame>
        <Header>
          <SideBarCategories />
          <Logo />
          <nav className="flex items-center gap-5">
            <div className="hidden font-semibold uppercase lg:flex lg:gap-5 lg:justify-center">
              <LinkIcon href="/">Boutique</LinkIcon>
              <LinkIcon href="/About">About</LinkIcon>
            </div>
            <BsSearch
              size={24}
              className="cursor-pointer"
              onClick={() => navigate("/search")}
            />
            <BsHandbag
              size={24}
              className="cursor-pointer"
              onClick={() => {
                toggleCart(true);
                document.body.style.overflow = "hidden";
              }}
            />
            <BsPerson
              size={28}
              className="cursor-pointer"
              onClick={() => {
                const user = useAuthStore.getState().user;
                if (user) {
                  navigate("/profile");
                } else {
                  openModalAuth("login");
                  document.body.style.overflow = "hidden";
                }
              }}
            />
          </nav>
        </Header>
        {children}

        <ModalCart />
        <ModalChooseFeature />
        <ModalAuth />
      </Frame>
    </PageContextProvider>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);

  useGoogleOneTapLogin({
    cancel_on_tap_outside: true,
    use_fedcm_for_prompt: true,
    auto_select: false,
    disabled: true,
    // disabled: Boolean(user),
    onSuccess: async (response) => {
      try {
        await api.post("/google_callback", { token: response.credential });
        useAuthStore.getState().fetchUser();
      } catch (error) {
        console.error("Google login error:", error);
      }
    },
    onError: () => {
      console.error("Google One Tap login failed");
    },
  });

  const toasterStyles = {
    success: {
      icon: "✅",
      style: {
        background: "#D1FAE5",
        color: "#065F46",
        borderLeft: "4px solid #10B981",
        padding: "12px",
        borderRadius: "8px",
        fontWeight: "bold",
      },
    },
    error: {
      icon: "❌",
      style: {
        background: "#FEE2E2",
        color: "#991B1B",
        borderLeft: "4px solid #EF4444",
      },
    },
  };

  return (
    <>
      <div className="relative h-full w-full scrollbar-thin">{children}</div>
      <Toaster
        position="top-center"
        toastOptions={{ duration: 5000, ...toasterStyles }}
      />
    </>
  );
}

function Header({ children }: { children: React.ReactNode }) {
  const { urlPathname } = usePageContext();
  const user = useAuthStore((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const bannerClasses =
    "relative w-full top-0 z-40 bg-yellow-600 text-black flex justify-center items-center";
  const headerClasses =
    "sticky inset-x-0 top-0 w-full font-primary z-90 px-5 bg-slate-50 flex items-center justify-between py-2 shadow-xl border-b border-slate-100";

  return (
    <>
      {!urlPathname.startsWith("/profile") ? (
        <>
          <button
            onClick={() => navigate("/dev/icons")}
            className={bannerClasses}
          >
            <span className="text-clamp-base font-medium text-white py-2 font-primary">
              Livraison gratuite en Côte d'Ivoire
            </span>
          </button>
          <header className={headerClasses}>{children}</header>
        </>
      ) : (
        <>
          <header className="sticky inset-x-0 top-0 w-full font-primary z-90 bg-white px-5 flex items-center justify-between py-2 shadow-xl border-b border-slate-100">
            <CiMenuBurger
              className="flex sm:hidden cursor-pointer"
              size={35}
              color="black"
              onClick={handleModalOpen}
            />
            <div className="mx-auto block sm:hidden">
              <Logo />
            </div>
            <div className="hidden uppercase font-semibold sm:flex gap-5 justify-center">
              <LinkIcon href="/">
                <BiArrowBack className="text-2xl" />
              </LinkIcon>
              <Logo />
              <LinkIcon href="/profile/commandes">Mes commandes</LinkIcon>
              <LinkIcon isSimple={true} href="/profile/favoris">
                Mes favoris
              </LinkIcon>
            </div>
            <Popover>
              <PopoverTrigger className="gap-2 justify-center items-center bg-white hidden sm:flex">
                <FaUserAlt
                  className="bg-gray-200 p-1 rounded-3xl text-gray-500"
                  size={35}
                />
                <BsChevronDown className="text-xl" />
              </PopoverTrigger>
              <PopoverContent className="bg-transparent border border-black/20 z-[99] rounded-2xl overflow-hidden">
                <div className="font-primary bg-white p-4 text-clamp-base shadow-2xl rounded-2xl">
                  <div className="flex items-center">
                    <FaUserAlt
                      className="bg-gray-200 p-1 rounded-3xl text-gray-400"
                      size={35}
                    />
                    <div className="text-clamp-xs mx-3 flex flex-col">
                      <span>{user?.full_name || "Utilisateur"}</span>
                      <span className="font-light">
                        {user?.phone_numbers?.[0]?.phone_number
                          ? `+${user.phone_numbers[0].phone_number}`
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col text-clamp-base gap-y-2.5 mt-5">
                    <LinkIcon href="/profile">Profil</LinkIcon>
                    <LinkIcon href="/profile/commandes">Paramètres</LinkIcon>
                    <button
                      className="text-red-500 cursor-pointer mt-4 text-left"
                      onClick={() => useAuthStore.getState().logout()}
                    >
                      Déconnexion
                    </button>
                  </div>
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
              <PiXThin
                size={50}
                className="absolute top-8 left-2 cursor-pointer text-black"
                onClick={handleModalClose}
              />
              <div className="flex flex-col text-clamp-md gap-4 justify-center mt-16 items-start">
                <div className="flex items-center">
                  <FaUserAlt
                    className="bg-gray-200 p-1 rounded-3xl text-gray-500"
                    size={40}
                  />
                  <div className="text-clamp-sm mx-3 flex flex-col">
                    <span>{user?.full_name || "Utilisateur"}</span>
                    <span className="font-light">
                      {user?.phone_numbers?.[0]?.phone_number
                        ? `+${user.phone_numbers[0].phone_number}`
                        : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="text-clamp-md uppercase flex items-start gap-3.5 flex-col">
                  <LinkIcon href="/profile">Mon profil</LinkIcon>
                  <LinkIcon href="/profile/commandes">Mes commandes</LinkIcon>
                  <LinkIcon isSimple={true} href="/profile/favoris">
                    Mes favoris
                  </LinkIcon>
                </div>
              </div>
              <div className="flex flex-col text-clamp-md gap-y-2.5 justify-center items-start absolute bottom-8">
                <LinkIcon href="/profile/commandes">Paramètres</LinkIcon>
                <button
                  className="text-red-500"
                  onClick={() => useAuthStore.getState().logout()}
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </Modal>
        </>
      )}
    </>
  );
}

export function Logo() {
  return (
    <button
      onClick={() => navigate("/")}
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
