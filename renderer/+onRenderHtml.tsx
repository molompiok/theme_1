import ReactDOMServer from "react-dom/server";
import { Layout } from "./Layout";
import { escapeInject, dangerouslySkipEscape } from "vike/server";
import logoUrl from "./logo.svg";
import "./index.css";
import type { OnRenderHtmlAsync } from "vike/types";
import { getPageTitle } from "./getPageTitle";
import { dehydrate, QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "./ReactQueryProvider";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { BASE_URL, api as globalApi } from "../api/index";
import { useAuthStore } from "../store/user";
import { parse as parseCookie } from "cookie";

const isProd = process.env.NODE_ENV == "production";

const onRenderHtml: OnRenderHtmlAsync = async (
  pageContext
): ReturnType<OnRenderHtmlAsync> => {
  const { Page, headers: pageContextHeaders } = pageContext;

  if (!Page) throw new Error("pageContext.Page is not defined");

  const host = isProd ? "https://" : "http://";

  const headersOriginal = (pageContextHeaders as Record<string, string>) || {};
  // const baseUrlFromHeader = host + headersOriginal['x-base-url'] || '';
  const originalHeaders = (pageContextHeaders as Record<string, string>) || {};
  const apiUrlFromHeader =
    host +
    (headersOriginal["x-store-api-url"] ||
      "api.sublymus-server.com/0ee68a0e-956b-48d9-96c9-0080878535e5");
  const serverUrlFromHeader =
    host +
    (headersOriginal["x-server-api-url"] || isProd
      ? "server.sublymus.com"
      : "server.sublymus-server.com");

  // --- START: Auth Token Handling for SSR ---
  //  const cookieHeader = originalHeaders.cookie || '';
  //  const cookies = parseCookie(cookieHeader);
  //  const serverSideToken = cookies.authToken; // <<< ADJUST 'authToken' if your cookie has a different name

  // Temporarily set the token for this SSR request.
  // This ensures that API calls made during this server render use the token.
  // We also reset it after rendering or if no token, to prevent state leakage between requests.
  // A more robust solution for complex apps might involve request-scoped stores,
  // but direct manipulation is common for simpler Vike setups.
  //  if (serverSideToken) {
  //    useAuthStore.setState({ token: serverSideToken, wasLoggedIn: true }); // Assume wasLoggedIn if token exists
  //    console.log("🚀 ~ SSR: Token from cookie found and set in store:", serverSideToken);
  //  } else {
  //    // Ensure store is reset if no token from cookie
  //    useAuthStore.setState({ token: null, user: null, wasLoggedIn: false });
  //    console.log("🚀 ~ SSR: No auth token cookie found.");
  //  }
  // --- END: Auth Token Handling for SSR ---

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

  BASE_URL.apiUrl = apiUrlFromHeader;
  BASE_URL.serverUrl = serverUrlFromHeader;
  globalApi.api = api;
  globalApi.server = server;

  console.log({
    apiUrl: apiUrlFromHeader,
    serverUrl: serverUrlFromHeader,
  });

  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Get token directly from store. It should be populated by the cookie logic above for SSR.
      const token = useAuthStore.getState().token;
      if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
      } else {
        console.log(
          "SSR Interceptor Request: No token found or no headers object."
        );
      }
      return config;
    },
    (error: AxiosError) => {
      console.error("SSR Interceptor Request Error:", error);
      return Promise.reject(error);
    }
  );

  // api.interceptors.response.use(
  //   (response) => response,
  //   (error: AxiosError) => {
  //     if (error.code === "ERR_NETWORK" || error.code === "ECONNABORTED") {
  //       console.error("SSR Interceptor Response: Network or Timeout Error", error.message);
  //       return Promise.reject(new Error("Erreur Réseau ou Timeout"));
  //     }
  //     console.error(
  //       "SSR Interceptor Response Error:",
  //       error.response?.status,
  //       error.response?.data || error.message,
  //       error.config?.url
  //     );
  //     const status = error.response?.status;
  //     // The logout logic based on wasLoggedIn is more of a client-side concern.
  //     // On SSR, a 401 usually means the token from cookie is invalid/expired.
  //     // We've already reset the store if no token was found.
  //     // If a token *was* found and led to a 401, the client will handle login upon hydration.
  //     if (status === 401) {
  //       console.warn("SSR: Received 401. Token might be invalid or expired.");
  //       // Optionally clear the token in store again if an API call with it failed
  //       useAuthStore.getState().logout();
  //     }
  //     return Promise.reject(error);
  //   }
  // );

  // Création du QueryClient pour le SSR
  const queryClient = createQueryClient;

  // Rendu du contenu avec QueryClient
  const pageHtml = ReactDOMServer.renderToString(
    <QueryClientProvider client={queryClient}>
      <Layout pageContext={pageContext}>
        <Page />
      </Layout>
    </QueryClientProvider>
  );

  // Déshydratation de l'état pour le client
  const dehydratedState = dehydrate(queryClient);

  const title = getPageTitle(pageContext);
  const desc =
    pageContext.data?.description ||
    pageContext.config?.description ||
    "Decouvrez nos produits";

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
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
        <script>
          window.__REACT_QUERY_STATE__ = ${dangerouslySkipEscape(
            JSON.stringify(dehydratedState)
          )};
          window.__INITIAL_AUTH_STATE__ = ${dangerouslySkipEscape(
            JSON.stringify({
              // Pass initial auth state for client
              user: useAuthStore.getState().user,
              token: useAuthStore.getState().token, // This might be the server-side token
              wasLoggedIn: useAuthStore.getState().wasLoggedIn,
            })
          )};
        </script>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      dehydratedState, // Passer l'état déshydraté au client
      api,
      server,
      apiUrl: apiUrlFromHeader,
      serverUrl: serverUrlFromHeader,
      // baseUrl: baseUrlFromHeader,
    },
  };
};

export { onRenderHtml };
