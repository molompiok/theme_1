import React, { useEffect, useMemo, useRef, useState } from "react";
import logoUrl from "./logo.svg";
import { PageContextProvider, usePageContext } from "./usePageContext";
import type { PageContext } from "vike/types";
import { Toaster } from "react-hot-toast";
import { LinkIcon } from "../component/LinkIcon";
import { BsChevronDown, BsHandbag, BsPerson, BsSearch } from "react-icons/bs";
import { useModalCart } from "../store/cart";
import { CiMenuBurger } from "react-icons/ci";
import { navigate } from "vike/client/router";
import { BiArrowBack } from "react-icons/bi";
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
import clsx from "clsx";
import { Footer } from "./Footer";
import useCart from "../hook/query/useCart";
import { ProductMedia } from "../component/ProductMedia";

interface ThemeSettings {
  primaryColor?: string;
  secondaryColor?: string;
  bodyFont?: string;
  headingFont?: string;
  layoutType?: "grid" | "list";
  showHeader?: boolean;
  showFooter?: boolean;
  // Ajouter toutes les autres options de personnalisation possibles ici
  // Exemple:
  // bannerImage?: string;
  // bannerText?: string;
  // productsPerPage?: number;
  // showCategoriesInHeader?: boolean;
}

const parseThemeSettingsFromQuery = (
  searchParams: URLSearchParams
): Partial<ThemeSettings> => {
  const settings: Partial<ThemeSettings> = {};
  // Exemple: Lire primaryColor depuis l'URL (préfixer avec 'setting_')
  const primaryColor = searchParams.get("setting_primaryColor");
  if (primaryColor) settings.primaryColor = `#${primaryColor}`; // Assumer format hex sans #

  const bodyFont = searchParams.get("setting_bodyFont");
  if (bodyFont) settings.bodyFont = decodeURIComponent(bodyFont);

  // Ajouter le parsing pour les autres paramètres d'URL...
  return settings;
};

function getQueryParams() {
  if (typeof window === "undefined") return {};
  return Object.fromEntries(new URLSearchParams(window.location.search));
}

const DEFAULT_SETTINGS: ThemeSettings = {
  primaryColor: "#3B82F6", // Default blue-600
  secondaryColor: "#6B7280", // Default gray-500
  bodyFont:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  headingFont:
    'Poppins, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"', // Exemple Poppins
  layoutType: "grid",
  showHeader: true,
  showFooter: true,
};

interface PostMessageData {
  type: "UPDATE_THEME_SETTINGS" | "GET_CURRENT_SETTINGS"; // Ajouter d'autres types si besoin
  payload?: any;
}

