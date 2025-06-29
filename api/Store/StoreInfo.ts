import { redisClient } from "../Scalling/bullmqClient.js";

export type StoreInterface = Partial<{
    id: string;
    user_id: string;
    name: string;
    title?: string;
    description?: string;
    slug: string;
    logo: (string | Blob)[],
    favicon: (string | Blob)[],
    cover_image: (string | Blob)[],
    domain_names?: string[];
    current_theme_id: string;
    current_api_id: string;
    expire_at: string;
    disk_storage_limit_gb: number;
    is_active: boolean;
    is_running?: boolean;
    created_at: string;
    updated_at: string;
    url?: string;
    default_domain: string;
    api_url: string;
    timezone?: string,
    currency?: string,
}>

function getStoreIdKey(storeId: string): string { return `store+id+${storeId}`; }

export async function getStoreInfo(storeId: string) {

    let themeSettingsInitial = {};
    let storeInfoInitial: StoreInterface = {
        id: storeId,
        user_id: 'user-id',
        name: 'Demo',
        title: 'Demo',
        description: 'Demo.',
        slug: 'demo',
        logo: ['https://cdn.example.com/store/logo.png'],
        favicon: ['https://cdn.example.com/store/favicon.ico'],
        cover_image: ['https://cdn.example.com/store/cover.jpg'],
        domain_names: ['www.maboutique.com', 'maboutique.store'],
        current_theme_id: 'theme_demo',
        current_api_id: 'api_demo',
        expire_at: '2025-12-31T23:59:59Z',
        disk_storage_limit_gb: 10,
        is_active: true,
        is_running: true,
        created_at: '2025-06-01T10:00:00Z',
        updated_at: '2025-06-20T15:30:00Z',
        url: 'https://www.demo.com',
        default_domain: 'www.demo.com',
        api_url: 'http://api.sublymus-server.com/' + storeId,
        timezone: 'Africa/Abidjan',
        currency: 'XOF'
    }

    if (storeId && redisClient.connection && redisClient.connection.status === 'ready') {
        try {
            const settingsString = await redisClient.connection.get(`theme_settings:${storeId}:mono`); // Clé Redis pour les settings du thème Mono
            if (settingsString) {
                themeSettingsInitial = JSON.parse(settingsString);
                console.log(`[Theme Mono Server] Loaded theme settings for store ${storeId} from Redis.`);
            } else {
                console.log(`[Theme Mono Server] No theme settings found in Redis for store ${storeId}. Using defaults.`);
            }
            const storeInfoString = await redisClient.connection.get(getStoreIdKey(storeId));
            if (storeInfoString) storeInfoInitial = JSON.parse(storeInfoString);

        } catch (err) {
            console.error(`[Theme Mono Server] Error fetching theme settings from Redis for store ${storeId}:`, err);
        }
    } else if (storeId) {
        console.warn(`[Theme Mono Server] Redis not ready, cannot fetch theme settings for store ${storeId}.`);
    }

    return {
        themeSettingsInitial,
        storeInfoInitial
    }
}