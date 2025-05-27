import ReactDOM from "react-dom/client"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { Layout } from "./Layout"
import { getPageTitle } from "./getPageTitle"
import type { OnRenderClientAsync } from "vike/types"
import { ReactQueryProvider } from "./ReactQueryProvider"
import { BASE_URL, GOOGLE_CLIENT_ID } from "../api"
import { api as globalApi } from "../api/index";
import axios from "axios";
import { useAuthStore } from "../store/user"
let root: ReactDOM.Root

const onRenderClient: OnRenderClientAsync = async (pageContext) => {
  const { Page, dehydratedState } = pageContext

  if (!Page) throw new Error("pageContext.Page is not defined")

    const api = axios.create({
      baseURL: pageContext.apiUrl,
      timeout: 25000,
      withCredentials: true,
    });
  
    const server = axios.create({
      baseURL: pageContext.serverUrl,
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