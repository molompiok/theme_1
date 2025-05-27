import type { Config } from 'vike/types'

// https://vike.dev/config
export default {
  // https://vike.dev/clientRouting
  clientRouting: true,
  // https://vike.dev/meta
  passToClient: ['pageProps', 'baseUrl', 'lang', 'apiUrl', 'serverUrl'],
  meta: {
    // Define new setting 'title'
    title: {
      env: { server: true, client: true }
    },
    // Define new setting 'description'
    description: {
      env: { server: true }
    }
  },

  hydrationCanBeAborted: true
} satisfies Config
