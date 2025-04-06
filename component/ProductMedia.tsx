import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { BASE_URL } from '../api';
import Loading from './Loading';
import clsx from 'clsx';
import Modal from './modal/Modal';
// Import Swiper components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Zoom } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';

interface ProductMediaProps {
  mediaList: string[];
  productName: string;
  className?: string;
  fallbackImage?: string;
  showNavigation?: boolean;
  showFullscreen?: boolean;
  shouldHoverVideo?: boolean;
}

export function ProductMedia({ 
  mediaList, 
  productName, 
  className = '', 
  fallbackImage = '/img/default_img.gif',
  showNavigation = false,
  shouldHoverVideo = true,
  showFullscreen = false
}: ProductMediaProps) {
  const [currentMedia, setCurrentMedia] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [imgIndex, setImgIndex] = useState<number>(0);

  const handleImageClick = (index: number) => {
    swiperInstance?.slideTo(index);
    setImgIndex(index);
  };


  const VIDEO_EXTENSIONS = useMemo(() => ['.mp4', '.webm', '.ogg'], []);
  const IMAGE_EXTENSIONS = useMemo(() => ['.jpg', '.jpeg', '.png', '.gif', '.webp'], []);
  
  const validMediaList = useMemo(() => {
    return Array.isArray(mediaList) ? 
      mediaList.filter(media => 
        [...VIDEO_EXTENSIONS, ...IMAGE_EXTENSIONS].some(ext => 
          media?.toLowerCase().endsWith(ext)
        )
      ) : [];
  }, [mediaList, VIDEO_EXTENSIONS, IMAGE_EXTENSIONS]);

  const currentSrc = useMemo(() => {
    if (!validMediaList.length || currentMedia >= validMediaList.length) {
      return fallbackImage;
    }
    return `${BASE_URL}${validMediaList[currentMedia]}`;
  }, [validMediaList, currentMedia, fallbackImage]);

  const isVideo = useMemo(() => 
    VIDEO_EXTENSIONS.some(ext => currentSrc.toLowerCase().endsWith(ext)),
    [currentSrc, VIDEO_EXTENSIONS]
  );

  const hasVideo = useMemo(() => 
    validMediaList.some(media => 
      VIDEO_EXTENSIONS.some(ext => media.toLowerCase().endsWith(ext))
    ),
    [validMediaList, VIDEO_EXTENSIONS]
  );


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreenOpen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          handlePrevMedia();
          break;
        case 'ArrowRight':
          handleNextMedia();
          break;
        case 'Escape':
          setIsFullscreenOpen(false);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreenOpen]);

  useEffect(() => {
    setCurrentMedia(0);
    setHasError(false);
  }, [mediaList]);

  useEffect(() => {
    if (validMediaList.length > 1 && currentMedia < validMediaList.length - 1) {
      const nextIndex = currentMedia + 1;
      const nextSrc = `${BASE_URL}${validMediaList[nextIndex]}`;
      if (!VIDEO_EXTENSIONS.some(ext => nextSrc.toLowerCase().endsWith(ext))) {
        const img = new Image();
        img.src = nextSrc;
      }
    }
  }, [currentMedia, validMediaList, VIDEO_EXTENSIONS]);

  const handleMediaError = useCallback(() => {
    setHasError(true);
  }, []);

  const handleMediaLoad = useCallback(() => {
    setHasError(false);
  }, []);

  const handleVideoHover = useCallback(() => {
    if (shouldHoverVideo && hasVideo && !isVideo) {
      const videoIndex = validMediaList.findIndex(media => 
        VIDEO_EXTENSIONS.some(ext => media.toLowerCase().endsWith(ext))
      );
      setCurrentMedia(videoIndex >= 0 ? videoIndex : 0);
      setIsHovering(true);
    }
  }, [hasVideo, isVideo, validMediaList, VIDEO_EXTENSIONS]);

  const handleNextMedia = useCallback(() => {
    if (validMediaList.length > 1) {
      setCurrentMedia(prev => (prev + 1) % validMediaList.length);
 
    }
  }, [validMediaList]);

  const handlePrevMedia = useCallback(() => {
    if (validMediaList.length > 1) {
      setCurrentMedia(prev => (prev - 1 + validMediaList.length) % validMediaList.length);
    }
  }, [validMediaList]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    if (isVideo && isHovering && !isFullscreenOpen) {
      setCurrentMedia(0);
    }
  }, [isVideo, isHovering, isFullscreenOpen]);

  const toggleFullscreen = useCallback(() => {
    if (!showFullscreen) return;
    setIsFullscreenOpen(prev => !prev);
  }, [showFullscreen]);


  if (hasError) {
    return (
      <img
        src={fallbackImage}
        className={`${className} object-cover`}
        alt={`${productName} (fallback)`}
        loading="lazy"
      />
    );
  }

  return (
    <>
      <div 
        className={`relative rounded-md ${className} overflow-hidden`}
        onMouseLeave={handleMouseLeave}
      >
        {/* {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
            <Loading />
          </div>
        )}
         */}
        {isVideo ? (
          <video
            src={currentSrc}
            className={`p-1 rounded-md w-full h-full object-cover ${className}`}
            autoPlay
            muted
            loop
            playsInline
            onClick={toggleFullscreen}
            onError={handleMediaError}
            onLoadedData={handleMediaLoad}
            aria-label={`${productName} video`}
            controls={false}
          />
        ) : (
          <img
            src={currentSrc}
            onMouseEnter={handleVideoHover}
            onClick={toggleFullscreen}
            onError={handleMediaError}
            onLoad={handleMediaLoad}
            className={`w-full h-full object-cover ${className}`}
            alt={productName}
            loading="lazy"
            aria-label={`${productName} image`}
          />
        )}
        
        {showNavigation && validMediaList.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
            {validMediaList.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${currentMedia === index ? 'bg-white' : 'bg-gray-300'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentMedia(index);
                  // setIsLoading(true);
                }}
                aria-label={`View media ${index + 1} of ${validMediaList.length}`}
              />
            ))}
          </div>
        )}
        
        {showNavigation && validMediaList.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 hover:bg-opacity-90 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevMedia();
              }}
              aria-label="Previous media"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 hover:bg-opacity-90 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                handleNextMedia();
              }}
              aria-label="Next media"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </>
        )}
      </div>

      <Modal
        styleContainer="flex items-center justify-center select-none size-full transition-all duration-300"
        zIndex={100}
        setHide={() => setIsFullscreenOpen(false)}
        animationName="fade"
        isOpen={isFullscreenOpen}
        aria-label={`${productName} image viewer`}
      >
        <div
          className={clsx(
            "bg-black/90 rounded-lg overflow-hidden shadow-xl w-full h-full",
            "flex flex-col",
            "transition-all duration-300 ease-in-out"
          )}
        >
          <div className="flex justify-between items-center p-4 text-white bg-black/50">
            <h3 className="text-lg font-medium">
              {productName} - {currentMedia + 1}/{validMediaList.length || 0}
            </h3>
            <button
              onClick={() => setIsFullscreenOpen(false)}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Close viewer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div className="flex-1 flex  items-center justify-center bg-black/20">
            <Swiper
              modules={[Navigation, Pagination, Zoom]}
              spaceBetween={0}
              slidesPerView={1}
              initialSlide={currentMedia}
              navigation
              onSwiper={setSwiperInstance}
              pagination={{ clickable: true }}
              zoom={{ maxRatio: 3 }}
              loop={true}
              onSlideChange={(swiper) => setCurrentMedia(swiper.realIndex)}
              className="w-full h-full"
            >
              {validMediaList.map((media, index) => (
                <SwiperSlide key={index} className="flex  max-h-[80dvh] items-center justify-center">
                  <div className="swiper-zoom-container">
                    {VIDEO_EXTENSIONS.some(ext => media.toLowerCase().endsWith(ext)) ? (
                      <video
                        src={`${BASE_URL}${media}`}
                        className="max-h-[80dvh] w-auto"
                        controls
                        autoPlay
                        muted
                        loop
                        playsInline
                        onError={handleMediaError}
                      />
                    ) : (
                      <img
                        src={`${BASE_URL}${media}`}
                        alt={`${productName} - ${index + 1}`}
                        className="max-h-[80dvh] w-auto object-contain"
                        onError={handleMediaError}
                      />
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {validMediaList.length > 1 && (
            <div className="flex justify-center items-center gap-2 p-4 bg-black/50 overflow-x-auto">
              {validMediaList.map((media, index) => (
                <button
                  key={index}
                  onClick={() => handleImageClick(index)}
                  className={clsx(
                    "w-16 h-16 rounded overflow-hidden flex items-center justify-center flex-shrink-0 duration-300 transition-all",
                    currentMedia === index ? "border-white scale-100 opacity-100" : "border-transparent opacity-40 scale-75 hover:opacity-100 hover:scale-100"
                  )}
                  aria-label={`View image ${index + 1}`}
                >
                  <ProductMedia
                    mediaList={[media]}
                    productName={productName}
                    className="size-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}