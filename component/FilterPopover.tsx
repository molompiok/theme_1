import { Popover, PopoverTrigger, PopoverContent } from './Popover';
import { FilterValue } from '../pages/type';
// import { defaultOptions, OptionType } from '../pages/type';

interface FilterPopoverProps {
  className?: string;
  setFilter?: (key: string, value: FilterValue[]) => void;
  selectedFilters?: Record<string, FilterValue[]>;
  defaultOptions?: string[];
}

const FilterPopover = ({ className = '', setFilter, selectedFilters, defaultOptions = ['plus recent', 'moins recent', 'prix eleve', 'prix bas'] }: FilterPopoverProps) => {
  const handleClick = (option: string) => {
    setFilter?.('order_by', [{ text: option, key: option , icon : [] }]);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button 
          className={`flex items-center gap-2  px-2 py-1 text-sm lg:text-base border-gray-500 bg-white/90 border rounded-sm ${className}`}
        >
          <span className='text-gray-500'>Trier par</span>
          <span className='text-gray-900'>{selectedFilters?.['order_by']?.[0]?.text}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="z-50 w-48 p-0">
        <div className="bg-white border border-gray-300 rounded-sm py-2">
          {defaultOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleClick(option)}
              className="w-full text-sm text-left px-4 py-2 hover:bg-gray-100"
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