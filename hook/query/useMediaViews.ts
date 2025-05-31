import { useQuery } from "@tanstack/react-query";
import { get_features_with_values } from "../../api/products.api";
import { useMemo } from "react";
import { findFirstBindNameWithViews, getFirstFeatureWithView } from "../../utils";
import { ProductFeature } from "../../pages/type";


export const useMediaViews = ({product_id , bindNames} : {product_id : string , bindNames : Record<string, ProductFeature | string>}) => {

    const { data: features, isPending: isPendingFeatures } = useQuery({
        queryKey: ["get_features_with_values", product_id],
        queryFn: () =>
          product_id
            ? get_features_with_values({ product_id: product_id })
            : Promise.resolve(null),
        enabled: !!product_id,
      });
    
      const mediaViews = useMemo(() => {
        if (!features?.length) return ["/img/default_img.gif"];
        if (typeof Object.values(bindNames) === 'object') {
            const default1 = findFirstBindNameWithViews({ bindNames : bindNames });
            if (default1) {
              return default1.views;
            }
        }
        const default2 = getFirstFeatureWithView(features);
        const defaultViews = default2?.values[0]?.views || [];
        if (defaultViews.length > 0) {
          return defaultViews;
        }
        return ["/img/default_img.gif"];
      }, [features]);


      return { mediaViews , isPendingFeatures}

      
}