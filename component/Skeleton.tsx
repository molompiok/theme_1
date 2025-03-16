import React from "react";
import clsx from "clsx";

type SkeletonProps = {
  type: "product-list" | "product-detail" | "card" | "table" | "custom"; // Type de contenu
  count?: number; // Nombre d'éléments pour les listes
  width?: string | number; // Largeur globale
  height?: string | number; // Hauteur globale
  color?: string; // Couleur de fond
  className?: string; // Classes supplémentaires
  ariaLabel?: string; // Accessibilité
  customLayout?: React.ReactNode; // Layout personnalisé pour type="custom"
};

export default function Skeleton({
  type,
  count = 1,
  width = "100%",
  height = "auto",
  color = "gray-200",
  className,
  ariaLabel = "Chargement en cours",
  customLayout,
}: SkeletonProps) {
  const computedStyles = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  // Skeleton de base
  const BaseSkeleton = ({
    w,
    h,
    shape = "rect",
    extraClass = "",
  }: {
    w: string | number;
    h: string | number;
    shape?: "rect" | "circle";
    extraClass?: string;
  }) => (
    <div
      className={clsx(
        "animate-pulse bg-opacity-70",
        `bg-${color}`,
        shape === "circle" ? "rounded-full" : "rounded-md",
        extraClass
      )}
      style={{
        width: typeof w === "number" ? `${w}px` : w,
        height: typeof h === "number" ? `${h}px` : h,
      }}
      role="status"
      aria-label={ariaLabel}
    />
  );

  // Skeleton pour une liste de produits
  const ProductListSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col space-y-2 p-4 border border-gray-100 rounded-lg"
        >
          <BaseSkeleton w="100%" h={160} shape="rect" extraClass="mb-2" /> {/* Image */}
          <BaseSkeleton w="70%" h={20} shape="rect" /> {/* Titre */}
          <BaseSkeleton w="40%" h={16} shape="rect" /> {/* Prix */}
          <BaseSkeleton w="90%" h={40} shape="rect" /> {/* Description courte */}
        </div>
      ))}
    </div>
  );

  // Skeleton pour un détail de produit
  const ProductDetailSkeleton = () => (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      {/* Image */}
      <BaseSkeleton w={300} h={300} shape="rect" extraClass="flex-shrink-0" />
      <div className="flex flex-col space-y-4 flex-1">
        {/* Titre */}
        <BaseSkeleton w="60%" h={28} shape="rect" />
        {/* Prix */}
        <BaseSkeleton w="30%" h={24} shape="rect" />
        {/* Description */}
        <BaseSkeleton w="100%" h={80} shape="rect" />
        {/* Options (ex. couleurs, tailles) */}
        <div className="space-y-2">
          <BaseSkeleton w="40%" h={20} shape="rect" /> {/* Label */}
          <div className="flex gap-2">
            <BaseSkeleton w={40} h={40} shape="circle" />
            <BaseSkeleton w={40} h={40} shape="circle" />
            <BaseSkeleton w={40} h={40} shape="circle" />
          </div>
        </div>
        <div className="space-y-2">
          <BaseSkeleton w="40%" h={20} shape="rect" /> {/* Label */}
          <div className="flex gap-2">
            <BaseSkeleton w={60} h={30} shape="rect" />
            <BaseSkeleton w={60} h={30} shape="rect" />
            <BaseSkeleton w={60} h={30} shape="rect" />
          </div>
        </div>
        {/* Bouton ajouter au panier */}
        <BaseSkeleton w="40%" h={40} shape="rect" />
      </div>
    </div>
  );

  // Skeleton pour une carte générique
  const CardSkeleton = () => (
    <div className="flex flex-col space-y-2 p-4 border border-gray-100 rounded-lg">
      <BaseSkeleton w="100%" h={120} shape="rect" extraClass="mb-2" /> {/* Image */}
      <BaseSkeleton w="70%" h={20} shape="rect" /> {/* Titre */}
      <BaseSkeleton w="40%" h={16} shape="rect" /> {/* Sous-titre */}
      <BaseSkeleton w="90%" h={40} shape="rect" /> {/* Contenu */}
    </div>
  );

  // Skeleton pour un tableau
  const TableSkeleton = () => (
    <div className="space-y-2">
      {/* En-tête */}
      <div className="flex gap-2">
        <BaseSkeleton w="20%" h={24} shape="rect" />
        <BaseSkeleton w="20%" h={24} shape="rect" />
        <BaseSkeleton w="20%" h={24} shape="rect" />
        <BaseSkeleton w="20%" h={24} shape="rect" />
        <BaseSkeleton w="20%" h={24} shape="rect" />
      </div>
      {/* Lignes */}
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex gap-2">
          <BaseSkeleton w="20%" h={20} shape="rect" />
          <BaseSkeleton w="20%" h={20} shape="rect" />
          <BaseSkeleton w="20%" h={20} shape="rect" />
          <BaseSkeleton w="20%" h={20} shape="rect" />
          <BaseSkeleton w="20%" h={20} shape="rect" />
        </div>
      ))}
    </div>
  );

  // Rendu en fonction du type
  const renderSkeleton = () => {
    switch (type) {
      case "product-list":
        return <ProductListSkeleton />;
      case "product-detail":
        return <ProductDetailSkeleton />;
      case "card":
        return <CardSkeleton />;
      case "table":
        return <TableSkeleton />;
      case "custom":
        return customLayout || <BaseSkeleton w={width} h={height} />;
      default:
        return <BaseSkeleton w={width} h={height} />;
    }
  };

  return (
    <div
      className={clsx("skeleton-container", className)}
      style={computedStyles}
      role="status"
      aria-label={ariaLabel}
    >
      {renderSkeleton()}
    </div>
  );
} 