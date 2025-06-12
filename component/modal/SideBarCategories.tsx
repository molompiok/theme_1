import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { get_categories } from "../../api/categories.api";
import { Link } from "../Link";
import {
  BsChevronDown,
  BsChevronLeft,
  BsChevronRight,
  BsX,
} from "react-icons/bs";
import { CiMenuFries } from "react-icons/ci";
import { HiArrowRight } from "react-icons/hi2";
import Modal from "./Modal";
import { Logo } from "../../renderer/Layout";
import gsap from "gsap";
import { navigate } from "vike/client/router";
import { ProductMedia } from "../ProductMedia";
import { useThemeSettingsStore } from "../../store/themeSettingsStore"; // Réintégré

export default function SideBarCategories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(
    null
  );
  const [history, setHistory] = useState<string[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Réintégration des couleurs du thème
  const filterSideBackgroundColor = useThemeSettingsStore(
    (state) => state.filterSideBackgroundColor
  );
  const filterSideTextColor = useThemeSettingsStore(
    (state) => state.filterSideTextColor
  );

  useEffect(() => {
    if (listRef.current && isModalOpen) {
      gsap.set(listRef.current.children, {
        opacity: 0,
        y: 20,
        scale: 0.95,
        filter: "blur(4px)",
      });

      gsap.to(listRef.current.children, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.6,
        stagger: 0.08,
        ease: "back.out(1.2)",
      });
    }
  }, [currentCategoryId, isModalOpen]);

  useEffect(() => {
    if (headerRef.current && isModalOpen) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", delay: 0.2 }
      );
    }
  }, [isModalOpen, history.length]);

  const {
    data: categories,
    isError,
    isPending,
  } = useQuery({
    queryKey: ["get_categories"],
    queryFn: () => get_categories({}),
    select: (data) => (data?.list ? data.list : []),
  });

  if (isPending) {
    return (
      <div className="px-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-24 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 dark:from-neutral-700 dark:via-neutral-600 dark:to-neutral-700 rounded-lg bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>
          <div className="h-6 w-6 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 dark:from-neutral-700 dark:via-neutral-600 dark:to-neutral-700 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (isError || !categories) {
    return (
      <div className="px-4">
        <div className="flex items-center gap-2 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg">
          <div className="w-2 h-2 bg-neutral-500 rounded-full animate-pulse"></div>
          <span className="text-neutral-700 dark:text-neutral-300 text-sm font-medium">
            Impossible de charger les catégories
          </span>
        </div>
      </div>
    );
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
    setHoveredCategory(null);
  };

  const getCurrentCategories = () => {
    return categories?.filter((cat) =>
      currentCategoryId === null
        ? !cat.parent_category_id
        : cat.parent_category_id === currentCategoryId
    );
  };

  const hasSubCategories = (categoryId: string) => {
    return categories?.some((cat) => cat.parent_category_id === categoryId);
  };

  const animateAndChangeCategory = (
    newCategoryId: string | null,
    direction: "forward" | "back"
  ) => {
    if (listRef.current) {
      const children = Array.from(listRef.current.children);
      gsap.to(children, {
        opacity: 0,
        y: direction === "forward" ? -15 : 15,
        scale: 0.95,
        filter: "blur(2px)",
        duration: 0.3,
        stagger: direction === "forward" ? 0.03 : -0.03,
        ease: "power2.in",
        onComplete: () => {
          if (direction === "forward" && newCategoryId !== null) {
            setHistory((prev) => [
              ...prev,
              currentCategoryId === null ? "root" : currentCategoryId,
            ]);
            setCurrentCategoryId(newCategoryId);
          } else if (direction === "back") {
            const newHistory = [...history];
            const previousId = newHistory.pop();
            setHistory(newHistory);
            setCurrentCategoryId(
              previousId === "root" ? null : previousId || null
            );
          }
          if (modalContentRef.current) {
            modalContentRef.current.scrollTo({ top: 0, behavior: "smooth" });
          }
        },
      });
    }
  };

  const handleForward = (categoryId: string) => {
    animateAndChangeCategory(categoryId, "forward");
  };

  const handleBack = () => {
    animateAndChangeCategory(null, "back");
  };

  const currentCategoryData = categories.find(
    (cat) => cat.id === currentCategoryId
  );

  const parentCategoryOfCurrent =
    history.length > 0
      ? categories.find((cat) => cat.id === history[history.length - 1])
      : null;

  const parentCategories = categories?.filter((cat) => !cat.parent_category_id);
  const MAX_DESKTOP_CATEGORIES = 2;
  const shouldShowModalButton =
    parentCategories?.length > MAX_DESKTOP_CATEGORIES;
  // const { setSettings, resetSettings, ...settings } = useThemeSettingsStore(); // Pas nécessaire ici

  return (
    <>
      <nav
        className="hidden lg:flex items-center gap-2 px-6 py-3"
        aria-label="Catégories principales"
        style={{
          backgroundColor: filterSideBackgroundColor
            ? `${filterSideBackgroundColor}f0`
            : "rgba(255,255,255,0.9)",
          // boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        {parentCategories
          ?.slice(
            0,
            shouldShowModalButton
              ? MAX_DESKTOP_CATEGORIES
              : parentCategories?.length
          )
          .map((category, index) => (
            <button
              key={category.id}
              onClick={() => navigate(`/categorie/${category.slug}`)}
              className="group relative px-4 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white rounded-xl transition-all duration-300 ease-out hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-neutral-800/50 overflow-hidden"
              style={{
                animationDelay: `${index * 100}ms`,
                color: filterSideTextColor,
              }}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  y: -3,
                  scale: 1.05,
                  duration: 0.3,
                  ease: "back.out(1.2)",
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  y: 0,
                  scale: 1,
                  duration: 0.3,
                  ease: "power2.out",
                });
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-black/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-transparent dark:from-black/10 dark:via-black/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

              <div className="relative flex items-center gap-3">
                {category.icon?.length > 0 && (
                  <div className="transform group-hover:rotate-12 transition-transform duration-300">
                    <ProductMedia
                      mediaList={category.icon}
                      productName={category.name}
                      className="size-5 text-neutral-500 dark:text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors duration-300"
                    />
                  </div>
                )}
                <span className="relative">
                  {category.name}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-black dark:bg-white group-hover:w-full transition-all duration-300"></div>
                </span>
              </div>
            </button>
          ))}

        {shouldShowModalButton && (
          <button
            onClick={handleModalOpen}
            className="group relative px-4 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white rounded-xl transition-all duration-300 ease-out hover:shadow-lg overflow-hidden"
            aria-label="Plus de catégories"
            style={{ color: filterSideTextColor }}
            onMouseEnter={(e) =>
              gsap.to(e.currentTarget, {
                y: -3,
                scale: 1.05,
                duration: 0.3,
                ease: "back.out(1.2)",
              })
            }
            onMouseLeave={(e) =>
              gsap.to(e.currentTarget, {
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: "power2.out",
              })
            }
          >
            <div className="absolute inset-0 bg-neutral-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <div className="relative flex items-center gap-2">
              <BsChevronDown
                size={16}
                className="transform group-hover:rotate-180 transition-transform duration-300"
              />
            </div>
          </button>
        )}
      </nav>

      <div className="lg:hidden px-4 py-2">
        <button
          onClick={handleModalOpen}
          className="group relative p-3 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white rounded-xl transition-all duration-300 overflow-hidden hover:bg-neutral-100 dark:hover:bg-neutral-800"
          aria-label="Ouvrir le menu des catégories"
          style={{ color: filterSideTextColor }}
        >
          <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
          <CiMenuFries
            size={24}
            className="relative transform group-hover:scale-110 transition-transform duration-300"
          />
        </button>
      </div>

      <Modal
        styleContainer="fixed inset-0 flex justify-start items-center backdrop-blur-sm"
        position="start"
        zIndex={100}
        setHide={handleModalClose}
        isOpen={isModalOpen}
        animationName="translateLeft"
      >
        <div
          ref={modalContentRef}
          className="font-primary relative h-dvh w-full max-w-md sm:max-w-sm md:max-w-md shadow-2xl flex flex-col overflow-y-auto border-r border-neutral-200/20 dark:border-neutral-700/20"
          style={{
            backgroundColor: filterSideBackgroundColor || "white",
            color: filterSideTextColor || "black",
            backdropFilter: "blur(20px)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div
            ref={headerRef}
            className="sticky top-0 z-20 backdrop-blur-xl p-4 flex items-center justify-between border-b border-neutral-200/30 dark:border-neutral-700/30"
            style={{
              backgroundColor: filterSideBackgroundColor
                ? `${filterSideBackgroundColor}f5`
                : "rgba(255,255,255,0.95)",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            {history.length > 0 ? (
              <button
                onClick={handleBack}
                className="group flex items-center gap-3 text-sm font-medium transition-all duration-300 p-3 -ml-1 rounded-xl hover:bg-neutral-100/50 dark:hover:bg-black/10"
                onMouseEnter={(e) =>
                  gsap.to(e.currentTarget.querySelector(".back-icon"), {
                    x: -3,
                    duration: 0.3,
                  })
                }
                onMouseLeave={(e) =>
                  gsap.to(e.currentTarget.querySelector(".back-icon"), {
                    x: 0,
                    duration: 0.3,
                  })
                }
              >
                <BsChevronLeft
                  size={20}
                  className="back-icon text-neutral-600 dark:text-neutral-400 group-hover:opacity-80"
                />{" "}
                {/* Icône neutre */}
                <div>
                  <div
                    className="text-xs opacity-60"
                    style={{
                      color: filterSideTextColor
                        ? `${filterSideTextColor}99`
                        : "rgba(0,0,0,0.6)",
                    }}
                  >
                    Retour à
                  </div>
                  <div style={{ color: filterSideTextColor }}>
                    {parentCategoryOfCurrent?.name || "Catégories"}
                  </div>
                </div>
              </button>
            ) : (
              <Link href="/" onClick={handleModalClose} className="block group">
                <Logo className="h-8 w-auto transform group-hover:scale-105 transition-transform duration-300" />
              </Link>
            )}

            <button
              onClick={handleModalClose}
              className="group p-3 text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-200/70 dark:hover:bg-neutral-700/70 rounded-xl transition-all duration-300"
              aria-label="Fermer le menu"
              onMouseEnter={(e) =>
                gsap.to(e.currentTarget, {
                  rotate: 90,
                  scale: 1.1,
                  duration: 0.3,
                  ease: "back.out(1.2)",
                })
              }
              onMouseLeave={(e) =>
                gsap.to(e.currentTarget, { rotate: 0, scale: 1, duration: 0.3 })
              }
            >
              <BsX size={24} />
            </button>
          </div>

          <div className="flex-grow p-6 w-full">
            {currentCategoryData ? (
              <div className="mb-6 w-full pb-4 border-b border-neutral-200/30 dark:border-neutral-700/30">
                <button
                  // href={`/categorie/${currentCategoryData.slug}`}
                  onClick={() => {
                    handleModalClose();
                    navigate(`/categorie/${currentCategoryData.slug}`);
                  }}
                  className="group flex items-center gap-4 p-4 -mx-2 rounded-2xl hover:bg-neutral-100/80 dark:hover:bg-black/20 transition-all duration-300 border border-transparent hover:border-neutral-300/50 dark:hover:border-neutral-600/50"
                >
                  {currentCategoryData.icon?.length > 0 && (
                    <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700 group-hover:scale-110 transition-all duration-300">
                      <ProductMedia
                        mediaList={currentCategoryData.icon}
                        productName={currentCategoryData.name}
                        className="size-6 text-neutral-700 dark:text-neutral-300 group-hover:text-black dark:group-hover:text-white"
                      />
                    </div>
                  )}
                  <div className="flex-1 w-full">
                    <div
                      className="text-lg font-semibold transition-colors duration-300 group-hover:opacity-80"
                      style={{ color: filterSideTextColor }}
                    >
                      Tous les {currentCategoryData.name.toLowerCase()}
                    </div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400 group-hover:opacity-80">
                      Voir toute la collection
                    </div>
                  </div>
                  <HiArrowRight
                    className="text-neutral-400 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-1 transition-all duration-300"
                    size={20}
                  />
                </button>
              </div>
            ) : (
              <div className="mb-6">
                <h2
                  className="sm:text-2xl text-lg font-bold mb-2"
                  style={{ color: filterSideTextColor }}
                >
                  Explorez nos catégories
                </h2>
                <p
                  className="sm:text-lg text-base opacity-70"
                  style={{
                    color: filterSideTextColor
                      ? `${filterSideTextColor}b3`
                      : "rgba(0,0,0,0.7)",
                  }}
                >
                  Découvrez tous nos produits organisés par catégorie
                </p>
              </div>
            )}

            <ul ref={listRef} className="space-y-2">
              {getCurrentCategories().map((category, index) => (
                <li key={category.id}>
                  <div
                    className="group relative flex items-center justify-between p-4 rounded-2xl hover:bg-neutral-100/80 dark:hover:bg-black/20 transition-all duration-300 cursor-pointer border border-transparent hover:border-neutral-200/50 dark:hover:border-neutral-700/50 hover:shadow-lg hover:shadow-neutral-200/20 dark:hover:shadow-black/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (hasSubCategories(category.id)) {
                        handleForward(category.id);
                      } else {
                        navigate(`/categorie/${category.slug}`);
                        handleModalClose();
                      }
                    }}
                    onMouseEnter={() => setHoveredCategory(category.id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                    <div className="relative flex items-center gap-4 flex-1">
                      {category.icon?.length > 0 && (
                        <div
                          className={`rounded-xl transition-all duration-300 ${
                            hoveredCategory === category.id
                              ? "bg-neutral-200/70 dark:bg-neutral-700/70 scale-110"
                              : "bg-neutral-100 dark:bg-neutral-800/80"
                          }`}
                        >
                          <ProductMedia
                            mediaList={category.icon}
                            productName={category.name}
                            className={`sm:size-14 size-11 transition-colors duration-300 ${
                              hoveredCategory === category.id
                                ? "text-black dark:text-white" // Icône contrastée au survol
                                : "text-neutral-600 dark:text-neutral-400"
                            }`}
                          />
                        </div>
                      )}

                      <div className="flex-1">
                        <span
                          className="sm:text-base text-sm font-medium transition-colors duration-300 relative group-hover:opacity-80"
                          style={{ color: filterSideTextColor }}
                        >
                          {category.name}
                          {hoveredCategory === category.id && (
                            <div
                              className="absolute bottom-0 left-0 w-full h-0.5 bg-current transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                              style={{ backgroundColor: filterSideTextColor }} // Soulignement avec la couleur du texte du thème
                            ></div>
                          )}
                        </span>

                        {hasSubCategories(category.id) && (
                          <div
                            className="sm:text-xs text-xs mt-1 opacity-60"
                            style={{
                              color: filterSideTextColor
                                ? `${filterSideTextColor}`
                                : "rgba(0,0,0,0.95)",
                            }}
                          >
                            {
                              categories?.filter(
                                (cat) => cat.parent_category_id === category.id
                              ).length
                            }{" "}
                            sous-catégories
                          </div>
                        )}
                      </div>
                    </div>

                    {hasSubCategories(category.id) && (
                      <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 group-hover:bg-neutral-200/70 dark:group-hover:bg-neutral-700/70 transition-all duration-300">
                        <BsChevronRight
                          size={14}
                          className={`transform transition-all duration-300 ${
                            hoveredCategory === category.id
                              ? "translate-x-0.5 text-black dark:text-white"
                              : "text-neutral-500 dark:text-neutral-400"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="mt-auto sm:p-6 p-0 border-t border-neutral-200/30 dark:border-neutral-700/30 backdrop-blur-xl"
            style={{
              backgroundColor: filterSideBackgroundColor
                ? `${filterSideBackgroundColor}f5`
                : "rgba(255,255,255,0.95)",
            }} // Utilisation de la couleur du thème
          >
            <div className="flex justify-around items-center sm:text-sm text-xs">
              {[
                { href: "/", label: "Boutique", icon: "🛍️" },
                { href: "/profile/", label: "Mon compte", icon: "👤" },
                { href: "/about/", label: "À propos", icon: "ℹ️" },
              ].map((item) => (
                <Link
                  key={item.href}
                  onClick={handleModalClose}
                  href={item.href}
                  className="group flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-neutral-100/50 dark:hover:bg-black/10 transition-all duration-300"
                >
                  <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </span>
                  <span
                    className="sm:text-base text-sm font-medium transition-colors duration-300 group-hover:opacity-80"
                    style={{ color: filterSideTextColor }}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
