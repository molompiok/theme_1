// fichier: renderer/ReactQueryProvider.tsx

import {
  DehydratedState,
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

// 1. Transformer ceci en une FONCTION qui retourne une nouvelle instance
export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (un peu plus long que staleTime)
        refetchOnWindowFocus: false,
        retry: 2,
      },
    },
  });

// 2. Ce composant est parfait pour le côté CLIENT, car il va créer et garder en mémoire le client.
// Pour le SSR, nous allons l'utiliser différemment.
// function ReactQueryProvider({
//   children,
//   dehydratedState,
// }: {
//   children: React.ReactNode;
//   dehydratedState?: DehydratedState;
// }) {
//   // useState garantit que le QueryClient n'est créé qu'une seule fois côté client.
//   const [queryClient] = useState(() => createQueryClient());

//   return (
//     <QueryClientProvider client={queryClient}>
//       <HydrationBoundary state={dehydratedState}>
//         {children}
//       </HydrationBoundary>
//       <ReactQueryDevtools initialIsOpen={false} />
//     </QueryClientProvider>
//   );
// }