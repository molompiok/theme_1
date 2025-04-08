import ReactDOMServer from 'react-dom/server'
import { Layout } from './Layout'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import logoUrl from './logo.svg'
import "./index.css"
import type { OnRenderHtmlAsync } from 'vike/types'
import { getPageTitle } from './getPageTitle'
import { dehydrate, QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient } from './ReactQueryProvider'



const onRenderHtml: OnRenderHtmlAsync = async (pageContext) : ReturnType<OnRenderHtmlAsync> => {
  const { Page } = pageContext
  
  if (!Page) throw new Error('pageContext.Page is not defined')

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
      dehydratedState // Passer l'état déshydraté au client
    }
  }
}

export { onRenderHtml }