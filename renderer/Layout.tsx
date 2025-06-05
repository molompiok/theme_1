import React, { useEffect, useMemo, useRef, useState } from "react";
import logoUrl from "./logo.svg";
import { PageContextProvider, usePageContext } from "./usePageContext";
import type { PageContext } from "vike/types";
import { Toaster } from "react-hot-toast";
import { LinkIcon } from "../component/LinkIcon";
import {
  BsChevronDown,
  BsHandbag,
  BsHeart,
  BsPerson,
  BsSearch,
} from "react-icons/bs";
import { useModalCart } from "../store/cart";
import { CiMenuBurger } from "react-icons/ci";
import { navigate } from "vike/client/router";
import { BiArrowBack } from "react-icons/bi";
import { Popover, PopoverContent, PopoverTrigger } from "../component/Popover";
import { FaUserAlt } from "react-icons/fa";
import { PiXThin } from "react-icons/pi";
import { api } from "../api";
import { useAuthStore, useModalAuth } from "../store/user";
import ModalCart from "../component/modal/ModalCart";
import ModalChooseFeature from "../component/modal/ModalChooseFeature";
import ModalAuth from "../component/modal/ModalAuth";
import SideBarCategories from "../component/modal/SideBarCategories";
import Modal from "../component/modal/Modal";
import clsx from "clsx";
import { Footer } from "./Footer";
import useCart from "../hook/query/useCart";
import { ProductMedia } from "../component/ProductMedia";
import VerticalBanner from "../component/VerticalBanner";
import {
  ThemeSettings,
  useThemeSettingsStore,
} from "../store/themeSettingsStore";

const parseThemeSettingsFromQuery = (
  searchParams: URLSearchParams
): Partial<ThemeSettings> => {
  const settings: Partial<ThemeSettings> = {};
  const primaryColor = searchParams.get("setting_primaryColor");
  if (primaryColor) settings.primaryColor = `#${primaryColor}`;

  const bodyFont = searchParams.get("setting_bodyFont");

  if (bodyFont) settings.bodyFont = decodeURIComponent(bodyFont);

  return settings;
};

function getQueryParams() {
  if (typeof window === "undefined") return {};
  return Object.fromEntries(new URLSearchParams(window.location.search));
}

