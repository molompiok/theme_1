import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Pagination } from 'swiper/modules';
import clsx from 'clsx';
import FavoriteButton from '../FavoriteButton';
import { ProductMedia } from '../ProductMedia';
import { useMedia } from '../../hook/useMedia';
import { Feature, ProductClient } from '../../pages/type';

interface ProductGalleryProps {
  features: Feature[] | undefined;
  product: ProductClient;
  imgIndex: number;
  setSwiperInstance: (instance: any) => void;
  handleImageClick: (index: number) => void;
  isPendingFeatures: boolean;
  setImgIndex: React.Dispatch<React.SetStateAction<number>>;
}

// Composant pour l'indicateur de chargement
const ImageLoader = ({ className }: { className?: string }) => (
  <div className={clsx("flex items-center justify-center bg-gray-100 animate-pulse", className)}>
    <div className="flex flex-col items-center gap-2">
      <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
      <span className="text-xs text-gray-500">Chargement...</span>
    </div>
  </div>
);

// Composant pour une image avec état de chargement
const ImageWithLoader = ({
  children,
  className,
  onLoad
}: {
  children: React.ReactNode;
  className?: string;
  onLoad?: () => void;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setIsError(true);
    setIsLoaded(true);
  };

  return (
    <div className={clsx("relative", className)}>
      {!isLoaded && !isError && (
        <ImageLoader className="absolute inset-0 z-10" />
      )}
      {isError && (
        <div className={clsx("flex items-center justify-center bg-gray-100", className)}>
          <div className="text-center">
            <div className="text-gray-400 mb-1">⚠️</div>
            <span className="text-xs text-gray-500">Erreur de chargement</span>
          </div>
        </div>
      )}
      <div
        className={clsx("transition-opacity duration-300", {
          "opacity-0": !isLoaded,
          "opacity-100": isLoaded
        })}
        onLoad={handleLoad}
        onError={handleError}
      >
        {children}
      </div>
    </div>
  );
};

// Composant pour les miniatures
const ThumbnailGallery = ({
  mediaViews,
  imgIndex,
  handleImageClick,
  productName,
  className
}: {
  mediaViews: any[];
  imgIndex: number;
  handleImageClick: (index: number) => void;
  productName: string;
  className?: string;
}) => (
  <div className={clsx("flex gap-2 overflow-x-auto pb-2 scrollbar-thin", className)}>
    {mediaViews?.map((view, index) => (
      <button
        key={index}
        className={clsx(
          "p-1 border-2 rounded-md flex-shrink-0 transition-all duration-200 hover:shadow-md",
          {
            "border-gray-800 shadow-sm": imgIndex === index,
            "border-gray-200 hover:border-gray-400": imgIndex !== index,
          }
        )}
        onClick={() => handleImageClick(index)}
        aria-label={`Voir l'image ${index + 1} de ${productName}`}
      >
        <ImageWithLoader className="size-8 md:size-10 rounded overflow-hidden">
          <ProductMedia
            mediaList={[view]}
            productName={productName}
            shouldHoverVideo={false}
            className="size-8 md:size-10 object-cover"
          />
        </ImageWithLoader>
      </button>
    ))}
  </div>
);

export default function ProductGallery({
  features,
  product,
  imgIndex,
  setSwiperInstance,
  handleImageClick,
  setImgIndex,
  isPendingFeatures
}: ProductGalleryProps) {
  const mediaViews = useMedia(features);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [currentImageLoaded, setCurrentImageLoaded] = useState(false);

  // Réinitialiser l'état de chargement quand l'index change
  useEffect(() => {
    setCurrentImageLoaded(loadedImages.has(imgIndex));
  }, [imgIndex, loadedImages]);

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set([...prev, index]));
    if (index === imgIndex) {
      setCurrentImageLoaded(true);
    }
  };

  // Afficher un loader si les features sont en cours de chargement
  if (isPendingFeatures || !mediaViews?.length) {
    return (
      <div className="flex gap-2">
        <div className="min-[600px]:flex hidden flex-col gap-2">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="p-1 border-2 border-gray-200 rounded-md">
              <ImageLoader className="size-11 md:size-14 rounded" />
            </div>
          ))}
        </div>
        <div className="min-[600px]:size-[80%] size-full">
          <ImageLoader className="w-full aspect-square rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center gap-1">
      <div className="flex min-[600px]:gap-2 gap-0.5">
        {/* Image principale */}
        <div className="flex  min-[600px]:size-[75%] ml-auto size-full relative">
          <FavoriteButton
            product_id={product.id}
            className="absolute top-3 right-4 z-20"
            size={32}
          />

          {/* Indicateur de chargement pour l'image principale */}
          {!currentImageLoaded && (
            <div className="absolute inset-0 z-10 rounded-lg overflow-hidden">
              <ImageLoader className="w-full h-full" />
            </div>
          )}

          <Swiper
            modules={[A11y, Pagination]}
            spaceBetween={10}
            slidesPerView={1}
            pagination={{
              clickable: true,
              dynamicBullets: true,
              bulletClass: 'swiper-pagination-bullet',
              bulletActiveClass: 'swiper-pagination-bullet-active'
            }}
            onSwiper={setSwiperInstance}
            onSlideChange={(swiper) => setImgIndex(swiper.realIndex)}
            className="rounded-lg overflow-hidden"
            style={{
              '--swiper-pagination-color': '#374151',
              '--swiper-pagination-bullet-inactive-color': '#9CA3AF',
              '--swiper-pagination-bullet-inactive-opacity': '0.5'
            } as React.CSSProperties}
          >
            {mediaViews.map((view, index) => (
              <SwiperSlide key={index}>
                <ImageWithLoader
                  className="w-full aspect-square"
                  onLoad={() => handleImageLoad(index)}
                >
                  <ProductMedia
                    mediaList={[...new Set([view, ...mediaViews])]}
                    showFullscreen={true}
                    shouldHoverVideo={false}
                    productName={product.name}
                    className="w-full aspect-square object-contain"
                  />
                </ImageWithLoader>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="min-[600px]:flex hidden mx-auto flex-col">
          <ThumbnailGallery
            mediaViews={mediaViews}
            imgIndex={imgIndex}
            handleImageClick={handleImageClick}
            productName={product.name}
            className="flex-col gap-2"
          />
        </div>
      </div>

      {/* Miniatures sur mobile (en bas) */}
      <div className="min-[600px]:hidden block">
        <ThumbnailGallery
          mediaViews={mediaViews}
          imgIndex={imgIndex}
          handleImageClick={handleImageClick}
          productName={product.name}
          className="justify-center"
        />
      </div>
    </div>
  );
}

interface ProductDetailsProps {
  product: ProductClient;
  features: Feature[] | undefined;
}