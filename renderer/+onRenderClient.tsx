import ReactDOM from "react-dom/client";
import { Layout } from "./Layout";
import { getPageTitle } from "./getPageTitle";
import type { OnRenderClientAsync } from "vike/types";
import { ReactQueryProvider } from "./ReactQueryProvider";
import { BASE_URL } from "../api";
import { api as globalApi } from "../api/index";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/user";
import { User } from "../pages/type";
let root: ReactDOM.Root;

declare global {
  interface Window {
    __INITIAL_AUTH_STATE__?: {
      user: User | null;
      token: string | null;
      wasLoggedIn: boolean;
    };
  }
}

const onRenderClient: OnRenderClientAsync = async (pageContext) => {
  const { Page, dehydratedState } = pageContext;

  if (!Page) throw new Error("pageContext.Page is not defined");

  if (typeof window !== "undefined" && window.__INITIAL_AUTH_STATE__) {
    const initialAuth = window.__INITIAL_AUTH_STATE__;
    const currentStoreToken = useAuthStore.getState().token;

    // Only set if the store isn't already populated (e.g. by a fast persist)
    // and server provided a token.
    // Persist middleware might overwrite this if localStorage has a different token.
    if (!currentStoreToken && initialAuth.token) {
      useAuthStore.setState({
        user: initialAuth.user,
        token: initialAuth.token,
        wasLoggedIn: initialAuth.wasLoggedIn,
      });
    }
    // Clean up global variable
    delete window.__INITIAL_AUTH_STATE__;
  }

  let apiUrl = "";
  if (pageContext.apiUrl) {
    apiUrl = pageContext.apiUrl;
    localStorage.setItem("apiUrl", pageContext.apiUrl);
  } else {
    apiUrl = localStorage.getItem("apiUrl") || "";
  }

  let serverUrl = "";
  if (pageContext.serverUrl) {
    serverUrl = pageContext.serverUrl;
    localStorage.setItem("serverUrl", pageContext.serverUrl);
  } else {
    serverUrl = localStorage.getItem("serverUrl") || "";
  }

  const api = axios.create({
    baseURL: apiUrl,
    timeout: 25000,
    withCredentials: false,
  });

  const server = axios.create({
    baseURL: pageContext.serverUrl,
    timeout: 25000,
    withCredentials: false,
  });

  pageContext.api = api;
  pageContext.server = server;

  BASE_URL.apiUrl = apiUrl;
  BASE_URL.serverUrl = serverUrl;
  globalApi.api = api;
  globalApi.server = server;

  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = useAuthStore.getState().token; // This will be from localStorage via persist
      if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
      } else {
        console.log(
          "Client Interceptor Request: No token found or no headers object."
        );
      }
      return config;
    },
    (error: AxiosError) => {
      console.error("Client Interceptor Request Error:", error);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.code === "ERR_NETWORK" || error.code === "ECONNABORTED") {
        console.error(
          "Client Interceptor Response: Network or Timeout Error",
          error.message
        );
        return Promise.reject(new Error("Erreur Réseau ou Timeout"));
      }
      console.error(
        "Client Interceptor Response Error:",
        error.response?.status,
        error.response?.data || error.message,
        error.config?.url
      );
      const status = error.response?.status;
      if (status === 401 && typeof window !== "undefined") {
        const { wasLoggedIn, logout, token } = useAuthStore.getState();
        if (token && wasLoggedIn) {
          // Check if wasLoggedIn is true. Or simply if token exists.
          console.warn(
            "Client: Session expirée ou invalide (401), déconnexion automatique."
          );
          logout(); // This will clear the token and user
        } else if (token && !useAuthStore.getState().user) {
          console.warn(
            "Client: Stale token found without user (401), clearing token."
          );
          logout(); // Or just useAuthStore.setState({ token: null, user: null, wasLoggedIn: false });
        }
      }
      return Promise.reject(error);
    }
  );

  const container = document.getElementById("root");
  if (!container) throw new Error("DOM element #root not found");

  const page = (
    <ReactQueryProvider dehydratedState={dehydratedState}>
      <Layout pageContext={pageContext}>
        <Page />
      </Layout>
    </ReactQueryProvider>
  );

  if (pageContext.isHydration) {
    root = ReactDOM.hydrateRoot(container, page);
  } else {
    if (!root) root = ReactDOM.createRoot(container);
    root.render(page);
  }

  document.title = getPageTitle(pageContext);
};

export { onRenderClient };
