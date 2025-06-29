import React from "react";

export function Tooltip({
    children,
    label,
    position = "top",
}: {
    children: React.ReactNode;
    label: string;
    position?: "top" | "bottom" | "left" | "right";
}) {
    return (
        <div className="relative group inline-block">
            {children}
            <div
                className={`
          absolute z-50 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded
          opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none
          ${position === "top"
                        ? "-top-8 left-1/2 -translate-x-1/2"
                        : position === "bottom"
                            ? "top-full mt-2 left-1/2 -translate-x-1/2"
                            : position === "left"
                                ? "right-full mr-2 top-1/2 -translate-y-1/2"
                                : "left-full ml-2 top-1/2 -translate-y-1/2"
                    }
        `}
            >
                {label}
            </div>
        </div>
    );
}
