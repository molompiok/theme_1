import {
  DehydratedState,
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";


const createQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 5 * 60 * 1000,    // 5 minutes
      refetchOnMount: true,
      refetchOnWindowFocus: false, // Désactivé pour éviter les rechargements inutiles
      refetchOnReconnect: true,
      retry: 2, // Plus robuste avec 2 tentatives
    },
  },
});

 function ReactQueryProvider({
  children,
  dehydratedState,
}: {
  children: React.ReactNode;
  dehydratedState?: DehydratedState;
}) {
  return (
    <QueryClientProvider client={createQueryClient}>
      <HydrationBoundary state={dehydratedState ?? { queries: [], mutations: [] }}>
        {children}
      </HydrationBoundary>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
export { createQueryClient ,ReactQueryProvider };
