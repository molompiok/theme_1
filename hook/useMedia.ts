import { useMemo, useRef, useEffect } from "react";
import { getFirstFeatureWithView } from "../utils";
import { useproductFeatures } from "../store/features";
import { Feature } from "../pages/type";

export function useMedia(features: Feature[] | undefined) {
  const { lastSelectedFeatureId, lastValueId } = useproductFeatures();

  const previousViewsRef = useRef<string[]>([]);
  const isInitializedRef = useRef<boolean>(false);

  // Initialisation des vues par défaut
  useEffect(() => {
    if (features && features.length > 0 && !isInitializedRef.current) {
      const defaultViews = getFirstFeatureWithView(features)?.values[0]?.views || [];
      previousViewsRef.current = defaultViews;
      isInitializedRef.current = true;
    }
  }, [features]);

  const mediaViews = useMemo(() => {
    // Si pas de features, retourner un tableau vide plutôt que les anciennes vues
    if (!features?.length) {
      return [];
    }

    // Chercher les vues pour la sélection actuelle
    let currentViews: string[] = [];

    if (lastSelectedFeatureId && lastValueId) {
      const selectedFeature = features.find((f) => f.id === lastSelectedFeatureId);
      if (selectedFeature) {
        const selectedValue = selectedFeature.values.find((v) => v.id === lastValueId);
        currentViews = selectedValue?.views || [];
      }
    }

    // Si on a trouvé des vues pour la sélection actuelle
    if (currentViews.length > 0) {
      previousViewsRef.current = currentViews;
      return currentViews;
    }

    // Si pas de sélection ou pas de vues pour la sélection actuelle,
    // chercher les vues par défaut (première feature avec des vues)
    const defaultFeature = getFirstFeatureWithView(features);
    const defaultViews = defaultFeature?.values[0]?.views || [];

    if (defaultViews.length > 0) {
      // Seulement mettre à jour previousViewsRef si on n'a pas de sélection active
      if (!lastSelectedFeatureId || !lastValueId) {
        previousViewsRef.current = defaultViews;
      }
      return defaultViews;
    }

    // En dernier recours, retourner les vues précédentes seulement si elles existent
    return previousViewsRef.current.length > 0 ? previousViewsRef.current : [];
  }, [features, lastSelectedFeatureId, lastValueId]);

  return mediaViews;
}

// Version alternative plus simple si vous voulez forcer le rafraîchissement
export function useMediaStrict(features: Feature[] | undefined) {
  const { lastSelectedFeatureId, lastValueId } = useproductFeatures();

  const mediaViews = useMemo(() => {
    if (!features?.length) {
      return [];
    }

    // Priorité 1: Vues de la sélection actuelle
    if (lastSelectedFeatureId && lastValueId) {
      const selectedFeature = features.find((f) => f.id === lastSelectedFeatureId);
      const selectedValue = selectedFeature?.values.find((v) => v.id === lastValueId);
      const selectedViews = selectedValue?.views || [];

      if (selectedViews.length > 0) {
        return selectedViews;
      }
    }

    // Priorité 2: Vues par défaut (première feature avec des vues)
    const defaultFeature = getFirstFeatureWithView(features);
    return defaultFeature?.values[0]?.views || [];

  }, [features, lastSelectedFeatureId, lastValueId]);

  return mediaViews;
}