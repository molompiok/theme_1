import React, { useEffect, useRef, useState } from "react";
// import { useAuthStore } from "../../store/user"; // Supposé non utilisé ici pour la démo
import { useQuery } from "@tanstack/react-query";
import { get_categories } from "../../api/categories.api"; // Assurez-vous que le chemin est correct
import { Link } from "../Link"; // LinkSideBar n'est plus utilisé, Link suffit
import {
  BsChevronDown,
  BsChevronLeft,
  BsChevronRight,
  BsX,
} from "react-icons/bs";
import { CiMenuFries } from "react-icons/ci"; // Alternative à CiMenuBurger
import Modal from "./Modal"; // Assurez-vous que le chemin est correct
import { Logo } from "../../renderer/Layout"; // Assurez-vous que le chemin est correct
// import { IoMdLink } from "react-icons/io"; // Non utilisé
import gsap from "gsap";
import { navigate } from "vike/client/router";
// import { BASE_URL } from "../../api"; // Non utilisé
import { ProductMedia } from "../ProductMedia"; // Assurez-vous que le chemin est correct
import { useThemeSettingsStore } from "../../store/themeSettingsStore";

// MOCK DATA for get_categories if API is not available for demo
// const mockCategories = [
//   { id: '1', name: 'Électronique', slug: 'electronique', parent_category_id: null, icon: [{ url: 'icon_tv.svg', alt: 'TV' }] },
//   { id: '2', name: 'Livres', slug: 'livres', parent_category_id: null, icon: [{ url: 'icon_book.svg', alt: 'Book' }] },
//   { id: '3', name: 'Vêtements', slug: 'vetements', parent_category_id: null, icon: [{ url: 'icon_shirt.svg', alt: 'Shirt' }] },
//   { id: '1-1', name: 'Télévisions', slug: 'televisions', parent_category_id: '1', icon: [] },
//   { id: '1-2', name: 'Smartphones', slug: 'smartphones', parent_category_id: '1', icon: [] },
//   { id: '3-1', name: 'Hommes', slug: 'hommes', parent_category_id: '3', icon: [] },
//   { id: '3-2', name: 'Femmes', slug: 'femmes', parent_category_id: '3', icon: [] },
// ];

export default function SideBarCategories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]); // Stores parent category IDs
  const listRef = useRef<HTMLUListElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
