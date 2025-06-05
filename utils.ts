import limax from "limax";
import { Feature, OrderStatus, ProductFeature, ProductType, VariantType } from "./pages/type";
import { BASE_URL } from "./api";

export const formatSlug = (name: string) => limax(name, { maintainCase: true });

export const formatPrice = (price?: string | number, currency?: string): string => {
  if (!price) return "0";
  return price.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " " + (currency || "CFA".toLocaleLowerCase());
};

export const filterIdToName = (filters: Array<{ id: string; name: string }>) =>
  filters.reduce((acc, filter) => {
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


export const getFirstFeatureWithView = (features: Feature[]) => {
  const feature = features.find((feature) =>
    feature.values.some((value) => value.views.length > 0)
  );
  return feature;
};

export function getAllOptions({ features, product_id }: { features: Feature[], product_id: string }) {

  if (!features) return [];

  // Récupérer toutes les valeurs possibles par feature (filtrer les features sans valeurs)
  const ProductFeatures = features
    .map(feature => feature?.values?.map(value => ({
      feature_id: feature.id,
      value_id: value.id
    })) || [])
    .filter(values => values.length > 0); // 🔥 Supprime les features sans valeurs


  // Fonction pour générer les combinaisons cartésiennes
  function cartesianProduct(arr: any) {
    if (arr.length === 0) return []; // 🔥 Si aucune feature avec valeurs, retourner []
    return arr.reduce((acc: any, values: any) =>
      acc.map((comb: any) => values.map((val: any) => [...comb, val])).flat()
      , [[]]);
  }

  // Générer toutes les combinaisons possibles
  const combinations = cartesianProduct(ProductFeatures);

  // Transformer chaque combinaison en objet bind { feature_id: value_id, ... }
  const allBinds = combinations.map((comb: any) => {
    return comb.reduce((obj: any, item: any) => {
      obj[item.feature_id] = item.value_id;
      return obj;
    }, {});
  });

  // Générer tous les group_products
  return allBinds.map((bind: any) => getOptions({ bind, features, product_id })) as (ReturnType<typeof getOptions>)[];
}


export function deepEqual<T>(obj1: T | string, obj2: T | string): boolean {
  const tryParse = (value: any): any => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }
    return value;
  };

  const normalizedObj1 = tryParse(obj1);
  const normalizedObj2 = tryParse(obj2);

  if (normalizedObj1 === normalizedObj2) {
    return true;
  }

  if (
    typeof normalizedObj1 !== 'object' ||
    typeof normalizedObj2 !== 'object' ||
    normalizedObj1 === null ||
    normalizedObj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(normalizedObj1 as Record<string, any>);
  const keys2 = Object.keys(normalizedObj2 as Record<string, any>);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key)) {
      return false;
    }
    if (!deepEqual((normalizedObj1 as Record<string, any>)[key], (normalizedObj2 as Record<string, any>)[key])) {
      return false;
    }
  }

  return true;
}


export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export function findFirstBindNameWithViews({ bindNames }: { bindNames?: Record<string, ProductFeature | string> }): ProductFeature | null {
  if (!bindNames) return null
  const bindNameEntries = Object.entries(bindNames);
  for (const [, feature] of bindNameEntries) {
    // console.log("🚀 ~ findFirstBindNameWithViews ~ feature:", feature)
    if (typeof feature === 'object' && feature.views.length > 0 && feature.is_default)
      return feature;
  }
  return null;
}


export const statusStyles: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-800',
  [OrderStatus.CANCELED]: 'bg-gray-100 text-gray-800',
  [OrderStatus.RETURNED]: 'bg-red-100 text-red-800',
  [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800',
  [OrderStatus.PICKED_UP]: 'bg-green-100 text-green-800',
  [OrderStatus.NOT_DELIVERED]: 'bg-red-100 text-red-800',
  [OrderStatus.NOT_PICKED_UP]: 'bg-red-100 text-red-800',
  [OrderStatus.WAITING_FOR_PAYMENT]: 'bg-orange-100 text-orange-800',
  [OrderStatus.WAITING_PICKED_UP]: 'bg-orange-100 text-orange-800',
};

