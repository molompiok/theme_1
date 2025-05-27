import ReactDOMServer from 'react-dom/server'
import { Layout } from './Layout'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import logoUrl from './logo.svg'
import "./index.css"
import type { OnRenderHtmlAsync } from 'vike/types'
import { getPageTitle } from './getPageTitle'
import { dehydrate, QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient } from './ReactQueryProvider'
import axios from 'axios'
import { BASE_URL, api as globalApi } from "../api/index";
import { useAuthStore } from "../store/user"


const onRenderHtml: OnRenderHtmlAsync = async (pageContext) : ReturnType<OnRenderHtmlAsync> => {
  const { Page } = pageContext
  
  if (!Page) throw new Error('pageContext.Page is not defined')

    
    const host = (process.env.NODE_ENV == 'production' ? 'https://' : 'http://') ;
    
  const headersOriginal = pageContext.headers as Record<string, string> || {};
  // const baseUrlFromHeader = host + headersOriginal['x-base-url'] || '';
  const apiUrlFromHeader = host + headersOriginal['x-store-api-url'] || '';
  const serverUrlFromHeader = host + headersOriginal['x-server-url'] || '';


  const api = axios.create({
    baseURL: apiUrlFromHeader,
    timeout: 25000,
    withCredentials: true,
  });

  const server = axios.create({
    baseURL: serverUrlFromHeader,
    timeout: 25000,
    withCredentials: true,
  });

  pageContext.api = api;
  pageContext.server = server;

  BASE_URL.url = pageContext.apiUrl;
  globalApi.api = api;
  globalApi.server = server;

  api.interceptors.request.use(request => {
    return request;
  })
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (typeof window !== "undefined") {
        const status = error.response?.status;
        const { wasLoggedIn, logout } = useAuthStore.getState();
        if (status === 401 && wasLoggedIn) {
          console.warn("Session expirée, déconnexion automatique");
          logout();
          // if (!localStorage.getItem("hasShownSessionExpired")) {
          //   toast.custom((t) => (
          //     <div className="flex items-center gap-3 p-4 bg-red-100 border-l-4 border-red-500 rounded-lg shadow-lg">
          //       <BsXCircle className="w-6 h-6 text-red-600" />
          //       <p className="text-red-800 font-medium">
          //         Deconexion reussie
          //       </p>
          //     </div>
          //   ));
          //   localStorage.setItem("hasShownSessionExpired", "true");
          // }
        }
      }
      return Promise.reject(error);
    }
  );

  // Création du QueryClient pour le SSR
  const queryClient = createQueryClient

  // Rendu du contenu avec QueryClient
  const pageHtml = ReactDOMServer.renderToString(
    <QueryClientProvider client={queryClient}>
      <Layout pageContext={pageContext}>
        <Page />
      </Layout>
    </QueryClientProvider>
  )

  // Déshydratation de l'état pour le client
  const dehydratedState = dehydrate(queryClient)

  const title = getPageTitle(pageContext)
  const desc = pageContext.data?.description || pageContext.config?.description || 'Demo of using Vike'

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />

        <style>
          html {
            scroll-behavior: smooth;
            scrollbar-width: thin;
            scrollbar-color: #000000 transparent;
          }
          html::-webkit-scrollbar {
            width: 0px;
          }
        </style>
        <title>${title}</title>
      </head>
      <body>
        <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
        <div id="modal-root"></div>
        <script>window.__REACT_QUERY_STATE__ = ${dangerouslySkipEscape(JSON.stringify(dehydratedState))};</script>
      </body>
    </html>`

  return {
    documentHtml,
    pageContext: {
      dehydratedState, // Passer l'état déshydraté au client
      api,
      server,
      apiUrl: apiUrlFromHeader,
      serverUrl: serverUrlFromHeader,
      // baseUrl: baseUrlFromHeader,
    }
  }
}

export { onRenderHtml }