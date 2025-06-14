// import type { Config } from 'vike/types'
// import vikeReact from 'vike-react'
// // https://vike.dev/config
// export default {
//   // https://vike.dev/clientRouting
//   clientRouting: true,
//   // https://vike.dev/meta
//   passToClient: ['pageProps', 'baseUrl', 'lang', 'apiUrl', 'serverUrl', 'dehydratedState', 'queryClient'],

//   meta: {
//     // Define new setting 'title'
//     title: {
//       env: { server: true, client: true }
//     },
//     // Define new setting 'description'
//     description: {
//       env: { server: true }
//     }
//   },

//   hydrationCanBeAborted: true
// } satisfies Config


import vikeReact from 'vike-react/config'
import { Layout } from './Layout'
import onBeforeRender from './+onBeforeRender'
import { Wrapper } from './Wrapper'
export default {
  Layout,
  Wrapper,
  passToClient: ['pageProps', 'baseUrl', 'lang', 'apiUrl', 'baseUrl', 'serverUrl', 'dehydratedState', 'queryClient'],
  onBeforeRender,
  title: 'Votre Titre par Défaut',
  description: 'Votre description par défaut',
  extends: [vikeReact],
  // Activez le streaming pour une meilleure performance perçue
  // stream: true,
  ssr: true,
}