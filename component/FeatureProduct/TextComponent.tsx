import React from 'react'
import { FeaturesType, ValuesType } from '../../S1_data';
import { useproductFeatures } from '../../store/features';
import clsx from 'clsx';

export default function TextComponent({
    feature,
    productId
  }: {
    feature: FeaturesType;
    productId: string
  }) {
    const add = useproductFeatures(state => state.add)
    const pfeature = useproductFeatures(state => state.productFeatures)
    
  return (
    <div className="flex items-center justify-start overflow-x-auto gap-3 scrollbar-thin my-0.5">
      {feature.values.map((v) => {
        return (
          <button
          onClick={(e)=>{
            e.stopPropagation()
            e.preventDefault()
           add(productId , feature.name , v.text)
          }}
            key={v.id}
            className={clsx(`border cursor-pointer  text-clamp-xs flex justify-center items-center border-gray-300 max-w-[70px] px-3 min-h-[40px] rounded-md transition-all duration-500`,{
                'bg-black text-teal-50':pfeature.get(productId)?.get(feature.name) === v.text,
                'bg-white text-black': pfeature.get(productId)?.get(feature.name) !== v.text
            })}
          >{v.text}</button>
        );
      })}
    </div>
  )
}