function Layout({
  children,
  pageContext,
}: {
  children: React.ReactNode;
  pageContext: PageContext; // Assurez-vous que PageContext est correctement typé
}) {
  const toggleCart = useModalCart((state) => state.toggleCart);
  const openModalAuth = useModalAuth((state) => state.open);
  const [isClient, setIsClient] = useState(false);
  const { data: cart } = useCart();

  const [settings, setSettings] = useState<ThemeSettings>(DEFAULT_SETTINGS);

  const urlParsed = getQueryParams();

  // console.log({urlParsed})
  useEffect(() => {
    // 1. Parser les settings initiaux depuis l'URL (si présents)
    const initialSettingsFromQuery = parseThemeSettingsFromQuery(
      new URLSearchParams(urlParsed)
    );
    setSettings((prev) => ({
      ...DEFAULT_SETTINGS,
      ...prev,
      ...initialSettingsFromQuery,
    })); // Fusionner avec défauts

    // 2. Mettre en place l'écouteur postMessage
    const handleMessage = (event: MessageEvent<PostMessageData>) => {
      // TODO: Vérifier event.origin pour la sécurité !
      // if (event.origin !== 'URL_DU_DASHBOARD') return;

      const { type, payload } = event.data;

      if (type === "UPDATE_THEME_SETTINGS" && payload) {
        console.log("Received settings update via postMessage", payload);
        // Mettre à jour l'état local avec les nouvelles valeurs reçues
        setSettings((prev) => ({ ...prev, ...payload }));
      } else if (type === "GET_CURRENT_SETTINGS") {
        // Renvoyer les settings actuels si demandés par le parent
        event.source?.postMessage(
          { type: "CURRENT_SETTINGS", payload: settings },
          event.origin as any
        );
      }
    };

    window.addEventListener("message", handleMessage);
    console.log("Preview page ready and listening for postMessages.");

    // 3. Informer le parent que l'iframe est prête (optionnel)
    window.parent.postMessage({ type: "PREVIEW_IFRAME_READY" }, "*"); // Envoyer au parent

    // Nettoyage de l'écouteur
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [urlParsed.search]);

  // const primaryColorStyle = useMemo(
  //   () => ({
  //     color: settings.primaryColor ?? DEFAULT_SETTINGS.primaryColor,
  //   }),
  //   [settings.primaryColor]
  // );

  const totalItems = cart?.cart.items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  // Détecter si on est côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Contenu de chargement pour le SSR
  const loadingContent = (
    <div className="flex h-dvh w-dvw justify-center items-center animate-pulse">
      <Logo size="large" />
    </div>
  );

  // Ne pas rendre le contenu complet tant qu'on n'est pas côté client
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
      <Frame style={{ background: '' }}>
        <div className="flex justify-end items-center w-full">
          {/* {JSON.stringify(primaryColorStyle)} */}
        </div>
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
            <div className="relative">
              <span className="text-sm absolute -top-3 -right-2 bg-gray-600 text-white rounded-full px-1">
                {totalItems}
              </span>
              <BsHandbag
                size={24}
                className="cursor-pointer"
                onClick={() => toggleCart(true)}
              />
            </div>
            <BsPerson
              size={28}
              className="cursor-pointer"
              onClick={() => {
                const user = useAuthStore.getState().user;
                if (user) {
                  navigate("/profile");
                } else {
                  openModalAuth("login");
                }
              }}
            />
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
  const user = useAuthStore((state) => state.user);

  useGoogleOneTapLogin({
    cancel_on_tap_outside: true,
    use_fedcm_for_prompt: true,
    auto_select: false,
    disabled: Boolean(user),
    onSuccess: async (response) => {
      try {
        await api.api?.post("/google_callback", { token: response.credential });
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
        fontSize: "16px",
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
        fontSize: "16px",
        padding: "12px",
        borderRadius: "8px",
        borderLeft: "4px solid #EF4444",
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
        toastOptions={{ duration: 5000, ...toasterStyles }}
      />
    </>
  );
}

function Header({ children }: { children: React.ReactNode }) {
  const { urlPathname } = usePageContext();
  const user = useAuthStore((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null); // Référence pour l’élément header
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

  const bannerClasses =
    "relative w-full top-0 z-40 bg-gray-700 text-white flex justify-center items-center";

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
          <header
            ref={headerRef}
            className={`w-full font-primary flex items-center shadow-md justify-between transition-all duration-300 ease-out
              ${
                isScrolled
                  ? "fixed top-0 left-0 right-0 z-90 bg-white pr-1  sm:px-7 py-2"
                  : "relative sm:px-3 pr-2 py-2"
              }`}
          >
            {children}
          </header>
          {isScrolled && <div className="h-16"></div>}
        </>
      ) : (
        <>
          <header
            ref={headerRef}
            className={`w-full font-primary flex items-center justify-between shadow-md transition-all duration-300 ease-out
              ${
                isScrolled
                  ? "fixed top-0 left-0 right-0 z-90 bg-white  px-7 py-2"
                  : "relative px-3 py-2"
              }`}
          >
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
                {user ? (
                  <>
                    <ProductMedia
                      mediaList={user?.photo || []}
                      productName={user?.full_name || "Utilisateur"}
                      className="size-8 rounded-full"
                      fallbackImage=""
                    />
                    <BsChevronDown className="text-xl" />
                  </>
                ) : (
                  <>
                    <FaUserAlt
                      className="bg-gray-200 p-1 rounded-3xl text-gray-500"
                      size={35}
                    />
                    <BsChevronDown className="text-xl" />
                  </>
                )}
              </PopoverTrigger>
              <PopoverContent className="bg-transparent border border-black/20 z-[99] rounded-2xl overflow-hidden">
                <div className="font-primary bg-white p-4 text-clamp-base shadow-2xl rounded-2xl">
                  <div className="flex items-center">
                    {user ? (
                      <>
                        <ProductMedia
                          mediaList={user?.photo || []}
                          productName={user?.full_name || "Utilisateur"}
                          className="size-8 rounded-full"
                          fallbackImage=""
                        />
                      </>
                    ) : (
                      <>
                        <FaUserAlt
                          className="bg-gray-200 p-1 rounded-3xl text-gray-500"
                          size={35}
                        />
                      </>
                    )}
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
          {isScrolled && <div className="h-16"></div>}
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
      small: "size-6 sm:size-8 md:size-10", // Plus petit
      medium: "size-8 sm:size-10 md:size-12 lg:size-14", // Taille standard (comme avant)
      large: "size-10 sm:size-12 md:size-14 lg:size-16 xl:size-18", // Plus grand
    },
    text: {
      small: "hidden sm:block text-xs sm:text-sm md:text-base", // Texte plus petit, apparaît sur sm
      medium:
        "hidden xs:block text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl", // Standard (comme avant)
      large:
        "hidden xs:block text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl", // Texte plus grand
    },
    gap: {
      small: "gap-1 sm:gap-1.5",
      medium: "gap-1 sm:gap-1.5 md:gap-2",
      large: "gap-1.5 sm:gap-2 md:gap-2.5",
    },
  };

  return (
    <button
      onClick={() => navigate(href)}
      className={clsx(
        "flex items-center",
        sizeClasses.gap[size], // Applique le gap correspondant à la taille
        "transition-all duration-300",
        className // Classes externes pour le bouton
      )}
    >
      {/* <ProductMedia mediaList={logoUrl} productName={`${brandName} Logo`} className={clsx(
          "object-contain flex-shrink-0",
          sizeClasses.image[size] // Applique les classes de taille d'image
        )}/>
         */}
      <img
        src={logoUrl}
        className={clsx(
          "object-contain flex-shrink-0",
          sizeClasses.image[size] // Applique les classes de taille d'image
        )}
        alt={`${brandName} Logo`}
      />
      <h1
        className={clsx(
          "font-primary text-black whitespace-nowrap",
          "transition-all duration-300",
          sizeClasses.text[size] // Applique les classes de visibilité/taille de texte
        )}
      >
        {brandName}
      </h1>
    </button>
  );
}
export { Layout };
