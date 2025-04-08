import { useMemo, useRef, useEffect } from "react";
import { getFirstFeatureWithView } from "../utils";
import { useproductFeatures } from "../store/features";
import { Feature } from "../pages/type";

export function useMedia(features: Feature[] | undefined) {
  const { lastSelectedFeatureId, lastValueId } = useproductFeatures();
  
  const previousViewsRef = useRef<string[]>([]);

  useEffect(() => {
    if (features && features.length > 0 && previousViewsRef.current.length === 0) {
      const defaultViews = getFirstFeatureWithView(features)?.values[0]?.views || [];
      previousViewsRef.current = defaultViews;
    }
  }, [features]);

  const mediaViews = useMemo(() => {
    if (!features?.length) {
      return previousViewsRef.current;
    }

    const selectedViews =
      features
        .find((f) => f.id === lastSelectedFeatureId)
        ?.values.find((v) => v.id === lastValueId)?.views || [];

    if (selectedViews.length > 0) {
      previousViewsRef.current = selectedViews;
      return selectedViews;
    }

    if (selectedViews.length === 0 && previousViewsRef.current.length > 0) {
      return previousViewsRef.current;
    }

    const defaultFeature = getFirstFeatureWithView(features);
    const defaultViews = defaultFeature?.values[0]?.views || [];
    
    if (defaultViews.length > 0) {
      previousViewsRef.current = defaultViews;
      return defaultViews;
    }

    return previousViewsRef.current;
  }, [features, lastSelectedFeatureId, lastValueId]);

 
  return mediaViews;
}