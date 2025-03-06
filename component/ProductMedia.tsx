import React, { useState } from 'react'
import { BASE_URL } from '../api';
export function ProductMedia({ mediaList, productName, className, onClick  }: { mediaList: string[], productName: string, className?: string, onClick?: () => void }) {
    const [currentMedia, setCurrentMedia] = useState(0);
    const hasVideo = mediaList.some((media: string) => media.endsWith(".mp4"));
    const currentSrc = mediaList[currentMedia] ? BASE_URL + mediaList[currentMedia] : "";
    const isVideo = currentSrc.endsWith(".mp4");

    return (
        isVideo ? (
            <video
                src={currentSrc}
                className={`${className}`}
                autoPlay
                muted
                loop
                onMouseLeave={() => setCurrentMedia(0)}
                onClick={onClick}
                controls={false}
            />
        ) : (
            <img
                src={currentSrc}
                onMouseEnter={() => hasVideo && setCurrentMedia(mediaList.findIndex((media: string) => media.endsWith(".mp4")))}
                className={` ${className}`}
                alt={productName}
                loading="lazy"
                onClick={onClick}
            />
        )
    );
}
