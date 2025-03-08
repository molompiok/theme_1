/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PropsWithChildren } from "react";
import { useEffect, useRef, useCallback } from "react";
import { twMerge } from "tailwind-merge";

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
} as const;

export default function Modal({
  isOpen,
  children,
  styleContainer,
  animationName = "zoom",
  setHide,
  position = "center",
  zIndex = 50,
}: PropsWithChildren<{
  isOpen: boolean;
  styleContainer?: string;
  animationName?: keyof typeof animation;
  setHide: () => void;
  position?: "start" | "end" | "center";
  zIndex?: number;
}>) {
  const hasPushedState = useRef(false);

  const handlePopState = useCallback((event: any) => {
    if (event.state?.modalOpen) {
      setHide();
      window.history.back();
    }
  }, [setHide]);

  useEffect(() => {
    if (isOpen) {
      if (!hasPushedState.current) {
        window.history.pushState({ modalOpen: true }, "");
        hasPushedState.current = true;
      }
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
      hasPushedState.current = false;
    };
  }, [isOpen, handlePopState]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={twMerge(
        "fixed inset-0 flex bg-black/70 duration-700 ease-in-out",
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
          "relative transition-all duration-500 ease-in-out",
          position === "start"
            ? "justify-start"
            : position === "end"
            ? "justify-end"
            : "justify-center",
          styleContainer,
          isOpen ? animation[animationName][0] : animation[animationName][1]
        )}
      >
        {children}
      </div>
    </div>
  );
}
