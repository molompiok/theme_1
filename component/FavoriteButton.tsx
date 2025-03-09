import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import React from 'react';
import { BsHeartFill } from 'react-icons/bs';
import { create_favorite, get_favorites, delete_favorite } from '../api/products.api';
import { useAuthStore, useModalAuth } from '../store/user';

export default function FavoriteButton({ product_id }: { product_id: string }) {
    const queryClient = useQueryClient();
   const open =  useModalAuth(state => state.open)
   const user = useAuthStore(state => state.user)

    const { data: favoriteId, isFetching , isLoading} = useQuery({
        queryKey: ['get_favorites', product_id],
        queryFn: () => get_favorites({ product_id }),
        enabled: !!product_id,
        select: (data) => data.length > 0 ? data[0].id : null,
    });

    const addFavoriteMutation = useMutation({
        mutationFn: () => create_favorite({ product_id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get_favorites'] });
        },
        onError: (error) => console.error("Erreur lors de l'ajout du favori :", error),
    });

    const removeFavoriteMutation = useMutation({
        mutationFn: () => favoriteId ? delete_favorite(favoriteId) : Promise.resolve(false),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get_favorites'] });
        },
        onError: (error) => console.error("Erreur lors de la suppression du favori :", error),
    });

    const toggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (addFavoriteMutation.isPending || removeFavoriteMutation.isPending) return;
        if (!user) {
            open('login' , 'Vous devez vous connecter pour ajouter un favori')
            return
        }

        if (favoriteId) {
            removeFavoriteMutation.mutate();
        } else {
            addFavoriteMutation.mutate();
        }
    };

    return (
        <div className="absolute top-3 right-4 z-10">
            {isLoading || isFetching || addFavoriteMutation.isPending || removeFavoriteMutation.isPending ? (
                <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-r-black animate-spin"></div>
            ) : (
                <BsHeartFill
                    className={clsx(
                        "cursor-pointer text-2xl transition-all duration-300",
                        favoriteId ? "text-orange-600 font-extrabold" : "text-gray-400 font-light"
                    )}
                    onClick={toggleFavorite}
                />
            )}
        </div>
    );
}
