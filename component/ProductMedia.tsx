import React, { useState, useCallback, useMemo } from 'react';
import { BASE_URL } from '../api';
import Loading from './Loading';

interface ProductMediaProps {
  mediaList: string[];
  productName: string;
  className?: string;
  onClick?: () => void;
  fallbackImage?: string; // Added fallback image prop
}

export function ProductMedia({ 
  mediaList, 
  productName, 
  className = '', 
  onClick,
  fallbackImage = '/img/default_img.gif'
}: ProductMediaProps) {
  const [currentMedia, setCurrentMedia] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const VIDEO_EXTENSIONS = useMemo(() => ['.mp4', '.webm', '.ogg'], []);
  
  const currentSrc = useMemo(() => {
    if (!mediaList?.length || currentMedia >= mediaList.length) {
      return fallbackImage;
    }
    return `${BASE_URL}${mediaList[currentMedia]}`;
  }, [mediaList, currentMedia, fallbackImage]);

  const isVideo = useMemo(() => 
    VIDEO_EXTENSIONS.some(ext => currentSrc.toLowerCase().endsWith(ext)),
    [currentSrc]
  );

  const hasVideo = useMemo(() => 
    mediaList.some(media => 
      VIDEO_EXTENSIONS.some(ext => media.toLowerCase().endsWith(ext))
    ),
    [mediaList]
  );

  const handleMediaError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
  }, []);

  const handleMediaLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleVideoHover = useCallback(() => {
    if (hasVideo && !isVideo) {
      const videoIndex = mediaList.findIndex(media => 
        VIDEO_EXTENSIONS.some(ext => media.toLowerCase().endsWith(ext))
      );
      setCurrentMedia(videoIndex >= 0 ? videoIndex : 0);
    }
  }, [hasVideo, isVideo, mediaList]);

  if (hasError) {
    return (
      <img
        src={fallbackImage}
        className={`${className}`}
        alt={`${productName} (fallback)`}
        loading="lazy"
      />
    );
  }

  return (
    <div className={`rounded-md ${className} overflow-hidden`}>
      {isVideo ? (
        <video
          src={currentSrc}
          className={`p-1 rounded-md ${className}`}
          autoPlay
          muted
          loop
          playsInline
          onMouseLeave={() => setCurrentMedia(0)}
          onClick={onClick}
          onError={handleMediaError}
          onLoadedData={handleMediaLoad}
          aria-label={`${productName} video`}
          controls={false}
        />
      ) : (
        <img
          src={currentSrc}
          onMouseEnter={handleVideoHover}
          onClick={onClick}
          onError={handleMediaError}
          onLoad={handleMediaLoad}
          className={`${className}`}
          alt={productName}
          loading="lazy"
          aria-label={`${productName} image`}
        />
      )}
    </div>
  );
}