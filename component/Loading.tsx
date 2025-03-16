import React, { useMemo } from "react";
import clsx from "clsx";

interface LoadingProps {
  size?: "small" | "medium" | "large" | "xl" | number;
  color?: string;
  className?: string; 
  ariaLabel?: string;
}

export default function Loading({
  size = "medium",
  color = "neutral-500",
  className,
  ariaLabel = "Chargement en cours",
}: LoadingProps) {
  const sizeStyles = useMemo(() => {
    if (typeof size === "number") {
      return { width: `${size}px`, height: `${size}px`, borderWidth: `${Math.max(2, size / 8)}px` };
    }
    switch (size) {
      case "small":
        return "w-6 h-6 border-2";
      case "medium":
        return "w-8 h-8 border-3";
      case "large":
        return "w-10 h-10 border-4";
      case "xl":
        return "w-12 h-12 border-4";
      default:
        return "w-8 h-8 border-3"; 
    }
  }, [size]);

  const styles = clsx(
    "rounded-full border-t-transparent animate-spin",
    `border-${color}`,
    sizeStyles,
    className 
  );

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div
        className={styles}
        style={typeof size === "number" && typeof sizeStyles === "object" ? sizeStyles : undefined}
        role="status"
        aria-label={ariaLabel}
      />
    </div>
  );
}