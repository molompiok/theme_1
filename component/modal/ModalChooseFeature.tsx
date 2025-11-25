import { useState, Suspense, lazy } from "react";
import { ButtonValidCart } from "./../Button";
import { DisplayPriceDetail } from "./../DisplayPrice";
import Modal from "./Modal";
import { BsX } from "react-icons/bs";
import { useProductSelectFeature } from "../../store/features";
import { useQuery } from "@tanstack/react-query";
import { get_features_with_values } from "../../api/products.api";
import { Feature } from "../../pages/type";
import Loading from "../Loading";
import clsx from "clsx";
import { ProductMedia } from "../ProductMedia";
import { RenderFeatureComponent } from "../product/RenderFeatureComponent";
import FavoriteButton from "../FavoriteButton";
import { BiShareAlt } from "react-icons/bi";
import { useMedia } from "../../hook/useMedia";
import { usePageContext } from "vike-react/usePageContext";

// Composant de chargement pour Swiper
const SwiperLoader = ({ className }: { className?: string }) => (
  <div className={clsx("flex items-center justify-center bg-gray-100 animate-pulse", className)}>
    <div className="flex flex-col items-center gap-2">
      <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
      <span className="text-xs text-gray-500">Chargement...</span>
    </div>
  </div>
);

// Composant Swiper avec chargement dynamique
const SwiperModal = lazy(async () => {
  const [{ Swiper, SwiperSlide }, { A11y, Pagination }] = await Promise.all([
    import("swiper/react"),
    import("swiper/modules"),
  ]);
  await Promise.all([
    import("swiper/css"),
    import("swiper/css/pagination"),
  ]);
  
  return {
    default: ({
      mediaViews,
      imgIndex,
      setSwiperInstance,
      setImgIndex,
      product
    }: any) => (
      <Swiper
        modules={[A11y, Pagination]}
        spaceBetween={5}
        slidesPerView={1}
        pagination={{ clickable: true, dynamicBullets: true }}
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper: any) => setImgIndex(swiper.realIndex)}
        className="rounded-md overflow-hidden w-full h-full"
      >
        {mediaViews.length > 0 ? (
          mediaViews.map((view: any, index: number) => (
            <SwiperSlide key={index} className="w-full bg-white">
              <div className="w-full aspect-square flex items-center justify-center">
                <ProductMedia
                  mediaList={[...new Set([view, ...mediaViews])]}
                  productName={product?.name || ""}
                  showFullscreen={true}
                  className="w-full h-full object-contain"
                />
              </div>
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide className="w-full bg-white">
            <div className="w-full aspect-square flex items-center justify-center text-gray-400">
              Aucune image disponible
            </div>
          </SwiperSlide>
        )}
      </Swiper>
    ),
  };
});

