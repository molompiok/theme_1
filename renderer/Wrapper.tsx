import React, { useState, useMemo, Suspense, lazy } from 'react';
import {
  DehydratedState,
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { PageContextProvider, usePageContext } from 'vike-react/usePageContext';
import { createQueryClient } from './ReactQueryProvider';
import axios from 'axios';
import { useAuthStore } from '../store/user';

// Charger ReactQueryDevtools uniquement en développement
const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() => import('@tanstack/react-query-devtools').then(m => ({ default: m.ReactQueryDevtools })))
  : () => null;

function App({ children }: { children: React.ReactNode }) {
  const pageContext = usePageContext();

  // Recréez les instances axios côté client, UNE SEULE FOIS.
  const clientSideApi = useMemo(() => {
    if (typeof window === 'undefined') return pageContext.api; // Sur le serveur, on utilise l'instance de onBeforeRender

    // Sur le client, on crée une nouvelle instance
    const api = axios.create({
      baseURL: pageContext.apiUrl,
      timeout: 25000,
    });

    api.interceptors.request.use(config => {
      // Lit le token depuis le store Zustand côté client.
      const token = useAuthStore.getState().token;
      if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    });

    return api;
  }, [pageContext.apiUrl]); // Se recrée si l'URL de l'API change

  // Crée un pageContext augmenté avec l'instance `api` côté client
  const pageContextWithApi = useMemo(() => ({
    ...pageContext,
    api: clientSideApi,
    // Faites de même pour `server` si vous en avez besoin côté client
  }), [pageContext, clientSideApi]);

  // Le PageContextProvider est crucial pour que les enfants aient accès au contexte mis à jour
  return (

    <PageContextProvider pageContext={pageContextWithApi}>
      {children}
    </PageContextProvider>
  );
}

export function Wrapper({ children }: { children: React.ReactNode }) {
  const pageContext = usePageContext();
  const { dehydratedState } = pageContext;



  // Crée un singleton QueryClient côté client, et une nouvelle instance à chaque rendu SSR.
  // C'est le pattern recommandé pour SSR avec React Query.
  const [queryClient] = useState(() => createQueryClient());

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={dehydratedState}>
          <App>{children}</App>
        </HydrationBoundary>
        {import.meta.env.DEV && (
          <Suspense fallback={null}>
            <ReactQueryDevtools initialIsOpen={false} />
          </Suspense>
        )}
      </QueryClientProvider>
    </React.StrictMode>
  );
}