//renderer/createApiInstance.ts
import axios from 'axios';
import { useAuthStore } from '../store/user'; // Si vous avez des intercepteurs
import { PageContextServer } from 'vike/types';

function parseCookies(cookieString: string | undefined): Record<string, string> {
    if (!cookieString) return {};
    return cookieString.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        if (key && value) {
            acc[key] = value;
        }
        return acc;
    }, {} as Record<string, string>);
}
export async function createApiInstances(pageContext: PageContextServer) {
    const { headers: pageContextHeaders, storeInfo } = pageContext;
    const isProd = process.env.NODE_ENV === "production";
    const protocol = isProd ? "https://" : "http://";
    const originalHeaders = pageContextHeaders || {};
    // console.log({ originalHeaders }, '***-*-*-*-*-*-*-*-*-*-*-*-*-*/*/*/**/**');
    let apiUrl = (originalHeaders["x-store-api-url"] || "http://api.sublymus-server.com/0ee68a0e-956b-48d9-96c9-0080878535e5");
    // S'assurer que serverApiUrl utilise le bon protocole selon l'environnement
    const defaultServerApiUrl = isProd ? `${protocol}server.sublymus.com` : `${protocol}server.sublymus-server.com`;
    let serverApiUrl = originalHeaders["x-server-api-url"] || defaultServerApiUrl;
    // Si serverApiUrl est fourni mais sans protocole, utiliser le protocole approprié
    if (serverApiUrl && !serverApiUrl.startsWith('http://') && !serverApiUrl.startsWith('https://')) {
        serverApiUrl = `${protocol}${serverApiUrl.replace(/^\/\//, '')}`;
    }
    const baseUrl = (originalHeaders["x-base-url"] || "/");
    const storeId = originalHeaders["x-store-id"] || "0ee68a0e-956b-48d9-96c9-0080878535e5";
    const tokenFromCookie = parseCookies(pageContextHeaders?.cookie);

    if (tokenFromCookie) {
        useAuthStore.setState({ token: tokenFromCookie['auth-token'] });
    } else {
        // S'il n'y a pas de cookie, on s'assure que le store est bien vide
        useAuthStore.setState({ token: null, user: null });
    }

    const api = axios.create({ baseURL: apiUrl, timeout: 25000, withCredentials: true });
    api.interceptors.request.use(config => {
        const token = useAuthStore.getState().token;

        if (token && config.headers) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    });

    // Création de l'instance `server`
    const server = axios.create({ baseURL: serverApiUrl, timeout: 25000, withCredentials: true });

    return {
        api,
        server,
        baseUrl,
        apiUrl,
        storeId,
        serverApiUrl,
        storeInfo,
    };
}