export default function ModalChooseFeature() {
  const {
    productSelected: product,
    isVisible,
    setFeatureModal,
  } = useProductSelectFeature();

  const [imgIndex, setImgIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const { api } = usePageContext()

  const handleCloseModal = () => {
    setFeatureModal(false);
  };

  const {
    data: features = [],
    isLoading,
    isError,
  } = useQuery<Feature[] | undefined, Error>({
    queryKey: ["get_features_with_values", product?.id],
    queryFn: () => get_features_with_values({ product_id: product?.id || "" }, api),
    enabled: !!product?.id,
    placeholderData: (previousData) => previousData,
  });

  const mediaViews = useMedia(features);

  if (!product && isVisible) {
    console.warn(
      "ModalChooseFeature rendered without a product while visible."
    );
    return null;
  }

  const handleShare = () => {
    if (navigator.share && product) {
      navigator
        .share({
          title: product.name,
          text: `Découvrez ${product.name}`,
          url: window.location.href + product.slug,
        })
        .catch(console.error);
    } else {
      alert("Share functionality not available or product not loaded.");
    }
  };

  return (
    <Modal
      styleContainer="flex items-end md:items-center justify-center select-none size-full"
      zIndex={100}
      setHide={handleCloseModal}
      animationName="translateBottom"
      isOpen={isVisible}
      aria-label={`Sélectionner les options pour ${product?.name || "produit"}`}
    >
      <div
        className={clsx(
          "bg-white rounded-t-lg md:rounded-lg overflow-hidden shadow-xl w-full",
          "max-w-full md:max-w-3xl lg:max-w-4xl",
          "flex flex-col max-h-[68dvh] md:max-h-[85vh]"
        )}
      >
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 shrink-0">
          <div>
            <h1 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-1">
              {product?.name || "Chargement..."}
            </h1>
            {product && (
              <DisplayPriceDetail
                product_id={product.id}
                currency={product.currency || ""}
                price={product.price || 0}
                barred_price={product.barred_price || 0}
              />
            )}
          </div>
          <button
            onClick={handleCloseModal}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors" // Increased tappable area
            aria-label="Fermer la modale"
          >
            <BsX size={28} className="text-gray-600" />{" "}
          </button>
        </div>

        <div className="flex-1 flex flex-col min-[450px]:flex-row overflow-hidden">
          <div className="w-full min-[450px]:w-6/10 lg:w-5/10 shrink-0 bg-gray-50 p-3 sm:p-4 relative">
            {product?.id && <FavoriteButton product_id={product.id} />}
            <BiShareAlt
              onClick={handleShare}
              aria-label="Partager le produit"
              role="button"
              size={25}
              className="text-gray-500 bg-gray-200 p-1 text-2xl absolute z-10 right-3 top-3 sm:right-4 sm:top-4 cursor-pointer rounded-full hover:bg-gray-200"
            />

            <div className="w-full h-auto max-h-[20vh] min-[410px]:max-h-[25vh] overflow-hidden flex items-center justify-center">
              <Suspense fallback={<SwiperLoader className="w-full h-full" />}>
                <SwiperModal
                  mediaViews={mediaViews}
                  imgIndex={imgIndex}
                  setSwiperInstance={setSwiperInstance}
                  setImgIndex={setImgIndex}
                  product={product}
                />
              </Suspense>
            </div>
            {mediaViews.length > 1 && (
              <div className="hidden min-[450px]:flex justify-center mt-2 gap-2 overflow-x-auto scrollbar-thin py-1">
                {mediaViews.map((view, index) => (
                  <button
                    key={index}
                    className={clsx(
                      "flex-shrink-0 rounded-md border transition-all duration-200",
                      "w-10 h-10 sm:w-12 sm:h-12", // Slightly larger thumbnails
                      imgIndex === index
                        ? "border-blue-500 border-2 p-0.5"
                        : "border-gray-200 hover:border-gray-400"
                    )}
                    onClick={() => swiperInstance?.slideToLoop(index)}
                    aria-label={`Afficher l'image ${index + 1}`}
                  >
                    <ProductMedia
                      mediaList={[view]}
                      productName={product?.name || ""}
                      className="w-full h-full object-cover rounded" // ensure rounded matches button
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto scrollbar-thin p-3 sm:p-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loading size="medium" aria-label="Chargement des options" />
                </div>
              ) : isError || !features.length ? (
                <div className="flex flex-col items-center justify-center text-center gap-4 py-8">
                  <h2 className="text-base font-medium text-gray-700">
                    Options indisponibles pour ce produit.
                  </h2>
                  <p className="text-sm text-gray-500">
                    Veuillez réessayer plus tard ou choisir un autre article.
                  </p>
                  <button
                    onClick={handleCloseModal}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
                  >
                    Retourner à la boutique
                  </button>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {features.map((feature) => (
                    <div key={feature.id || feature.name} className="space-y-1">
                      <RenderFeatureComponent
                        features={features}
                        feature={feature}
                        product_id={product?.id || ""}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 border-t border-gray-200 shrink-0 bg-gray-50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <ButtonValidCart features={features} product={product} />
          </div>
          <button
            onClick={handleCloseModal}
            className="w-full text-sm text-gray-600 hover:text-gray-800 underline mt-3 text-center transition-colors"
          >
            Continuer les achats
          </button>
        </div>
      </div>
    </Modal>
  );
}
