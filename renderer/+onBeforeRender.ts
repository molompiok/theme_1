//renderer/+onBeforeRender.ts
import { createQueryClient } from './ReactQueryProvider';
import { createApiInstances } from './createApiInstance';
import { dehydrate } from '@tanstack/react-query';

export default async function onBeforeRender(pageContext: any) {
    const { api, server, apiUrl, serverApiUrl, baseUrl, storeId, storeInfo } = await createApiInstances(pageContext);

    const queryClient = createQueryClient();
    // --- PRÉ-CHARGEMENT DES DONNÉES (EXEMPLE) ---
    // Par exemple, les informations du magasin
    // await queryClient.prefetchQuery({ queryKey: ['store-info'], queryFn: () => get_store(api, serverApiUrl, apiUrl) });

    const dehydratedState = dehydrate(queryClient);

    return {
        pageContext: {
            api,
            server,
            apiUrl,
            serverApiUrl,
            baseUrl,
            storeId,
            dehydratedState,
            storeInfo
        },
    };
}