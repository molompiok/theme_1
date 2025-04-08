import { useState } from "react";
import { ButtonValidCart } from "./../Button";
import { DisplayPriceDetail } from "./../DisplayPrice";
import Modal from "./Modal";
import { BsX } from "react-icons/bs";
import {
  useProductSelectFeature
} from "../../store/features";
import { useQuery } from "@tanstack/react-query";
import { get_features_with_values } from "../../api/products.api";
import { Feature } from "../../pages/type";
import Loading from "../Loading";
import clsx from "clsx";
import { ProductMedia } from "../ProductMedia";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { RenderFeatureComponent } from "../product/RenderFeatureComponent";
import FavoriteButton from "../FavoriteButton";
import { BiShareAlt } from "react-icons/bi";
import { useMedia } from "../../hook/useMedia";

export default function ModalChooseFeature() {
  const {
    productSelected: product,
    isVisible,
    setFeatureModal,
  } = useProductSelectFeature();

  const [imgIndex, setImgIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);

  const handleCloseModal = () => {
    setFeatureModal(false);
  };

  const {
    data: features = [],
    isLoading,
    isError,
  } = useQuery<Feature[], Error>({
    queryKey: ["get_features_with_values", product?.id],
    queryFn: () => get_features_with_values({ product_id: product?.id || "" }),
    enabled: !!product?.id,
    placeholderData: (previousData) => previousData,
  });
  
  const mediaViews = useMedia(features);

  return (
    <Modal
      styleContainer="flex items-end min-[500px]:items-center justify-center select-none size-full"
      zIndex={100}
      setHide={handleCloseModal}
      animationName="translateBottom"
      isOpen={isVisible}
      aria-label={`Sélectionner les options pour ${product?.name || ""}`}
    >
      <div
        className={clsx(
          "bg-white rounded-lg overflow-hidden shadow-xl w-full max-w-[95vw] sm:max-w-2xl",
          "flex flex-col sm:flex-row max-h-[70dvh] min-h-[50dvh]"
        )}
      >
       <div className="w-full sm:w-7/13 shrink-0 bg-gray-50 p-2 sm:p-4 relative">
          <FavoriteButton product_id={product?.id || ""} />
          <BiShareAlt onClick={() => {}} className="text-gray-500 text-2xl absolute z-50 left-2 top-2 cursor-pointer" />
          <div className="w-full h-auto">
            <Swiper
              modules={[A11y, Pagination]}
              spaceBetween={5}
              slidesPerView={1}
              pagination={{ clickable: true, dynamicBullets: true }}
              onSwiper={setSwiperInstance}
              onSlideChange={(swiper) => setImgIndex(swiper.realIndex)}
              className="rounded-md overflow-hidden w-full"
            >
              {mediaViews.map((view, index) => (
                <SwiperSlide key={index} className="w-full">
                  <div className="w-full aspect-square flex items-center justify-center bg-white">
                    <ProductMedia
                      mediaList={[...new Set([view, ...mediaViews])]}
                      productName={product?.name || ""}
                      showFullscreen={true}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="hidden gap-1 sm:flex justify-center mt-1 overflow-x-auto scrollbar-hidden">
            {mediaViews.map((view, index) => (
              <button
                key={index}
                className={clsx(
                  "flex-shrink-0 rounded-md border transition-all duration-200",
                  "w-6 h-6 sm:w-10 sm:h-10",
                  imgIndex === index
                    ? "border-blue-500 border-2"
                    : "border-gray-200 hover:border-gray-400"
                )}
                onClick={() => swiperInstance?.slideTo(index)}
              >
                <ProductMedia
                  mediaList={[view]}
                  productName={product?.name || ""}
                  className="w-full h-full object-cover rounded-md"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col sm:max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-2 border-b border-gray-200 shrink-0">
            <div>
              <h1 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-1">
                {product?.name || ""}
              </h1>
              <DisplayPriceDetail
                currency={product?.currency || ""}
                price={product?.price || 0}
                barred_price={product?.barred_price || 0}
              />
            </div>
            <button
              onClick={handleCloseModal}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Fermer la modale"
            >
              <BsX size={25} className="text-gray-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loading size="medium" aria-label="Chargement des options" />
              </div>
            ) : isError || !features.length ? (
              <div className="flex flex-col items-center justify-center text-center gap-3 py-6">
                <h2 className="text-sm font-medium text-gray-700">
                  Options indisponibles
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Retourner à la boutique
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                {features.map((feature) => (
                  <div key={feature.id || feature.name} className="space-y-1">
                    <RenderFeatureComponent features={features} feature={feature} product_id={product?.id || ""} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-2 border-t border-gray-200 shrink-0 bg-gray-50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <ButtonValidCart features={features} product={product} />
            </div>
            <button
              onClick={handleCloseModal}
              className="w-full text-sm text-gray-600 hover:text-gray-800 underline mt-2 text-center transition-colors"
            >
              Continuer les achats
            </button>
          </div>
        </div> 
      </div>
    </Modal>
  );
}