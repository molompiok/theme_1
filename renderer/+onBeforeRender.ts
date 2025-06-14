//renderer/+onBeforeRender.ts
import { createQueryClient } from './ReactQueryProvider';
import { createApiInstances } from './createApiInstance';
import { dehydrate } from '@tanstack/react-query';
import { get_store } from '../api/user.api';

export default async function onBeforeRender(pageContext: any) {
    const { api, server, apiUrl, serverUrl } = createApiInstances(pageContext);

    const queryClient = createQueryClient();
    // --- PRÉ-CHARGEMENT DES DONNÉES (EXEMPLE) ---
    // Par exemple, les informations du magasin
    // await queryClient.prefetchQuery({ queryKey: ['store-info'], queryFn: () => get_store(api, serverUrl, apiUrl) });

    const dehydratedState = dehydrate(queryClient);

    return {
        pageContext: {
            api,
            server,
            apiUrl,
            serverUrl,
            dehydratedState,
        },
    };
}