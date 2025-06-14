import { QueryClient, useMutation } from "@tanstack/react-query";
import { create_comment } from "../../../api/comment.api";
import toast from "react-hot-toast";
import { AxiosInstance } from "axios";
import { useQueryClient } from "@tanstack/react-query";

export const useCreateComment = (api: AxiosInstance) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: Parameters<typeof create_comment>[0]) => create_comment(params, api),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["comment"] })
      toast.success("Commentaire créé avec succès");
    },
    onError: async (error) => {
      console.error("Erreur lors de la création du commentaire :", error);
      await queryClient.invalidateQueries({ queryKey: ["comment"] })
      toast.error("Erreur lors de la création du commentaire");
    },
  });
};