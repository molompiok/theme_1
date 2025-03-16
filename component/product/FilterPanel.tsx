import React from 'react'
import { CiSliderHorizontal } from 'react-icons/ci';

export default function FilterPanel() {
  return (
    <div className="bg-green-100 rounded-lg  p-6">
      <h2 className="text-lg font-semibold mb-4">Filtres</h2>
      <button
        className="lg:hidden flex items-center gap-2 w-auto justify-center py-2 px-4 border border-gray-300 
          rounded-md hover:bg-gray-100 transition-colors"
      >
        <span>Filtres</span>
        <CiSliderHorizontal size={20} />
      </button>
    </div>
  );
}
