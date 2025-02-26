import React from "react";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

export default function ReviewsStars({
  note = 0,
  size,
  style,
}: {
  note: number;
  size?: number;
  style?: string;
}) {
  if (note < 0.5) {
    return (
      <WrapStars>
        <FaRegStar size={size} className={style} />
        <FaRegStar size={size} className={style} />
        <FaRegStar size={size} className={style} />
        <FaRegStar size={size} className={style} />
        <FaRegStar size={size} className={style} />
      </WrapStars>
    );
  } else if (note >= 0.5 && note < 1) {
    return (
      <WrapStars>
        <FaStarHalfAlt />
        <FaRegStar size={size} className={style} />
        <FaRegStar size={size} className={style} />
        <FaRegStar size={size} className={style} />
        <FaRegStar size={size} className={style} />
      </WrapStars>
    );
  } else if (note >= 1 && note < 1.5) {
    return (
      <WrapStars>
        <FaStar size={size} className={style} />
        <FaRegStar size={size} className={style} />
        <FaRegStar size={size} className={style} />
        <FaRegStar size={size} className={style} />
        <FaRegStar size={size} className={style} />
      </WrapStars>
    );
  } else if (note >= 1.5 && note < 2) {
    return (
      <WrapStars>
        <FaStar size={size} className={style} />
        <FaStarHalfAlt size={size} className={style}  />
        <FaRegStar size={size} className={style} />
        <FaRegStar size={size} className={style} />
        <FaRegStar size={size} className={style} />
      </WrapStars>
    );
  } else if (note >= 2 && note < 2.5) {
    return (
      <WrapStars>
        <FaStar size={size} className={style} />
        <FaStar size={size} className={style} />
        <FaRegStar size={size} className={style} />
        <FaRegStar size={size} className={style} />
        <FaRegStar size={size} className={style} />
      </WrapStars>
    );
  } else if (note >= 2.5 && note < 3) {
    return (
      <WrapStars>
        <FaStar size={size} className={style} />
        <FaStar size={size} className={style} />
        <FaStarHalfAlt size={size} className={style}  />
        <FaRegStar size={size} className={style} />
        <FaRegStar size={size} className={style} />
      </WrapStars>
    );
  } else if (note >= 3 && note < 3.5) {
    return (
      <WrapStars>
        <FaStar size={size} className={style} />
        <FaStar size={size} className={style}  />
        <FaStar size={size} className={style}  />
        <FaRegStar size={size} className={style} />
        <FaRegStar size={size} className={style} />
      </WrapStars>
    );
  } else if (note >= 3.5 && note < 4) {
    return (
      <WrapStars>
        <FaStar size={size} className={style} />
        <FaStar size={size} className={style}  />
        <FaStar size={size} className={style} />
        <FaStarHalfAlt size={size} className={style}  />
        <FaRegStar size={size} className={style} />
      </WrapStars>
    );
  } else if (note >= 4 && note < 4.5) {
    return (
      <WrapStars>
        <FaStar size={size} className={style} />
        <FaStar size={size} className={style} />
        <FaStar size={size} className={style} />
        <FaStar size={size} className={style} />
        <FaRegStar size={size} className={style} />
      </WrapStars>
    );
  } else if (note >= 4.5 && note < 5) {
    return (
      <WrapStars>
        <FaStar size={size} className={style} />
        <FaStar size={size} className={style} />
        <FaStar size={size} className={style} />
        <FaStar size={size} className={style} />
        <FaStarHalfAlt size={size} className={style}  />
      </WrapStars>
    );
  } else if (note === 5) {
    return (
      <WrapStars>
        <FaStar size={size} className={style} />
        <FaStar size={size} className={style} />
        <FaStar size={size} className={style} />
        <FaStar size={size} className={style}  />
        <FaStar size={size} className={style} />
      </WrapStars>
    );
  } else {
  }
}

function WrapStars({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center">{children}</div>;
}
