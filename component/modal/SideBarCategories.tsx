import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuthStore } from "../../store/user";
import { useQuery } from "@tanstack/react-query";
import { get_categories } from "../../api/categories.api";
import { Link, LinkSideBar } from "../Link";
import {
  BsChevronDown,
  BsChevronLeft,
  BsChevronRight,
  BsX,
} from "react-icons/bs";
import { CiMenuBurger } from "react-icons/ci";
import Modal from "./Modal";
import { Logo } from "../../renderer/Layout";
import { IoMdLink } from "react-icons/io";
import gsap from "gsap";
import { navigate } from "vike/client/router";
import { BASE_URL } from "../../api";
import { ProductMedia } from "../ProductMedia";

export default function SideBarCategories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(
    null
  );
  const [history, setHistory] = useState<string[]>([]);
  const listRef = useRef<HTMLUListElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const user = useAuthStore((state) => state.user);
  useEffect(() => {
    if (listRef.current && isModalOpen) {
      gsap.fromTo(
        listRef.current.children,
        { opacity: 0, x: 20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.3,
          ease: "power2.out",
        }
      );
    }
  }, [currentCategoryId, isModalOpen]);

  useEffect(() => {
    if (backButtonRef.current) {
      if (history.length > 0) {
        gsap.fromTo(
          backButtonRef.current,
          { opacity: 0, scale: 0.4 },
          { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" }
        );
      } else {
        gsap.to(backButtonRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 0.3,
          ease: "back.in(1.7)",
        });
      }
    }
  }, [history]);

  const {
    data: categories,
    isError,
    isPending,
  } = useQuery({
    queryKey: ["get_categories"],
    queryFn: () =>
      get_categories({ store_id: "d3d8dfcf-b84b-49ed-976d-9889e79e6306" }),
    select: (data) => (data.list ? data.list : []),
  });

  if (isPending) {
    return <p>chargement...</p>;
  }

  if (isError || !categories) {
    return <></>;
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
        ? !cat.parent_category_id
        : cat.parent_category_id === currentCategoryId
    );
  };

  const hasSubCategories = (categoryId: string) => {
    return categories?.some((cat) => cat.parent_category_id === categoryId);
  };

  const handleForward = (categoryId: string) => {
    if (listRef.current) {
      gsap.to(listRef.current.children, {
        opacity: 0,
        x: -20,
        duration: 0.2,
        stagger: 0.1,
        onComplete: () => {
          setHistory((prev) => [...prev, currentCategoryId || "root"]);
          setCurrentCategoryId(categoryId);
        },
      });
    }
  };

  const handleBack = () => {
    if (listRef.current) {
      gsap.to(listRef.current.children, {
        opacity: 0,
        x: 20,
        duration: 0.2,
        stagger: 0.1,
        onComplete: () => {
          const newHistory = [...history];
          const previousId = newHistory.pop();
          setHistory(newHistory);
          setCurrentCategoryId(
            previousId === "root" ? null : previousId || null
          );
        },
      });
    }
  };
  const currentCategory = categories.find(
    (cat) => cat.id === currentCategoryId
  );

  const parentCategories = categories?.filter((cat) => !cat.parent_category_id);
  const shouldShowModal = parentCategories?.length ?? 0 > 2;
  return (
    <>
      <ul className="hidden lg:flex flex-wrap gap-1 px-4">
        {parentCategories
          ?.slice(0, shouldShowModal ? 2 : parentCategories?.length)
          .map((category) => (
            <li
              key={category.id}
              onMouseEnter={(e) =>
                gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2 })
              }
              onMouseLeave={(e) =>
                gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })
              }
            >
              <Link
                href={`/categorie/${category.slug}`}
                className=" px-3 py-2 font-semibold transition-colors"
              >
                <div className="flex gap-2 items-center">
                  {category.icon?.length > 0 && (
                    <ProductMedia mediaList={category.icon} productName={category.name} className="size-7 rounded-md" />
                  )}
                  <div>{category.name}</div>
                </div>
              </Link>
            </li>
          ))}
        {shouldShowModal ? (
          <li
            className="hidden lg:block"
            onMouseEnter={(e) =>
              gsap.to(e.currentTarget, {
                scale: 1.1,
                y : 8,
                // rotate: 90,
                duration: 0.4,
              })
            }
            onMouseLeave={(e) =>
              gsap.to(e.currentTarget, { scale: 1, y : 0 , duration: 0.4})
            }
          >
            <button onClick={handleModalOpen} className="px-2 pt-2 cursor-pointer">
              <BsChevronDown size={24} color="black" className="" />
            </button>
          </li>
        ) : null}
      </ul>
      <div
        className="lg:hidden px-4"
        onMouseEnter={(e) =>
          gsap.to(e.currentTarget, { scale: 1.1, duration: 0.2 })
        }
        onMouseLeave={(e) =>
          gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })
        }
      >
        <CiMenuBurger
          className="cursor-pointer"
          size={35}
          color="black"
          onClick={handleModalOpen}
        />
      </div>

      <Modal
        styleContainer="flex items-center select-none size-full justify-start"
        position="start"
        zIndex={100}
        setHide={handleModalClose}
        isOpen={isModalOpen}
        animationName="translateBottom"
      >
        <div className="font-primary relative bg-white min-h-dvh w-full overflow-auto sm:w-[400px] md:w-[450px] p-4 pt-12">
          <div className="w-full flex text-base flex-col items-center sm:text-lg gap-4 justify-center">
            <Logo />
            <div className="flex gap-5 justify-center flex-wrap text-sm">
              <Link
                onClick={handleModalClose}
                href="/"
                className="hover:font-semibold"
              >
                Boutique
              </Link>
              <Link
                onClick={handleModalClose}
                href="/profile/"
                className="hover:font-semibold"
              >
                Mon compte
              </Link>
              <Link
                onClick={handleModalClose}
                href="/about/"
                className="hover:font-semibold"
              >
                A propos
              </Link>
            </div>
          </div>
          <BsX
            size={37}
            onClick={handleModalClose}
            className="absolute top-3 right-4 cursor-pointer"
            onMouseEnter={(e) =>
              gsap.to(e.currentTarget, {
                rotate: 0,
                duration: 0.3,
                color: "black",
              })
            }
            onMouseLeave={(e) =>
              gsap.to(e.currentTarget, {
                rotate: -180,
                duration: 0.3,
                color: "gray",
              })
            }
          />
          <div className="mt-8">
            <div className="flex items-center gap-4 mb-2">
              {history.length > 0 && (
                <button
                  ref={backButtonRef}
                  onClick={handleBack}
                  className="flex items-center gap-2 text-gray-600 hover:text-black"
                  onMouseEnter={(e) =>
                    gsap.to(e.currentTarget, { scale: 1.1, duration: 0.2 })
                  }
                  onMouseLeave={(e) =>
                    gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })
                  }
                >
                  <BsChevronLeft size={24} />
                  <span className="hidden cursor-pointer text-xs sm:inline">
                    Retour
                  </span>
                </button>
              )}
            </div>

            <ul ref={listRef} className="flex flex-col gap-4">
              {currentCategory ? (
                <LinkSideBar
                  onClick={() => {
                    navigate(`/categorie/${currentCategory?.slug}`);
                    handleModalClose();
                  }}
                  className="flex underline-animation text-left sm:text-lg mt-4 transition-colors"
                >
                  <div className="flex items-center">
                    {currentCategory.icon?.length > 0 && (
                      <ProductMedia mediaList={currentCategory.icon} productName={currentCategory.name} className="size-9 rounded-md text-gray-600" />
                    )}
                    <span className="text-[1.15rem] ml-4 font-semibold sm:text-lg">
                      Tous {currentCategory?.name}
                    </span>
                  </div>
                </LinkSideBar>
              ) : null}

              {getCurrentCategories().map((category) => (
                <li
                  key={category.id}
                  className="border-b border-b-black/40 pb-3"
                  onMouseEnter={(e) =>
                    gsap.to(e.currentTarget, { x: 3, duration: 0.4 })
                  }
                  onMouseLeave={(e) =>
                    gsap.to(e.currentTarget, { x: 0, duration: 0.4 })
                  }
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      hasSubCategories(category.id) &&
                        handleForward(category.id);
                    }}
                    className="flex cursor-pointer items-center justify-between"
                  >
                    <LinkSideBar
                      onClick={() => {
                        if (!hasSubCategories(category.id)) {
                          navigate(`/categorie/${category.slug}`);
                          handleModalClose();
                        } else {
                          handleForward(category.id);
                        }
                      }}
                      className="flex items-center text-base sm:text-lg  transition-colors"
                    >
                      {category.icon?.length > 0 && (
                        <ProductMedia mediaList={category.icon} productName={category.name} className="size-8 rounded-md text-gray-600" />
                      )}
                      <span className="text-[1.15rem] ml-3 font-semibold sm:text-lg">{category.name}</span>
                    </LinkSideBar>
                    {hasSubCategories(category.id) && (
                      <button
                        onClick={() => handleForward(category.id)}
                        className="cursor-pointer"
                        onMouseEnter={(e) =>
                          gsap.to(e.currentTarget, {
                            scale: 1.1,
                            x: 5,
                            duration: 0.2,
                          })
                        }
                        onMouseLeave={(e) =>
                          gsap.to(e.currentTarget, {
                            scale: 1,
                            x: 0,
                            duration: 0.2,
                          })
                        }
                      >
                        <BsChevronRight size={20} color="black" />
                      </button>
                    )}
                  </div>
                  {/* {category.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {category.description}
                    </p>
                  )} */}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>
    </>
  );
}
