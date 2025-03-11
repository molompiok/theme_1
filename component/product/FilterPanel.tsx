import React from 'react'
import { CiSliderHorizontal } from 'react-icons/ci';

export default function FilterPanel() {
  return (
    <div className="bg-white rounded-lg  p-6  mb-6 lg:mb-0">
      <h2 className="text-lg font-semibold mb-4">Filtres</h2>
      <button
        className="lg:hidden flex items-center gap-2 w-full justify-center py-2 px-4 border border-gray-300 
          rounded-md hover:bg-gray-100 transition-colors"
      >
        <span>Filtres</span>
        <CiSliderHorizontal size={20} />
      </button>
    </div>
  );
}