const filterSideBackgroundColor = useThemeSettingsStore(state => state.filterSideBackgroundColor);
const filterSideTextColor = useThemeSettingsStore(state => state.filterSideTextColor);
  // const user = useAuthStore((state) => state.user); // Supposé non utilisé

  // Animation GSAP pour la liste des catégories
  useEffect(() => {
    if (listRef.current && isModalOpen) {
      gsap.fromTo(
        listRef.current.children,
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4, // Légèrement plus rapide
          stagger: 0.07, // Stagger plus subtil
          ease: "power3.out",
        }
      );
    }
  }, [currentCategoryId, isModalOpen]);

  // Query pour les catégories
  const {
    data: categories,
    isError,
    isPending,
  } = useQuery({
    queryKey: ["get_categories"],
    queryFn: () => get_categories({ store_id: "d3d8dfcf-b84b-49ed-976d-9889e79e6306" }),
    // queryFn: () => Promise.resolve({ list: mockCategories }), // Pour démo sans API
    select: (data) => (data?.list ? data.list : []),
  });

  if (isPending) {
    return (
      <div className="px-4">
        <div className="h-8 w-24 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
      </div>
    );
  }

  if (isError || !categories) {
    // Peut-être afficher un message d'erreur plus explicite ou un composant d'erreur
    return <div className="px-4 text-red-500">Erreur de chargement des catégories.</div>;
  }

  const handleModalOpen = () => {
    setIsModalOpen(true);
    setCurrentCategoryId(null);
    setHistory([]);
    document.body.style.overflow = "hidden";
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const getCurrentCategories = () => {
    return categories?.filter((cat) =>
      currentCategoryId === null
        ? !cat.parent_category_id // Root categories
        : cat.parent_category_id === currentCategoryId // Subcategories
    );
  };

  const hasSubCategories = (categoryId: string) => {
    return categories?.some((cat) => cat.parent_category_id === categoryId);
  };

  const animateAndChangeCategory = (newCategoryId: string | null, direction: 'forward' | 'back') => {
    if (listRef.current) {
      const xDirection = direction === 'forward' ? -30 : 30;
      gsap.to(listRef.current.children, {
        opacity: 0,
        x: xDirection,
        duration: 0.2,
        stagger: direction === 'forward' ? 0.05 : -0.05, // Stagger inversé pour le retour
        ease: "power2.in",
        onComplete: () => {
          if (direction === 'forward' && newCategoryId !== null) {
            setHistory((prev) => [...prev, currentCategoryId === null ? "root" : currentCategoryId]);
            setCurrentCategoryId(newCategoryId);
          } else if (direction === 'back') {
            const newHistory = [...history];
            const previousId = newHistory.pop();
            setHistory(newHistory);
            setCurrentCategoryId(previousId === "root" ? null : previousId || null);
          }
          // Scroll to top of modal content
          if (modalContentRef.current) {
            modalContentRef.current.scrollTop = 0;
          }
        },
      });
    }
  };

  const handleForward = (categoryId: string) => {
    animateAndChangeCategory(categoryId, 'forward');
  };

  const handleBack = () => {
    animateAndChangeCategory(null, 'back');
  };

  const currentCategoryData = categories.find(
    (cat) => cat.id === currentCategoryId
  );
  const parentCategoryOfCurrent = history.length > 0
    ? categories.find(cat => cat.id === history[history.length -1])
    : null;


  const parentCategories = categories?.filter((cat) => !cat.parent_category_id);
  const MAX_DESKTOP_CATEGORIES = 4;
  const shouldShowModalButton = parentCategories?.length > MAX_DESKTOP_CATEGORIES;

  const { setSettings, resetSettings, ...settings } = useThemeSettingsStore();

  return (
    <>
      {/* Desktop Horizontal Menu */}
      <nav className="hidden lg:flex items-center gap-1 px-4" aria-label="Catégories principales" style={{ backgroundColor: filterSideBackgroundColor }}>
        {parentCategories
          ?.slice(0, shouldShowModalButton ? MAX_DESKTOP_CATEGORIES : parentCategories?.length)
          .map((category) => (
            <button
              key={category.id}
              // href={`/categorie/${category.slug}`}
              onClick={() => navigate(`/categorie/${category.slug}`)}
              className="group px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-md transition-colors duration-150 ease-in-out"
              // onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -2, duration: 0.2 })}
              // onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0, duration: 0.2 })}
            >
              <div className="flex items-center gap-2">
                {category.icon?.length > 0 && (
                  <ProductMedia mediaList={category.icon} productName={category.name} className="size-5 text-neutral-500 dark:text-neutral-400 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors" />
                )}
                <span>{category.name}</span>
              </div>
            </button>
          ))}
        {shouldShowModalButton && (
          <button
            onClick={handleModalOpen}
            className="px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-md transition-colors duration-150 ease-in-out"
            aria-label="Plus de catégories"
            onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -2, duration: 0.2 })}
            onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0, duration: 0.2 })}
            style={{
              color: settings?.headerTextColor,
            }}
          >
            <BsChevronDown size={18} className="opacity-75" />
          </button>
        )}
      </nav>

      <div className="lg:hidden px-4">
        <button
          onClick={handleModalOpen}
          className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-md transition-colors"
          aria-label="Ouvrir le menu des catégories"
               style={{
              color: settings?.headerTextColor,
            }}
        >
          <CiMenuFries size={28} />
        </button>
      </div>

      <Modal
        styleContainer="fixed inset-0 flex justify-start items-center"
        position="start"
        zIndex={100}
        setHide={handleModalClose}
        isOpen={isModalOpen}
        animationName="translateLeft"
      >
        <div
          ref={modalContentRef}
          className="font-primary relative h-dvh w-full max-w-md sm:max-w-sm md:max-w-md shadow-2xl flex flex-col overflow-y-auto"
          style={{ backgroundColor: filterSideBackgroundColor , color: filterSideTextColor }}
        >
          <div className="sticky top-0 z-10 backdrop-blur-md p-4 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700" style={{ backgroundColor: filterSideBackgroundColor }}  >
            {history.length > 0 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-sm font-medium transition-colors p-2 -ml-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-900/50"
              >
                <BsChevronLeft size={20} />
                <span style={{ color: filterSideTextColor }}>{parentCategoryOfCurrent?.name || "Retour"}</span>
              </button>
            ) : (
              <Link href="/" onClick={handleModalClose} className="block">
                <Logo className="h-8 w-auto" />
              </Link>
            )}
            <button
              onClick={handleModalClose}
              className="p-2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full transition-all duration-300 ease-in-out"
              aria-label="Fermer le menu"
              onMouseEnter={(e) => gsap.to(e.currentTarget, { rotate: 90, scale: 1.1, duration: 0.3 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { rotate: 0, scale: 1, duration: 0.3 })}
            >
              <BsX size={28} />
            </button>
          </div>

          <div className="flex-grow p-4 sm:p-6">
            {currentCategoryData ? (
              <div className="mb-4 pb-3 border-b border-neutral-200 dark:border-neutral-700">
                <Link
                  href={`/categorie/${currentCategoryData.slug}`}
                  onClick={() => {
                    handleModalClose();
                  }}
                  className="flex items-center gap-3 p-2 -mx-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 group"
                >
                  {currentCategoryData.icon?.length > 0 && (
                     <ProductMedia mediaList={currentCategoryData.icon} productName={currentCategoryData.name} className="size-7 text-neutral-500 dark:text-neutral-400 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors" />
                  )}
                  <span className="text-lg font-semibold group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors" style={{ color: filterSideTextColor }}>
                    Tous les {currentCategoryData.name.toLowerCase()}
                  </span>
                </Link>
              </div>
            ) : (
              <h2 className="text-xl font-semibold mb-4" style={{ color: filterSideTextColor }}>
                Toutes les catégories
              </h2>
            )}

            <ul ref={listRef} className="space-y-1">
              {getCurrentCategories().map((category) => (
                <li key={category.id}>
                  <div
                    className="group flex items-center justify-between p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150 ease-in-out cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (hasSubCategories(category.id)) {
                        handleForward(category.id);
                      } else {
                        navigate(`/categorie/${category.slug}`);
                        handleModalClose();
                      }
                    }}
                    onMouseEnter={(e) => gsap.to(e.currentTarget, { x: 5, duration: 0.2, ease: "power2.out" })}
                    onMouseLeave={(e) => gsap.to(e.currentTarget, { x: 0, duration: 0.2, ease: "power2.out" })}
                  >
                    <div className="flex items-center gap-3">
                       {category.icon?.length > 0 && (
                         <ProductMedia mediaList={category.icon} productName={category.name} className="size-6 text-neutral-500 dark:text-neutral-400 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors" />
                       )}
                      <span className="text-base font-medium group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors" style={{ color: filterSideTextColor }}>
                        {category.name}
                      </span>
                    </div>
                    {hasSubCategories(category.id) && (
                      <BsChevronRight
                        size={18}
                        className="group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors"
                        style={{ color: filterSideTextColor }}
                      />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto p-4 border-t border-neutral-200 dark:border-neutral-700" style={{ backgroundColor: filterSideBackgroundColor }}>
            <div className="flex justify-around items-center text-sm" style={{ color: filterSideTextColor }}>
              <Link
                onClick={handleModalClose}
                href="/"
                className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors font-medium"
              >
                Boutique
              </Link>
              <Link
                onClick={handleModalClose}
                href="/profile/"
                className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors font-medium"
              >
                Mon compte
              </Link>
              <Link
                onClick={handleModalClose}
                href="/about/"
                className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors font-medium"
              >
                À propos
              </Link>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}