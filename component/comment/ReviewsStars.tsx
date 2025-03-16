import React from "react";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

export default function ReviewsStars(
  {
  note = 0,
  size,
  style,
}: {
  note: number;
  size?: number;
  style?: string;
}
) {
  return (
    <WrapStars>
        {
            Array.from({ length: Math.floor(note) }).map((_, i) => <FaStar key={i} size={size} className={style}/>)
        }
        {
            Math.ceil(note - Math.trunc(note)) != 0 && <FaStarHalfAlt size={size} className={style}/>
        }
        {
            Array.from({ length: Math.floor(5 - note) }).map((_, i) => <FaRegStar key={i} size={size} className={style}/>)
        }
      </WrapStars>
    );
 
}

function WrapStars({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center">{children}</div>;
}
