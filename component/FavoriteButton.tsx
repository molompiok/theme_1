import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import React from "react";
import { BsHeartFill } from "react-icons/bs";
import {
  create_favorite,
  get_favorites,
  delete_favorite,
} from "../api/products.api";
import { useAuthStore, useModalAuth } from "../store/user";
import toast from "react-hot-toast";
import { LuHeartOff } from "react-icons/lu";
import Loading from "./Loading";
import { usePageContext } from "vike-react/usePageContext";

export default function FavoriteButton({
  product_id,
  style,
  className,
  size,
}: {
  product_id: string;
  style?: React.CSSProperties;
  className?: string;
  size?: number;
}) {
  const open = useModalAuth((state) => state.open);
  const user = useAuthStore((state) => state.user);
  const { api } = usePageContext()
  const {
    data: favorite,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ["get_favorites", product_id],
    queryFn: () => get_favorites({ product_id }, api),
    enabled: !!product_id && !!user,
    select: (data) =>
      data?.list?.length ?? 0 > 0
        ? { id: data?.list[0].id, name: data?.list[0].product.name }
        : null,
  });
  const queryClient = useQueryClient();
  const addFavoriteMutation = useMutation({
    mutationFn: () => create_favorite({ product_id }, api),
    onSuccess: (data, _, ctx) => {
      queryClient.invalidateQueries({
        queryKey: ["get_favorites"],
      });
      toast.custom(
        (t) => (
          <div
            className={`flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-md transition-all duration-300 ${t.visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
          >
            <BsHeartFill className="w-5 h-5 text-orange-600" />
            {isLoading ? (
              <Loading />
            ) : (
              <p className="text-gray-800 text-md font-semibold">
                <span className="font-normal">{data?.product_name}</span> ajouté
                aux favoris
              </p>
            )}
          </div>
        ),
        {
          position: "top-center",
        }
      );
    },
    onError: (error) =>
      console.error("Erreur lors de l'ajout du favori :", error),
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: () =>
      favorite?.id ? delete_favorite(favorite.id, api) : Promise.resolve(false),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get_favorites"],
      });

      toast.custom(
        (t) => (
          <div
            className={`flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-md transition-all duration-300 ${t.visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
          >
            <LuHeartOff className="w-5 h-5 text-gray-500" />
            {isLoading ? (
              <Loading />
            ) : (
              <p className="text-gray-800 text-md font-semibold">
                <span className="font-normal">{favorite?.name}</span> retiré des
                favoris
              </p>
            )}
          </div>
        ),
        {
          position: "top-center",
        }
      );
    },
    onError: (error) =>
      console.error("Erreur lors de la suppression du favori :", error),
  });

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (addFavoriteMutation.isPending || removeFavoriteMutation.isPending)
      return;
    const message = "Vous devez vous connecter pour ajouter un favori";
    if (!user) {
      open("login", message);
      toast.custom((t) => (
        <div
          className={`flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-md transition-all duration-300 ${t.visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
        >
          <LuHeartOff className="w-5 h-5 text-gray-500" />
          <p className="text-gray-800 text-md font-semibold">{message}</p>
        </div>
      ));
      return;
    }

    if (favorite?.id) {
      removeFavoriteMutation.mutate();
    } else {
      addFavoriteMutation.mutate();
    }
  };

  return (
    <div className={clsx("absolute z-10", className)} style={style}>
      {isLoading ||
        isFetching ||
        addFavoriteMutation.isPending ||
        removeFavoriteMutation.isPending ? (
        <div className="rounded-full border-2 border-t-transparent border-r-black animate-spin w-8 h-8 sm:w-10 sm:h-10"></div>
      ) : (
        <BsHeartFill
          className={clsx(
            "cursor-pointer transition-all duration-300",
            // JUSTE changer la taille - mobile plus grand, desktop encore plus grand
            "text-3xl sm:text-4xl md:text-5xl",
            favorite?.id
              ? "text-orange-600 font-extrabold"
              : "text-gray-400 font-light"
          )}
          onClick={toggleFavorite}
        />
      )}
    </div>
  );
}