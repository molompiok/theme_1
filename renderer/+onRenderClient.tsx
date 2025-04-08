import ReactDOM from "react-dom/client"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { Layout } from "./Layout"
import { getPageTitle } from "./getPageTitle"
import type { OnRenderClientAsync } from "vike/types"
import { ReactQueryProvider } from "./ReactQueryProvider"
import { GOOGLE_CLIENT_ID } from "../api"

let root: ReactDOM.Root

const onRenderClient: OnRenderClientAsync = async (pageContext) => {
  const { Page, dehydratedState } = pageContext

  if (!Page) throw new Error("pageContext.Page is not defined")

  const container = document.getElementById("root")
  if (!container) throw new Error("DOM element #root not found")

  const page = (
    <ReactQueryProvider  dehydratedState={dehydratedState}>
      <GoogleOAuthProvider
        clientId={GOOGLE_CLIENT_ID}
        onScriptLoadError={() => console.error("Google OAuth script loading failed")}
        onScriptLoadSuccess={() => console.log("Google OAuth script loaded")}
      >
        <Layout pageContext={pageContext}>
          <Page />
        </Layout>
      </GoogleOAuthProvider>
    </ReactQueryProvider>
  )

  if (pageContext.isHydration) {
    root = ReactDOM.hydrateRoot(container, page)
  } else {
    if (!root) root = ReactDOM.createRoot(container)
    root.render(page)
  }

  document.title = getPageTitle(pageContext)
}

export { onRenderClient }