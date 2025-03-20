import { QueryClient } from '@tanstack/react-query';
import limax from "limax";

export function createQueryClient() {
  return new QueryClient({
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
}


export const formatSlug = (name: string) =>  limax(name, { maintainCase: true });
 
export const formatPrice = (price?: string | number): string => {
  if (!price) return "0";
  return price.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export const filterIdToName = (filters : Array<{id : string , name : string}>) => filters.reduce((acc, filter) => {
  console.log("🚀 ~ filterIdToName ~ filters:", filters)
  acc[filter.id] = filter.name.toLowerCase();
  return acc;
}, {} as Record<string, string>);

export const filterNameToId = (filters : Array<{id : string , name : string}>) => filters.reduce((acc, filter) => {
  acc[filter.name.toLowerCase()] = filter.id;
  return acc;
}, {} as Record<string, string>);