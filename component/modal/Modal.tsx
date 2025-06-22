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
  enableBackButton = true, // Nouvelle prop pour contrôler le comportement du bouton retour
}: PropsWithChildren<{
  isOpen: boolean;
  styleContainer?: string;
  animationName?: keyof typeof animation;
  backdropAnimation?: keyof typeof animation;
  setHide: () => void;
  position?: "start" | "end" | "center";
  zIndex?: number;
  enableBackButton?: boolean;
}>) {
  const modalRef = useRef<HTMLDivElement>(null);
  const hasAddedHistoryEntry = useRef(false);
  const isHandlingBack = useRef(false);

  useEffect(() => {
    if (!isOpen || !enableBackButton) {
      hasAddedHistoryEntry.current = false;
      isHandlingBack.current = false;
      return;
    }

    if (!hasAddedHistoryEntry.current) {
      hasAddedHistoryEntry.current = true;
      const currentState = window.history.state;
      const currentUrl = window.location.href;

      window.history.replaceState({ ...currentState, hasModal: false }, "", currentUrl);
      window.history.pushState({ ...currentState, hasModal: true }, "", currentUrl);
    }

    const handlePopState = (event: PopStateEvent) => {
      if (hasAddedHistoryEntry.current && !isHandlingBack.current) {
        isHandlingBack.current = true;

        event.preventDefault();
        event.stopPropagation();

        setHide();

        setTimeout(() => {
          isHandlingBack.current = false;
          hasAddedHistoryEntry.current = false;
        }, 100);
      }
    };

    window.addEventListener("popstate", handlePopState, true);

    return () => {
      window.removeEventListener("popstate", handlePopState, true);
    };
  }, [isOpen, setHide, enableBackButton]);

  // Nettoyer l'historique quand la modal se ferme normalement (pas via bouton retour)
  useEffect(() => {
    if (!isOpen && hasAddedHistoryEntry.current && !isHandlingBack.current && enableBackButton) {
      // Revenir en arrière pour nettoyer l'historique
      window.history.back();
      hasAddedHistoryEntry.current = false;
    }
  }, [isOpen, enableBackButton]);

  // Gestion du focus et des raccourcis clavier
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
      data-is-open={isOpen}
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