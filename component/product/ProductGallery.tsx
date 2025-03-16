import React from 'react'
import { Feature, ProductClient } from '../../pages/type';
import FavoriteButton from '../FavoriteButton';
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { ProductMedia } from '../ProductMedia';
import clsx from 'clsx';
interface ProductGalleryProps {
  features: Feature[] | undefined;
  product: ProductClient;
  indexValue: number;
  imgIndex: number;
  setSwiperInstance: (instance: any) => void;
  handleImageClick: (index: number) => void;
  setImgIndex: React.Dispatch<React.SetStateAction<number>>;
}

export default function ProductGallery({
    features,
    product,
    indexValue,
    imgIndex,
    setSwiperInstance,
    handleImageClick,
    setImgIndex,
  }: ProductGalleryProps) {
    const mediaViews =
      features?.find((f) => f.id === product.default_feature_id)?.values[
        indexValue
      ]?.views || [];
  
    return (
      <div className="relative space-y-1">
        <div className="relative">
          <FavoriteButton product_id={product.id} />
          <Swiper
            modules={[A11y, Pagination]}
            spaceBetween={10}
            slidesPerView={1}
            pagination={{ clickable: true, dynamicBullets: true }}
            onSwiper={setSwiperInstance}
            onSlideChange={(swiper) => setImgIndex(swiper.realIndex)}
            className="rounded-lg overflow-hidden"
          >
            {mediaViews.map((view, index) => (
              <SwiperSlide key={index}>
                <ProductMedia
                  mediaList={[view]}
                  productName={product.name}
                  className="w-full aspect-square object-contain"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {mediaViews.map((view, index) => (
            <button
              key={index}
              className={clsx("p-1 border-2 rounded-md flex-shrink-0", {
                "border-gray-800": imgIndex === index,
                "border-gray-200": imgIndex !== index,
              })}
              onClick={() => handleImageClick(index)}
            >
              <ProductMedia
                mediaList={[view]}
                productName={product.name}
                className="w-14 h-14 md:w-16 md:h-16 object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    );
  }