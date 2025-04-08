import { QueryClient, useMutation } from "@tanstack/react-query";
import { create_comment } from "../../../api/comment.api";
import toast from "react-hot-toast";
import { createQueryClient } from "../../../renderer/ReactQueryProvider";

export const useCreateComment = () => {
  return useMutation({
    mutationFn: create_comment,
    onSuccess: async (data) => {
      await createQueryClient.invalidateQueries({ queryKey: ["comment"] })
      toast.success("Commentaire créé avec succès");
    },
    onError: async (error) => {
      console.error("Erreur lors de la création du commentaire :", error);
      await createQueryClient.invalidateQueries({ queryKey: ["comment"] })
      toast.error("Erreur lors de la création du commentaire");
    },
  });
};