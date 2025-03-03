import { DehydratedState, HydrationBoundary, QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                // Configuration par défaut pour le SSR
                staleTime: 60 * 1000, // 1 minute
                refetchOnMount: true,
                refetchOnWindowFocus: true,
                refetchOnReconnect: true,
            },
        },
    });
    return (
        <QueryClientProvider client={queryClient}>
                {children}
        </QueryClientProvider>

    )
}