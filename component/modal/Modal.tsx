import type { PropsWithChildren } from "react";
import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { createPortal } from "react-dom";

const animation = {
  zoom: ["scale-100", "scale-0"],
  fade: ["opacity-100", "opacity-0"],
  translateRight: ["translate-x-0", "translate-x-full"],
  translateLeft: ["translate-x-0", "-translate-x-full"],
  translateTop: ["translate-y-0", "-translate-y-full"],
  translateBottom: ["translate-y-0", "translate-y-full"],
  rotate: ["rotate-0", "rotate-90"],
  bounce: ["animate-bounce", "animate-none"],
  skew: ["skew-y-0", "skew-y-12"],
  flip: ["rotate-x-0", "rotate-x-180"],
  blur: ["blur-0", "blur-md"],
  backdropScale: ["scale-100", "scale-90"],
} as const;

export default function Modal({
  isOpen,
  children,
  styleContainer,
  animationName = "zoom",
  backdropAnimation = "backdropScale",
  setHide,
  position = "center",
  zIndex = 50,
}: PropsWithChildren<{
  isOpen: boolean;
  styleContainer?: string;
  animationName?: keyof typeof animation;
  backdropAnimation?: keyof typeof animation;
  setHide: () => void;
  position?: "start" | "end" | "center";
  zIndex?: number;
}>) {
  const modalRef = useRef<HTMLDivElement>(null);
  const hasPushedState = useRef(false);

  // Gestion de la fermeture via popstate
  useEffect(() => {
    if (!isOpen || typeof setHide !== "function") return;

    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.modalOpen) {
        document.body.style.overflow = "auto";
        setHide();
      }
    };

    if (!hasPushedState.current) {
      window.history.pushState({ modalOpen: true }, "", window.location.href);
      hasPushedState.current = true;
    }
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      if (hasPushedState.current && !isOpen) {
        window.history.back();
      }
      hasPushedState.current = false;
    };
  }, [isOpen, setHide]);

  // Piégeage du focus et gestion de la touche Escape
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      } else if (e.key === "Escape") {
        setHide();
      }
    };

    firstElement?.focus();
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, setHide]);

  if (typeof window === "undefined") return null;

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      ref={modalRef}
      className={twMerge(
        "fixed inset-0 flex bg-black/20 backdrop-blur-[.15rem] transition-all duration-500 ease-in-out",
        position === "start"
          ? "justify-start"
          : position === "end"
          ? "justify-end"
          : "items-center justify-center",
        isOpen
          ? animation[backdropAnimation][0]
          : animation[backdropAnimation][1],
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
      style={{
        zIndex,
        willChange: "transform, opacity",
      }}
      onClick={(e: any) => {
        if (e.target.getAttribute?.("data-outside")) {
          setHide();
        }
      }}
    >
      <div
        data-outside="outside"
        className={twMerge(
          "relative transform transition-all duration-500 ease-in-out",
          isOpen ? animation[animationName][0] : animation[animationName][1],
          styleContainer
        )}
      >
        {children}
      </div>
    </div>
  );

  return createPortal(modalContent, document.getElementById("modal-root") || document.body);
}