import { DisplayPrice, DisplayPriceDetail } from "../../component/DisplayPrice";

import { Product, features } from "../../S1_data";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useCallback, useEffect, useMemo, useState } from "react";
import ColorComponent from "../../component/FeatureProduct/ColorComponent";
import TextComponent from "../../component/FeatureProduct/TextComponent";
import { useproductFeatures } from "../../store/features";
import ButtonValidCart from "../../component/FeatureProduct/ButtonValidCart";
import clsx from "clsx";

export default function Page() {
  const [indexFeature, setIndexFeature] = useState<number>(0);
  const [indexValue, setIndexValue] = useState<number>(0);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [imgIndex, setImgIndex] = useState<number>(0);
  const handleImageClick = (index: number) => {
    if (swiperInstance) {
      swiperInstance.slideTo(index);
      setImgIndex(index);
    }
  };
  const lstType = useproductFeatures((state) => state.lastType);
  const pfeature = useproductFeatures((state) => state.productFeatures);

  useEffect(() => {
    const value = pfeature.get(Product.id)?.get(lstType);
    const featureIndex = features.findIndex(
      (feature) => feature.name === lstType
    );
    if (featureIndex === -1) return;
    const valueIndex = features[featureIndex].values.findIndex(
      (v) => v.text === value
    );
    if (!features[featureIndex].values[valueIndex].views.length) return;
    if (valueIndex === -1) return;
    setIndexFeature(featureIndex);
    setIndexValue(valueIndex);
  }, [pfeature, lstType]);

  return (
    <div className="bg-white w-full min-h-dvh pt-10 font-primary">
      <div className="flex justify-center h-full items-center  gap-10">
        <div className="flex  h-full">
          <div className=" flex  h-full">
            <div className="flex flex-col justify-start gap-y-3 overflow-y-scroll scrollbar-hide items-end max-h-[50dvh] w-full">
              {features[indexFeature]?.values[indexValue]?.views.map(
                (v, index) => {
                  return (
                    <div
                      key={index}
                      className={clsx("p-1 mx-1 border rounded-md", {
                        'border-2 border-blue-300': imgIndex === index,
                        "border-gray-300": imgIndex !== index,
                      })}
                    >
                      <img
                        loading="lazy"
                        src={v}
                        alt={v}
                        className="size-18 cursor-pointer"
                        onClick={() => handleImageClick(index)}
                      />
                    </div>
                  );
                }
              )}
            </div>
          </div>
          <div className=" h-full min-w-[500px] max-w-[500px] bg-blue-50">
            <Swiper
              modules={[A11y, Navigation, Pagination]}
              spaceBetween={5}
              lazyPreloadPrevNext={1}
              navigation
              pagination={{ clickable: true, dynamicBullets: true }}
              slidesPerView={1}
              autoHeight={true}
              mousewheel={true}
              className="flex justify-center items-center"
              onActiveIndexChange={(sw) => {
                setImgIndex(sw.realIndex);
              }}
              onSwiper={setSwiperInstance}
            >
              {features[indexFeature]?.values[indexValue]?.views.map(
                (v, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <img
                        loading="lazy"
                        src={v}
                        alt={v}
                        className="w-full max-h-[50dvh] min-h-[50dvh]"
                      />
                      <div className="swiper-lazy-preloader swiper-lazy-preloader-white" />
                    </SwiperSlide>
                  );
                }
              )}
            </Swiper>
          </div>
        </div>
        <div className="flex h-full border flex-col justify-between items-start px-1">
          <div>
            <h1 className="text-clamp-md pt-4 pb-1 font-bold">
              {Product.name}
            </h1>
            <h1 className="text-clamp-xs font-primary mb-2">
              {Product.description}
            </h1>
            <DisplayPriceDetail product={Product} />
          </div>
          <div className="mt-6 flex flex-col gap-4">
            {features.map((feature, index) => {
              return (
                <div key={index}>
                  <h1 className="text-clamp-base">
                    {feature.required ? "Selectionne " : ""}
                    {feature.name}:
                  </h1>
                  <div className="flex items-center justify-start overflow-x-auto gap-1 scrollbar-thin my-0">
                    {feature.type === "Color" && (
                      <ColorComponent
                        feature={feature}
                        productId={Product.id}
                      />
                    )}
                    {feature.type === "Text" && (
                      <TextComponent feature={feature} productId={Product.id} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <ButtonValidCart features={features} productId={Product.id} />
        </div>
      </div>
    </div>
  );
}
