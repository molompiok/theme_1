import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';

const FilterPopover = ({ 
  options = [], 
  defaultLabel = 'Plus récents', 
  triggerLabel = 'Filtrer par', 
  onOptionClick = (option : string) => {}, 
  className = '' 
} : {
    options?: string[];
    defaultLabel?: string;
    triggerLabel?: string;
    onOptionClick?: (option: string) => void;
    className?: string;
}) => {
  const [selectedOption, setSelectedOption] = useState(defaultLabel);

const handleClick = (option: string): void => {
    setSelectedOption(option);
    onOptionClick(option);
};

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className={`flex items-center gap-2 px-4 py-2 bg-white border border-black rounded-lg hover:bg-gray-100 transition-colors ${className}`}>
          <span className="text-sm font-medium text-black">
            {triggerLabel}
          </span>
          <span className="text-sm text-black">{selectedOption}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="z-20 w-48 p-0">
        <div className="bg-white border border-black rounded-lg shadow-lg py-2">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleClick(option)}
              className="w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100 capitalize transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterPopover;