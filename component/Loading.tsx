import React from 'react'
import { CgSearchLoading } from 'react-icons/cg'
import { LiaTruckLoadingSolid } from 'react-icons/lia'

export default function Loading() {
  return (
    <div className='flex aspect-square justify-center items-center w-full animate-spin'><LiaTruckLoadingSolid size={32}/></div>
  )
}
