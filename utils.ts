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
      },
    },
  });
}


export const formatSlug = (name: string) =>  limax(name, { maintainCase: true });
 