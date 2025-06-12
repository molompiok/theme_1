import { useQuery } from '@tanstack/react-query';
import { get_store } from '../../../api/user.api';




const useStoreInfo = () => {
    const query = useQuery({
        queryKey: ['store'],
        queryFn: get_store,
        staleTime: 12 * 60 * 60 * 1000,
    });

    return query
};

export default useStoreInfo;