import { useQuery } from '@tanstack/react-query';
import { get_store } from '../../../api/user.api';
import { AxiosInstance } from 'axios';




const useStoreInfo = (api: AxiosInstance, serverUrl: string, apiUrl: string) => {
    const query = useQuery({
        queryKey: ['store-info'],
        queryFn: () => get_store(api, serverUrl, apiUrl),
        staleTime: 12 * 60 * 60 * 1000,
    });

    return query
};

export default useStoreInfo;