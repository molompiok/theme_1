import React, { useState, useCallback, useMemo, useEffect } from "react";
// import { BASE_URL } from "../api";
import clsx from "clsx";
import Modal from "./modal/Modal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Zoom } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/zoom";
import { usePageContext } from "vike-react/usePageContext";

interface ProductMediaProps {
  mediaList: string[] | string;
  productName: string;
  className?: string;
  fallbackImage?: string;
  showNavigation?: boolean;
  showFullscreen?: boolean;
  shouldHoverVideo?: boolean;
  isUrlServer?: boolean;
}

export function ProductMedia({
  mediaList,
  productName,
  className = "",
  fallbackImage = "/img/default_img.gif",
  showNavigation = false,
  shouldHoverVideo = true,
  isUrlServer = false,
  showFullscreen = false,
}: ProductMediaProps) {
  const normalizedMediaList = useMemo(
    () => (Array.isArray(mediaList) ? mediaList : [mediaList]),
    [mediaList]
  );
  const { apiUrl, serverUrl } = usePageContext();
  const [currentMedia, setCurrentMedia] = useState(0);
  const [errorStates, setErrorStates] = useState<boolean[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);


  // console.log('*********BASE_URL**********', BASE_URL);
  const VIDEO_EXTENSIONS = useMemo(() => [".mp4", ".webm", ".ogg"], []);

  const validMediaList = useMemo(
    () =>
      normalizedMediaList.filter(
        (media) => media && typeof media === "string" && media.trim() !== ""
      ),
    [normalizedMediaList]
  );

  const getMediaSrc = useCallback((media: string) => {
    return media.startsWith("http")
      ? media
      : isUrlServer
        ? `${serverUrl}${media}`
        : `${apiUrl}${media}`;
  }, []);

  const currentSrc = useMemo(() => {
    if (!validMediaList.length || currentMedia >= validMediaList.length) {
      return fallbackImage;
    }
    return getMediaSrc(validMediaList[currentMedia]);
  }, [validMediaList, currentMedia, fallbackImage, getMediaSrc]);

  const isVideo = useMemo(
    () =>
      VIDEO_EXTENSIONS.some((ext) => currentSrc.toLowerCase().endsWith(ext)),
    [currentSrc]
  );

  const hasVideo = useMemo(
    () =>
      validMediaList.some((media) =>
        VIDEO_EXTENSIONS.some((ext) =>
          getMediaSrc(media).toLowerCase().endsWith(ext)
        )
      ),
    [validMediaList, getMediaSrc]
  );

  // Gestion des erreurs
  useEffect(() => {
    setErrorStates(new Array(validMediaList.length).fill(false));
  }, [validMediaList]);

  // Préchargement de la prochaine image
  useEffect(() => {
    if (validMediaList.length > 1 && currentMedia < validMediaList.length - 1) {
      const nextSrc = getMediaSrc(validMediaList[currentMedia + 1]);
      if (
        !VIDEO_EXTENSIONS.some((ext) => nextSrc.toLowerCase().endsWith(ext))
      ) {
        const img = new Image();
        img.src = nextSrc;
      }
    }
  }, [currentMedia, validMediaList, getMediaSrc]);

  // Gestion des événements clavier en plein écran
  useEffect(() => {
    if (!isFullscreenOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          handlePrevMedia();
          break;
        case "ArrowRight":
          handleNextMedia();
          break;
        case "Escape":
          setIsFullscreenOpen(false);
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreenOpen]);

  const handleMediaError = useCallback((index: number) => {
    setErrorStates((prev) => {
      const newErrors = [...prev];
      newErrors[index] = true;
      return newErrors;
    });
  }, []);

  const handleMediaLoad = useCallback((index: number) => {
    setErrorStates((prev) => {
      const newErrors = [...prev];
      newErrors[index] = false;
      return newErrors;
    });
  }, []);

  const handleVideoHover = useCallback(() => {
    if (!shouldHoverVideo || !hasVideo || isVideo) return;
    const videoIndex = validMediaList.findIndex((media) =>
      VIDEO_EXTENSIONS.some((ext) =>
        getMediaSrc(media).toLowerCase().endsWith(ext)
      )
    );
    if (videoIndex >= 0) {
      setCurrentMedia(videoIndex);
      setIsHovering(true);
    }
  }, [shouldHoverVideo, hasVideo, isVideo, validMediaList, getMediaSrc]);

  const handleNextMedia = useCallback(() => {
    if (validMediaList.length > 1) {
      setCurrentMedia((prev) => {
        const newIndex = (prev + 1) % validMediaList.length;
        swiperInstance?.slideTo(newIndex);
        return newIndex;
      });
    }
  }, [validMediaList, swiperInstance]);

  const handlePrevMedia = useCallback(() => {
    if (validMediaList.length > 1) {
      setCurrentMedia((prev) => {
        const newIndex =
          (prev - 1 + validMediaList.length) % validMediaList.length;
        swiperInstance?.slideTo(newIndex);
        return newIndex;
      });
    }
  }, [validMediaList, swiperInstance]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    if (isVideo && isHovering && !isFullscreenOpen) {
      setCurrentMedia(0);
    }
  }, [isVideo, isHovering, isFullscreenOpen]);

  const toggleFullscreen = useCallback(() => {
    if (showFullscreen) setIsFullscreenOpen((prev) => !prev);
  }, [showFullscreen]);

  const renderMediaContent = (index: number, isFullscreen: boolean = false) => {
    const src =
      index < validMediaList.length
        ? getMediaSrc(validMediaList[index])
        : fallbackImage;
    const isMediaVideo = VIDEO_EXTENSIONS.some((ext) =>
      src.toLowerCase().endsWith(ext)
    );
    const hasError = errorStates[index] || false;

    if (hasError || !validMediaList.length) {
      return (
        <img
          src={fallbackImage}
          className={`${className} object-cover`}
          alt={`${productName} (fallback)`}
          loading="lazy"
        />
      );
    }

    if (isMediaVideo) {
      return (
        <video
          src={src}
          className={
            isFullscreen
              ? "max-h-[80vh] w-auto"
              : `p-1 rounded-md w-full h-full object-cover`
          }
          autoPlay={!isFullscreen}
          muted
          loop
          playsInline={!isFullscreen}
          controls={isFullscreen}
          onClick={!isFullscreen ? toggleFullscreen : undefined}
          onError={() => handleMediaError(index)}
          onLoadedData={() => handleMediaLoad(index)}
          aria-label={`${productName} video`}
        />
      );
    }

    return (
      <img
        src={src}
        onMouseEnter={!isFullscreen ? handleVideoHover : undefined}
        onClick={!isFullscreen ? toggleFullscreen : undefined}
        onError={() => handleMediaError(index)}
        onLoad={() => handleMediaLoad(index)}
        className={
          isFullscreen
            ? "max-h-[80vh] w-auto object-contain bg-contain"
            : `w-full h-full object-contain bg-contain`
        }
        alt={`${productName} - ${index + 1}`}
        loading="lazy"
      />
    );
  };

  const renderMainView = () => (
    <div
      className={`relative rounded-md ${className} overflow-hidden`}
      onMouseLeave={handleMouseLeave}
    >
      {renderMediaContent(currentMedia)}
      {showNavigation && validMediaList.length > 1 && (
        <>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
            {validMediaList.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${currentMedia === index ? "bg-white" : "bg-gray-300"
                  }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentMedia(index);
                }}
                aria-label={`View media ${index + 1}`}
              />
            ))}
          </div>
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 hover:bg-opacity-90"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevMedia();
            }}
            aria-label="Previous media"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 hover:bg-opacity-90"
            onClick={(e) => {
              e.stopPropagation();
              handleNextMedia();
            }}
            aria-label="Next media"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}
    </div>
  );

  const renderFullscreenView = () => (
    <Modal
      styleContainer="flex items-center justify-center select-none size-full transition-all duration-300"
      zIndex={100}
      setHide={() => setIsFullscreenOpen(false)}
      animationName="zoom"
      isOpen={isFullscreenOpen}
    >
      <div
        className={clsx(
          "bg-black/90 rounded-lg overflow-hidden shadow-xl w-full h-full",
          "flex flex-col"
        )}
      >
        <div className="flex justify-between items-center p-4 text-white bg-black/50">
          <h3 className="text-lg font-medium">
            {productName} - {currentMedia + 1}/{validMediaList.length}
          </h3>
          <button
            onClick={() => setIsFullscreenOpen(false)}
            className="p-2 rounded-full hover:bg-white/20"
            aria-label="Close viewer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center bg-black/20">
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
            {validMediaList.map((_, index) => (
              <SwiperSlide
                key={index}
                className="flex items-center justify-center"
              >
                <div className="swiper-zoom-container max-h-[80vh]">
                  {renderMediaContent(index, true)}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {validMediaList.length > 1 && (
          <div className="flex justify-center gap-2 p-4 bg-black/50 overflow-x-auto">
            {validMediaList.map((media, index) => (
              <button
                key={index}
                onClick={() => {
                  swiperInstance?.slideTo(index);
                  setCurrentMedia(index);
                }}
                className={clsx(
                  "w-16 h-16 rounded overflow-hidden flex items-center justify-center flex-shrink-0",
                  currentMedia === index
                    ? "border-2 border-white opacity-100"
                    : "border-transparent opacity-40 hover:opacity-100"
                )}
              >
                <ProductMedia
                  mediaList={[media]}
                  productName={productName}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );

  return (
    <>
      {renderMainView()}
      {showFullscreen && renderFullscreenView()}
    </>
  );
}