export function getMinimumStock({ features, ignoreStock }: { features: Feature[], ignoreStock?: boolean }) {

  if (ignoreStock) return Infinity;

  if (!features || features.length === 0) {
    return 0;
  }

  let minStock = Infinity;

  features.forEach(feature => {
    if (feature.values && feature.values.length > 0) {
      feature.values.forEach(value => {
        if (typeof value.stock === 'number') {
          if (value.stock === 0 || value.stock === null || value.stock === undefined) return;
          minStock = Math.min(minStock, value.stock);
        }
      });
    }
  });

  return minStock === Infinity ? 0 : minStock;
}


export function hasContinueSelling({ features }: { features: Feature[] }) {
  if (!features || features.length === 0) {
    return false;
  }

  for (const feature of features) {
    if (feature.values && feature.values.length > 0) {
      for (const value of feature.values) {
        if (value.continue_selling === true) {
          return true;
        }
      }
    }
  }

  return false;
}


export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '' || value === '{}';
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

export function getFeatureValuePairs(features: Feature[]) {
  const result: Record<string, string> = {};

  features.forEach(feature => {
    if (feature.values && feature.values.length > 0) {
      feature.values.forEach(value => {
        if (value.id) result[feature.id] = value.id;
      });
    }
  });

  return result;
}

const pickupDeadline = new Date();
pickupDeadline.setDate(pickupDeadline.getDate() + 3);
export const InfoOrderOwner = {
  pickup_maps_link: `geo:5.308845,-4.013481?q=Koumassi+Remblais,+Abidjan`,
  pickup_phone: "+2250707631861",
  formatted_phone: "+225 00 00 000 000",
  pickup_date: pickupDeadline.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  pickup_latitude: 5.308844,
  pickup_longitude: -4.013481,
  pickup_address: "Koumassi Remblais, Abidjan",
  delivery_price: 1000,
  country_code: "ci_225",
}

export const safeParsePrice = (value: string | number | undefined | null): number => {
  if (value === undefined || value === null) return 0;
  const parsed = parseFloat(String(value));
  return isNaN(parsed) ? 0 : Math.max(0, parsed);
};

export function getOptions({ bind, features, product_id }: { bind: Record<string, string>, features: Feature[], product_id: string }) {
  let additionalPrice = 0;
  let stock: number | null = Infinity; // On prend le minimum donc on part d'un grand nombre
  let decreasesStock = false;
  let continueSelling = false;
  let bindNames: Record<string, ProductFeature | string> = {}
  let bindIds: Record<string, ProductFeature | string> = {}

  for (let feature of features || []) {
    let featureId = feature.id;

    if ([
      VariantType.TEXT,
      VariantType.COLOR,
      VariantType.ICON,
      VariantType.ICON_TEXT
    ].includes(feature.type as any)) {
      let valueId = bind[featureId];
      if (!valueId) continue; // Si la feature n'est pas dans le bind, on passe

      let value = feature.values?.find(v => v.id === valueId);
      if (!value) continue; // Si la valeur n'existe pas, on passe
      bindNames[feature.name] = value
      bindIds[feature.id] = value

      // Mettre à jour le prix supplémentaire
      if (value.additional_price) {
        additionalPrice += value.additional_price;
      }

      // Mettre à jour le stock (on prend le minimum)
      if (value.stock !== null && value.stock !== undefined) {
        stock = Math.min(stock, value.stock);
      }

      // Mettre à jour les booléens s'ils sont définis
      if (value.decreases_stock !== null) {
        decreasesStock = decreasesStock || !!value.decreases_stock;
      }
      if (value.continue_selling !== null) {
        continueSelling = continueSelling || !!value.continue_selling;
      }
    } else {
      bindIds[feature.id] = bind[featureId]
      bindNames[feature.name] = bind[featureId]
    }
  }

  // Si aucun stock n'a été défini (aucune valeur n'a de stock renseigné), on met stock = null
  if (stock === Infinity) {
    stock = null;
  }




  const options = {
    bind,
    bindNames,
    bindIds,
    additional_price: additionalPrice,
    stock: stock,
    product_id: product_id,
    decreases_stock: decreasesStock,
    continue_selling: continueSelling
  };

  return options;
}





export const googleLogin = () => {
  // navigate("/auth/google");
  const storeId = BASE_URL.apiUrl.split("/")[3];
  const originalUrl = window.location.origin;
  const clientSuccess = originalUrl + "/auth/success";
  const clientError = originalUrl + "/auth/error";
  const url = `${BASE_URL.serverUrl}/auth/store/google/redirect?store_id=${storeId}&client_success=${clientSuccess}&client_error=${clientError}`;
  window.open(url, "_self");
};