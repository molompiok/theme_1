import React, { useMemo, useState } from "react";
import { ButtonValidCart } from "./../Button";
import { TextComponent } from "./../FeatureDetailProduct/TextComponent";
import { ColorComponent } from "./../FeatureDetailProduct/ColorComponent";
import { DisplayPriceDetail } from "./../DisplayPrice";
import Modal from "./Modal";
import { BsX } from "react-icons/bs";
import {
  useproductFeatures,
  useProductSelectFeature,
} from "../../store/features";
import { useQuery } from "@tanstack/react-query";
import { get_features_with_values } from "../../api/products.api";
import { Feature, ProductClient } from "../../pages/type";
import Loading from "../Loading";
import clsx from "clsx";
import { ProductMedia } from "../ProductMedia";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { RxReset } from "react-icons/rx";

export default function ModalChooseFeature() {
  const {
    productSelected: product,
    isVisible,
    setFeatureModal,
  } = useProductSelectFeature();
  const clear = useproductFeatures((state) => state.clearSelections);
  const selectedFeatures = useproductFeatures((state) => state.selectedFeatures);

  const [imgIndex, setImgIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);

  const handleCloseModal = () => {
    setFeatureModal(false);
    document.body.style.overflow = "auto";
  };

  const handleImageClick = (index: number) => {
    swiperInstance?.slideTo(index);
    setImgIndex(index);
  };

  const {
    data: features = [],
    isLoading,
    isError,
  } = useQuery<Feature[], Error>({
    queryKey: ["get_features_with_values", product?.id],
    queryFn: () => get_features_with_values({ feature_id: product?.id || "" }),
    enabled: !!product?.id,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });

  const mediaViews = useMemo(() => {
    if (!features || !features.length) return ["/img/default_img.gif"]; 

    const colorFeature = features.find((f) => f.type === "color") || features[0];
    const selectedValue = selectedFeatures.get(colorFeature.name);
    const value = colorFeature.values.find((v) => v.text === selectedValue) || colorFeature.values[0];
    return value?.views.length ? value.views : [ ""];
  }, [features, selectedFeatures, product]);

  if (!product || !isVisible) {
    console.log("🚀 ~ ModalChooseFeature ~ isVisible:", isVisible);
    return null;
  }

  return (
    <Modal
      styleContainer="flex items-center justify-center select-none size-full p-2 sm:p-4"
      position="start"
      zIndex={100}
      setHide={handleCloseModal}
      isOpen={isVisible}
      animationName="flip"
      aria-label={`Sélectionner les options pour ${product.name}`}
    >
      <div
        className={clsx(
          "font-primary relative bg-white rounded-2xl shadow-lg  w-full",
          "max-w-[90vw] sm:max-w-[600px] md:max-w-[800px] flex flex-col",
          "md:flex-row md:gap-4 p-3 sm:p-4 md:p-6"
        )}
      >
        <div className=" flex-shrink-0 w-[70%] mx-auto md:w-1/2">
          <div className="relative">
            <Swiper
              modules={[A11y, Pagination]}
              spaceBetween={10}
              slidesPerView={1}
              autoHeight={true}
              pagination={{ clickable: true, dynamicBullets: true }}
              onSwiper={setSwiperInstance}
              onSlideChange={(swiper) => setImgIndex(swiper.realIndex)}
              className="rounded-md overflow-hidden"
            >
              {mediaViews.map((view, index) => (
                <SwiperSlide key={index}>
                  <ProductMedia
                    mediaList={[view]}
                    productName={product.name}
                    className="sm:w-full  mx-auto aspect-square object-contain"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          {/* <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {mediaViews.map((view, index) => (
              <button
                key={index}
                className={clsx(
                  "p-1 border-2 rounded-md flex-shrink-0 transition-all  duration-300 ease-out",
                  "size-14",
                  {
                    // "hover:border-gray-400 hover:scale-105": imgIndex !== index,
                    "border-gray-800": imgIndex === index,
                    "border-gray-200 hover:border-gray-400": imgIndex !== index,
                  }
                )}
                onClick={() => handleImageClick(index)}
              >
                <ProductMedia
                  mediaList={[view]}
                  productName={product.name}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div> */}
        </div>

        <div className="flex-1 flex flex-col gap-1 p-2 sm:p-0">
          <button
            onClick={handleCloseModal}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1 rounded-full hover:bg-gray-100 transition-colors z-10 md:top-4 md:right-4"
            aria-label="Fermer la modale"
          >
            <BsX size={24} className="text-gray-600 size-9" />
          </button>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12">
              <Loading size="medium" aria-label="Chargement des options" />
              <p className="mt-2 text-gray-600">Chargement des options...</p>
            </div>
          ) : isError || !features.length ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
              <h1 className="text-lg sm:text-xl text-gray-700">Options indisponibles</h1>
              <p className="text-gray-500 mt-2 text-sm sm:text-base">
                Désolé, nous n'avons pas pu charger les options.
              </p>
              <button
                onClick={handleCloseModal}
                className="mt-4 text-blue-600 hover:text-blue-800 underline text-sm sm:text-base"
              >
                Retourner à la boutique
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1 overflow-auto max-h-[50dvh] sm:max-h-[60dvh]">
              <div className="space-y-0 sm:space-y-2">
                <h1 className="sm:text-base text-sm md:text-2xl font-bold text-gray-800 leading-tight">
                  {product.name}
                </h1>
                {/* <p className="text-gray-600 text-xs/4 sm:text-sm/4 sm:inline hidden md:text-base line-clamp-1">
                  {product.description}
                </p> */}
                <DisplayPriceDetail currency={product.currency} price={product.price} />
              </div>
              <div className="flex-1 overflow-y-auto max-h-[35vh] sm:max-h-[40vh] md:max-h-[50vh] space-y-2 pr-2 scrollbar-thin">
                <button
                  onClick={clear}
                  className={clsx(
                    "flex cursor-pointer transition-opacity duration-300",
                    {
                      "opacity-0 pointer-events-none": selectedFeatures.size === 0,
                      "opacity-100": selectedFeatures.size !== 0,
                    }
                  )}
                >
                  <span className="text-xs/3 cursor-pointer text-gray-500">Remettre à zéro</span>
                  <RxReset className="text-gray-500"/>
                </button>
                {features.map((feature) => (
                  <div key={feature.id || feature.name} className="space-y-0">
                    <h3 className="capitalize font-semibold text-gray-700 text-xs sm:text-sm md:text-base flex items-center">
                      {feature.name}
                      {feature.required && (
                        <span className="text-red-500 ml-1 text-[10px] sm:text-xs md:text-sm">*</span>
                      )}
                    </h3>
                    {renderFeatureComponent(feature, product.id)}
                  </div>
                ))}
              </div>
              <div className="space-y-2 sm:space-y-3">
                <ButtonValidCart features={features} product={product} />
                <button
                  onClick={handleCloseModal}
                  className="text-gray-600 text-xs sm:text-sm hover:text-gray-800 underline w-full text-center transition-colors"
                >
                  Continuer mes achats
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

const renderFeatureComponent = (feature: Feature, product_id: string) => {
  const componentProps = {
    values: feature.values,
    feature_name: feature.name,
    feature_required: feature.required,
    product_id,
  };

  switch (feature.type) {
    case "color":
      return <ColorComponent {...componentProps} />;
    case "text":
      return <TextComponent {...componentProps} />;
    default:
      return (
        <p className="text-gray-500 text-sm italic">
          Type de caractéristique non pris en charge
        </p>
      );
  }
};