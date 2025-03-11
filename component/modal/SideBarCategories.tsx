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
          duration: 0.4,
          stagger: 0.1,
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
    return null;
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
      <ul className="hidden lg:flex flex-wrap gap-4 px-4">
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
                className="flex items-center px-3 py-2 hover:font-semibold transition-colors"
              >
                {category.name}
                {category.icon?.length > 0 && (
                  <span className="ml-2">{category.icon[0]}</span>
                )}
              </Link>
            </li>
          ))}
        {shouldShowModal && (
          <li
            className="hidden lg:block"
            onMouseEnter={(e) =>
              gsap.to(e.currentTarget, {
                scale: 1.2,
                rotate: 90,
                duration: 0.4,
              })
            }
            onMouseLeave={(e) =>
              gsap.to(e.currentTarget, { scale: 1, rotate: 0, duration: 0.4 })
            }
          >
            <button onClick={handleModalOpen} className="p-2 cursor-pointer">
              <BsChevronDown size={24} color="black" className="-rotate-90" />
            </button>
          </li>
        )}
      </ul>
      <div
        className="lg:hidden p-4"
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
        <div className="relative bg-white h-screen w-full sm:w-80 md:w-96 p-6 overflow-y-auto">
          <div className="w-full flex text-base flex-col items-center sm:text-lg font-light gap-4 justify-center">
            <Logo />
            <div className="flex gap-5 justify-center flex-wrap text-sm">
              <Link
                onClick={handleModalClose}
                href="/"
                className="hover:font-semibold"
              >
                Welcome
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
            className="absolute top-2 right-2 cursor-pointer"
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
            <div className="flex items-center gap-4 mb-6">
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
                  {/* <span className="hidden text-xs sm:inline">Retour</span> */}
                </button>
              )}
              <h1 className="sm:text-xl underline underline-offset-4">
                {currentCategoryId ? currentCategory?.name : "Les Categories"}
              </h1>
            </div>

            <ul ref={listRef} className="flex flex-col gap-4">
              {currentCategory ? (
                <Link
                  href={`/categorie/${currentCategory?.slug}`}
                  onClick={handleModalClose}
                  className="flex text-base sm:text-lg py-1.5 decoration-blue-500 hover:text-blue-500 transition-colors"
                >
                  Tout {currentCategory?.name}
                  <IoMdLink size={20} className="ml-1 text-gray-700 inline" />
                </Link>
              ) : null}

              {getCurrentCategories().map((category) => (
                <li
                  key={category.id}
                  className="border-b border-b-black/40 pb-3"
                  onMouseEnter={(e) =>
                    gsap.to(e.currentTarget, { x: 1, duration: 0.2 })
                  }
                  onMouseLeave={(e) =>
                    gsap.to(e.currentTarget, { x: 0, duration: 0.2 })
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
                      // href={`/categorie/${category.slug}`}
                      onClick={() => {
                        handleModalClose();
                      }}
                      className="flex text-base sm:text-lg decoration-blue-500 hover:text-blue-500 transition-colors"
                    >
                      {category.name}
                      <IoMdLink
                        size={20}
                        className="ml-1 text-gray-700 inline"
                      />
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
