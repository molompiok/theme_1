import { DehydratedState, QueryClient } from "@tanstack/react-query"
import { AxiosInstance } from "axios"

// https://vike.dev/pageContext#typescript
declare global {
  namespace Vike {
    interface PageContext {
      //@ts-ignore
      Page: () => React.ReactElement
      data?: {
        /** Value for <title> defined dynamically by by /pages/some-page/+data.js */
        title?: string
        /** Value for <meta name="description"> defined dynamically */
        description?: string
      }
      config: {
        /** Value for <title> defined statically by /pages/some-page/+title.js (or by `export default { title }` in /pages/some-page/+config.js) */
        title?: string
        /** Value for <meta name="description"> defined statically */
        description?: string
      }
      /** https://vike.dev/render */
      abortReason?: string


      // sublymus injection
      api: AxiosInstance,
      server: AxiosInstance,
      apiUrl: string,
      serverUrl: string,
      baseUrl: string,
      dehydratedState: DehydratedState,
      queryClient: QueryClient
    }
  }
}

// Tell TypeScript this file isn't an ambient module
export { }
