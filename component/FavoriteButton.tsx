import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import React from "react";
import { BsHeartFill, BsXCircle } from "react-icons/bs";
import {
  create_favorite,
  get_favorites,
  delete_favorite,
} from "../api/products.api";
import { useAuthStore, useModalAuth } from "../store/user";
import toast from "react-hot-toast";
import { BiHeartCircle } from "react-icons/bi";
import { LuHeartOff } from "react-icons/lu";
import { IoHeartOutline } from "react-icons/io5";
import Loading from "./Loading";

export default function FavoriteButton({ product_id }: { product_id: string }) {
  const queryClient = useQueryClient();
  const open = useModalAuth((state) => state.open);
  const user = useAuthStore((state) => state.user);

  const {
    data: favorite,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ["get_favorites", product_id],
    queryFn: () => get_favorites({ product_id }),
    enabled: !!product_id && !!user,
    select: (data) =>
      data.length > 0 ? { id: data[0].id, name: data[0].name } : null,
  });

  const addFavoriteMutation = useMutation({
    mutationFn: () => create_favorite({ product_id }),
    onSuccess: (data, _, ctx) => {
      console.log("🚀 ~ FavoriteButton ~ data:", data)
      queryClient.invalidateQueries({
        queryKey: ["get_favorites", product_id],
      });
      toast.custom(
        (t) => (
          <div
            className={`flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-md transition-all duration-300 ${
              t.visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <BsHeartFill className="w-5 h-5 text-orange-600" />
            {isLoading ? (
              <Loading />
            ) : (
              <p className="text-gray-800 text-md font-semibold">
              <span className="font-normal">{data?.product_name}</span> ajouté aux
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
      console.error("Erreur lors de l'ajout du favori :", error),
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: () =>
      favorite?.id ? delete_favorite(favorite.id) : Promise.resolve(false),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get_favorites", product_id],
      });

      toast.custom(
        (t) => (
          <div
            className={`flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-md transition-all duration-300 ${
              t.visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
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
          className={`flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-md transition-all duration-300 ${
            t.visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
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
    <div className="absolute top-3 right-4 z-10">
      {isLoading ||
      isFetching ||
      addFavoriteMutation.isPending ||
      removeFavoriteMutation.isPending ? (
        <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-r-black animate-spin"></div>
      ) : (
        <BsHeartFill
          className={clsx(
            "cursor-pointer text-2xl transition-all duration-300",
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