interface PostMessageData {
  type: "UPDATE_THEME_SETTINGS" | "GET_CURRENT_SETTINGS";
  payload?: any;
}

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
  const { data: cart } = useCart();

  const { setSettings, resetSettings, ...settings } = useThemeSettingsStore();

  const urlParsed = getQueryParams();

  useEffect(() => {
    const initialSettingsFromQuery = parseThemeSettingsFromQuery(
      new URLSearchParams(urlParsed)
    );
    setSettings({
      ...settings,
      ...initialSettingsFromQuery,
    });

    const handleMessage = (event: MessageEvent<PostMessageData>) => {
      const { type, payload } = event.data;

      if (type === "UPDATE_THEME_SETTINGS" && payload) {
        setSettings({ ...settings, ...payload });
      } else if (type === "GET_CURRENT_SETTINGS") {
        event.source?.postMessage(
          { type: "CURRENT_SETTINGS", payload: settings },
          event.origin as any
        );
      }
    };

    window.addEventListener("message", handleMessage);
    window.parent.postMessage({ type: "PREVIEW_IFRAME_READY" }, "*");

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [urlParsed.search]);

  const totalItems = cart?.cart.items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  const loadingContent = (
    <div className="flex h-dvh w-dvw justify-center items-center animate-pulse">
      <Logo size="large" />
    </div>
  );

  if (!isClient) {
    return loadingContent;
  }

  return (
    <PageContextProvider pageContext={pageContext}>
      <div
        id="page-loader"
        className="flex flex-col justify-center items-center page-loader is-hidden"
      >
        {loadingContent}
      </div>
      <Frame style={{ background: settings.siteBackgroundColor }}>
        <div className="flex justify-end items-center w-full"></div>
        <Header>
          <SideBarCategories />
          <Logo />
          <nav className="flex items-center gap-6">
            <div className="hidden font-medium uppercase lg:flex lg:gap-6 lg:justify-center">
              <LinkIcon
                href="/"
                className="hover:text-primary transition-colors duration-200"
              >
                Boutique
              </LinkIcon>
              <LinkIcon
                href="/About"
                className="hover:text-primary transition-colors duration-200"
              >
                About
              </LinkIcon>
            </div>
            <button
              onClick={() => navigate("/search")}
              className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105"
              aria-label="Rechercher"
            >
              <BsSearch size={20} />
            </button>
            <button
              onClick={() => toggleCart(true)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105"
              aria-label={`Panier (${totalItems} articles)`}
            >
              <BsHandbag size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 animate-pulse">
                {(totalItems ?? 0) > 9 ? "9+" : totalItems}
              </span>
            </button>
            <button
              onClick={() => {
                const user = useAuthStore.getState().user;
                if (user) {
                  navigate("/profile");
                } else {
                  openModalAuth("login");
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105"
              aria-label="Profil utilisateur"
            >
              <BsPerson size={24} />
            </button>
          </nav>
        </Header>
        {children}
        <ModalCart />
        <ModalChooseFeature />
        <ModalAuth />
        <Footer />
      </Frame>
    </PageContextProvider>
  );
}

function Frame({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const toasterStyles = {
    success: {
      icon: "✅",
      style: {
        background: "#D1FAE5",
        color: "#065F46",
        borderLeft: "4px solid #10B981",
        fontSize: "16px",
        padding: "12px",
        borderRadius: "12px",
        fontWeight: "500",
        boxShadow:
          "0 10px 25px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      },
    },
    error: {
      icon: "❌",
      style: {
        background: "#FEE2E2",
        color: "#991B1B",
        fontSize: "16px",
        padding: "12px",
        borderRadius: "12px",
        borderLeft: "4px solid #EF4444",
        boxShadow:
          "0 10px 25px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      },
    },
  };

  return (
    <>
      <div style={style} className="relative h-full w-full scrollbar-thin">
        {children}
      </div>
      <Toaster
        position="top-center"
        toastOptions={{ duration: 4000, ...toasterStyles }}
      />
    </>
  );
}

function Header({ children }: { children: React.ReactNode }) {
  const { urlPathname } = usePageContext();
  const user = useAuthStore((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const shouldBeFixed = scrollPosition > 50;

      if (shouldBeFixed !== isScrolled) {
        setIsScrolled(shouldBeFixed);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolled]);

  const headerTextColor = useThemeSettingsStore(
    (state) => state.headerTextColor
  );
  const headerBackgroundColor = useThemeSettingsStore(
    (state) => state.headerBackgroundColor
  );

  return (
    <>
      {!urlPathname.startsWith("/profile") ? (
        <>
          <VerticalBanner />
          <header
            ref={headerRef}
            className={`w-full font-primary flex items-center justify-between transition-all duration-300 ease-out backdrop-blur-md border-b border-gray-100/20
              ${
                isScrolled
                  ? "fixed top-0 left-0 right-0 z-[100] px-4 sm:px-6 lg:px-8 py-1 shadow-lg bg-white/95"
                  : "relative px-4 sm:px-6 lg:px-8 py-2 bg-white"
              }`}
            style={{
              backgroundColor: isScrolled
                ? `${headerBackgroundColor}f5`
                : headerBackgroundColor,
              color: headerTextColor,
            }}
          >
            {children}
          </header>
          {isScrolled && <div className="h-[60px]"></div>}
        </>
      ) : (
        <>
          <header
            ref={headerRef}
            className={`w-full font-primary flex items-center justify-between transition-all duration-300 ease-out backdrop-blur-md border-b border-gray-100/20
              ${
                isScrolled
                  ? "fixed top-0 left-0 right-0 z-[100] px-4 sm:px-6 lg:px-8 py-3 shadow-lg bg-white/95"
                  : "relative px-4 sm:px-6 lg:px-8 py-4 bg-white"
              }`}
            style={{
              backgroundColor: isScrolled
                ? `${headerBackgroundColor}f5`
                : headerBackgroundColor,
              color: headerTextColor,
            }}
          >
            {/* Mobile Menu Button */}
            <button
              className="flex sm:hidden p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              onClick={handleModalOpen}
              aria-label="Ouvrir le menu"
            >
              <CiMenuBurger size={24} />
            </button>

            {/* Mobile Logo */}
            <div className="mx-auto block sm:hidden">
              <Logo />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden uppercase font-medium sm:flex gap-6 items-center">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
                aria-label="Retour à l'accueil"
              >
                <BiArrowBack className="text-xl" />
              </button>
              <Logo />
              <LinkIcon
                href="/profile/commandes"
                className="hover:text-primary transition-colors duration-200"
              >
                Mes commandes
              </LinkIcon>
              <LinkIcon
                isSimple={true}
                href="/profile/favoris"
                className="hover:text-primary transition-colors duration-200"
              >
                Mes favoris
              </LinkIcon>
            </div>
            <Popover>
              <PopoverTrigger className="gap-3 justify-center items-center hidden sm:flex p-2 hover:bg-gray-50 rounded-xl transition-all duration-200 border border-gray-200/50">
                {user ? (
                  <>
                    {user?.photo ? (
                      <ProductMedia
                        mediaList={user?.photo || []}
                        productName={user?.full_name || "Utilisateur"}
                        className="w-8 h-8 rounded-full"
                        fallbackImage=""
                      />
                    ) : (
                      <span className="bg-gray-700 p-3 text-white rounded-full text-lg">
                        {user?.full_name.split(" ")[0]}
                      </span>
                    )}
                    <span className="text-sm font-medium hidden md:block max-w-24 truncate">
                      {user?.full_name || "Utilisateur"}
                    </span>
                    <BsChevronDown className="text-sm text-gray-500" />
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <FaUserAlt className="text-gray-500 text-sm" />
                    </div>
                    <span className="text-sm font-medium hidden md:block">
                      Se connecter
                    </span>
                    <BsChevronDown className="text-sm text-gray-500" />
                  </>
                )}
              </PopoverTrigger>

              <PopoverContent className="bg-white border border-gray-200/50 shadow-xl z-[99] rounded-2xl overflow-hidden backdrop-blur-sm w-64">
                <div className="font-primary bg-white/95 backdrop-blur-sm">
                  {/* User Info Section */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      {user ? (
                        <ProductMedia
                          mediaList={user?.photo || []}
                          productName={user?.full_name || "Utilisateur"}
                          className="w-10 h-10 rounded-full"
                          fallbackImage=""
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <FaUserAlt className="text-gray-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user?.full_name || "Utilisateur"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.phone_numbers?.[0]?.phone_number
                            ? `${user.phone_numbers[0].format.split(" ")[0]} ${
                                user.phone_numbers[0].phone_number
                              }`
                            : "Aucun numéro"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <LinkIcon
                      href="/profile"
                      className="flex items-center w-full p-3 text-sm  rounded-lg transition-colors duration-200"
                    >
                      <BsPerson className="mr-3 text-gray-400" />
                      <span className="hover:bg-gray-50">Mon Profil</span>
                    </LinkIcon>
                    <LinkIcon
                      href="/profile/commandes"
                      className="flex items-center w-full p-3 text-sm rounded-lg transition-colors duration-200"
                    >
                      <BsHandbag className="mr-3 text-gray-400" />
                      <span className="hover:bg-gray-50">Mes Commandes</span>
                    </LinkIcon>
                    <LinkIcon
                      isSimple={true}
                      href="/profile/favoris"
                      className="flex items-center w-full p-3 text-sm rounded-lg transition-colors duration-200"
                    >
                      <BsHeart className="mr-3 text-gray-400" />
                      <span className="hover:bg-gray-50">Mes Favoris</span>
                    </LinkIcon>
                  </div>
                  <div className="p-2 border-t border-gray-100">
                    <button
                      className="flex items-center w-full p-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      onClick={() => useAuthStore.getState().logout()}
                    >
                      <svg
                        className="mr-3 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Déconnexions
                    </button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </header>
          {isScrolled && <div className="h-[60px]"></div>}

          <Modal
            styleContainer="flex items-center select-none size-full justify-start"
            position="start"
            zIndex={100}
            setHide={handleModalClose}
            isOpen={isModalOpen}
            animationName="translateLeft"
          >
            <div className="relative font-primary bg-white/95 backdrop-blur-md min-h-dvh w-80 shadow-2xl">
              <button
                onClick={handleModalClose}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                aria-label="Fermer le menu"
              >
                <PiXThin size={24} className="text-gray-600" />
              </button>

              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <FaUserAlt className="text-gray-500 text-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-medium text-gray-900 truncate">
                      {user?.full_name || "Utilisateur"}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {user?.phone_numbers?.[0]?.phone_number
                        ? `${user.phone_numbers[0].format.split(" ")[0]} ${
                            user.phone_numbers[0].phone_number
                          }`
                        : "Aucun numéro"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <LinkIcon
                  href="/profile"
                  className="flex items-center w-full p-4 text-base hover:bg-gray-50 rounded-xl transition-colors duration-200"
                >
                  <BsPerson className="mr-4 text-gray-400 text-lg" />
                  Mon profil
                </LinkIcon>
                <LinkIcon
                  href="/profile/commandes"
                  className="flex items-center w-full p-4 text-base hover:bg-gray-50 rounded-xl transition-colors duration-200"
                >
                  <BsHandbag className="mr-4 text-gray-400 text-lg" />
                  Mes commandes
                </LinkIcon>
                <LinkIcon
                  isSimple={true}
                  href="/profile/favoris"
                  className="flex items-center w-full p-4 text-base hover:bg-gray-50 rounded-xl transition-colors duration-200"
                >
                  <svg
                    className="mr-4 text-gray-400 text-lg w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  Mes favoris
                </LinkIcon>
              </div>

              <div className="absolute bottom-6 left-4 right-4 space-y-2 border-t border-gray-100 pt-4">
                <LinkIcon
                  href="/profile/commandes"
                  className="flex items-center w-full p-3 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  <svg
                    className="mr-3 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Paramètres
                </LinkIcon>
                <button
                  className="flex items-center w-full p-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  onClick={() => useAuthStore.getState().logout()}
                >
                  <svg
                    className="mr-3 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
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

type LogoSize = "small" | "medium" | "large";

interface LogoProps {
  size?: LogoSize;
  className?: string;
}

export function Logo({ size = "small", className }: LogoProps) {
  const brandName = "Marque";
  const href = "/";
  const sizeClasses = {
    image: {
      small: "w-8 h-8 sm:w-10 sm:h-10",
      medium: "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14",
      large: "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18",
    },
    text: {
      small: "hidden sm:block text-lg sm:text-xl font-bold",
      medium: "hidden xs:block text-xl sm:text-2xl md:text-3xl font-bold",
      large: "hidden xs:block text-2xl sm:text-3xl md:text-4xl font-bold",
    },
    gap: {
      small: "gap-2 sm:gap-3",
      medium: "gap-2 sm:gap-3 md:gap-4",
      large: "gap-3 sm:gap-4 md:gap-5",
    },
  };

  return (
    <button
      onClick={() => navigate(href)}
      className={clsx(
        "flex items-center group",
        sizeClasses.gap[size],
        "transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg p-1",
        className
      )}
      aria-label={`Retour à l'accueil - ${brandName}`}
    >
      <img
        src={logoUrl}
        className={clsx(
          "object-contain flex-shrink-0 transition-transform duration-300 group-hover:rotate-3",
          sizeClasses.image[size]
        )}
        alt={`${brandName} Logo`}
      />
      <h1
        className={clsx(
          "font-primary text-gray-900 whitespace-nowrap tracking-tight",
          "transition-all duration-300 group-hover:text-primary",
          sizeClasses.text[size]
        )}
      >
        {brandName}
      </h1>
    </button>
  );
}

export { Layout };
