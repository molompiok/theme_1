import { QueryClient } from "@tanstack/react-query";
import limax from "limax";
import { Feature, ProductType } from "./pages/type";

const createQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Configuration par défaut pour le SSR
      staleTime: 60 * 3000,
      gcTime: 60 * 3000,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 0,
    },
  },
});
export { createQueryClient };

export const formatSlug = (name: string) => limax(name, { maintainCase: true });

export const formatPrice = (price?: string | number): string => {
  if (!price) return "0";
  return price.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export const filterIdToName = (filters: Array<{ id: string; name: string }>) =>
  filters.reduce((acc, filter) => {
    console.log("🚀 ~ filterIdToName ~ filters:", filters);
    acc[filter.id] = filter.name.toLowerCase();
    return acc;
  }, {} as Record<string, string>);

export const filterNameToId = (filters: Array<{ id: string; name: string }>) =>
  filters.reduce((acc, filter) => {
    acc[filter.name.toLowerCase()] = filter.id;
    return acc;
  }, {} as Record<string, string>);

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


export const getFirstFeatureWithView = (features: Feature[]): Feature | undefined => {
  return features.find((feature) =>
    feature.values.some((value) => value.views.length > 0)
  );
};




function generateGroupProduct(bind: Record<string, string>,product: {features: Feature[] , product_id: string}) {
  let additionalPrice = 0;
  let stock: number | null = Infinity; // On prend le minimum donc on part d'un grand nombre
  let decreasesStock = false;
  let continueSelling = false;

  // Vérifier les features et récupérer les infos des valeurs sélectionnées
  for (let feature of product.features || []) {
    let featureId = feature.id;
    let valueId = bind[featureId];

    if (!valueId) continue; // Si la feature n'est pas dans le bind, on passe

    let value = feature.values?.find(v => v.id === valueId);
    if (!value) continue; // Si la valeur n'existe pas, on passe

    // Mettre à jour le prix supplémentaire
    if (value?.additional_price) {
      additionalPrice += value.additional_price;
    }

    // Mettre à jour le stock (on prend le minimum)
    if (value?.stock !== null) {
      value.stock && (stock = Math.min(stock, value.stock));
    }

    // Mettre à jour les booléens s'ils sont définis
    if (value.decreases_stock !== null) {
      decreasesStock = decreasesStock || !!value.decreases_stock;
    }
    if (value.continue_selling !== null) {
      continueSelling = continueSelling || !!value.continue_selling;
    }
  }

  // Si aucun stock n'a été défini (aucune valeur n'a de stock renseigné), on met stock = null
  if (stock === Infinity) {
    stock = null;
  }

  return {
    id: Math.random().toString(36).slice(2, 9),
    bind,
    additional_price: additionalPrice,
    stock: stock,
    product_id : product.product_id,
    decreases_stock: decreasesStock,
    continue_selling: continueSelling
  };
}

export function getAllCombinations(product: {features: Feature[], product_id: string}) {
  const features = product.features;
  console.log({ features });

  if (!features) return [];

  // Récupérer toutes les valeurs possibles par feature (filtrer les features sans valeurs)
  const featureValues = features
    .map(feature => feature?.values?.map(value => ({
      feature_id: feature.id,
      value_id: value.id
    })) || [])
    .filter(values => values.length > 0); // 🔥 Supprime les features sans valeurs

  console.log({ featureValues });

  // Fonction pour générer les combinaisons cartésiennes
  function cartesianProduct(arr: any) {
    if (arr.length === 0) return []; // 🔥 Si aucune feature avec valeurs, retourner []
    return arr.reduce((acc: any, values: any) =>
      acc.map((comb: any) => values.map((val: any) => [...comb, val])).flat()
    , [[]]);
  }

  // Générer toutes les combinaisons possibles
  const combinations = cartesianProduct(featureValues);
  console.log({ combinations });

  // Transformer chaque combinaison en objet bind { feature_id: value_id, ... }
  const allBinds = combinations.map((comb: any) => {
    return comb.reduce((obj: any, item: any) => {
      obj[item.feature_id] = item.value_id;
      return obj;
    }, {});
  });

  console.log({ allBinds });

  // Générer tous les group_products
  return allBinds.map((bind: any) => generateGroupProduct(bind, product)) as (ReturnType<typeof generateGroupProduct>)[];
}
