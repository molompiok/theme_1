import React from 'react';
import { ProductFeature } from '../../pages/type';
import { usePageContext } from 'vike-react/usePageContext';


interface BindTagsProps {
  tags: Record<string, ProductFeature> | null;
}

const BindTags: React.FC<BindTagsProps> = ({ tags }) => {
  const { apiUrl } = usePageContext();
  if (!tags || Object.entries(tags).length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {Object.entries(tags).map(([_, value], index) => (
        <span
          key={index}
          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all duration-200"
        >
          {value?.text}
          {value?.key && (
            <span
              className="size-3 ml-1 rounded-full inline-block ring-1 ring-white"
              style={{ background: value?.key }}
              aria-label={`Couleur : ${value?.text}`}
            />
          )}
          {value?.icon?.length > 0 && (
            <span
              className="size-2 ml-1 rounded-full inline-block ring-1 ring-white"
              style={{ background: `url(${apiUrl + value?.icon[0]})` }}
              aria-label={`Icone : ${value?.text}`}
            />
          )}
        </span>
      ))}
    </div>
  );
};

export default BindTags;