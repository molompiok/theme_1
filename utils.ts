import { QueryClient } from "@tanstack/react-query";
import limax from "limax";
import { Feature } from "./pages/type";

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