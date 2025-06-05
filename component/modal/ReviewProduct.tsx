import { useEffect, useState } from "react";
import clsx from "clsx";
import Modal from "./Modal";
import { BsStar, BsX, BsTrash3, BsCalendar3, BsImages } from "react-icons/bs";
import { CommentType } from "../../pages/type";
import { useModalReview } from "../../store/modal";
import { ProductMedia } from "../ProductMedia";
import ReviewsStars from "../comment/ReviewsStars";
import { useMutation } from "@tanstack/react-query";
import { delete_comment } from "../../api/comment.api";
import toast from "react-hot-toast";
import { createQueryClient } from "../../renderer/ReactQueryProvider";
import BindTags from "../product/BindTags";

const ReviewProduct = () => {
  const {
    isModalOpen: isReviewModalOpen,
    comment,
    setModalOpen,
  } = useModalReview();
  const [isDeleting, setIsDeleting] = useState(false);

  const closeModal = () => setModalOpen(false);

  const removeCommentMutation = useMutation({
    mutationFn: () =>
      comment?.id ? delete_comment(comment.id) : Promise.resolve(false),
    onMutate: () => {
      setIsDeleting(true);
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression du favori :", error);
      toast.error("Erreur lors de la suppression du favori");
      setIsDeleting(false);
    },
    onSuccess: () => {
      toast.success("Avis supprimé avec succès");
      createQueryClient.invalidateQueries({
        queryKey: ["comment"],
      });
      setIsDeleting(false);
      closeModal();
    },
  });

  return (
    <Modal
      styleContainer="flex items-end min-[500px]:items-center justify-center select-none size-full transition-all duration-300 backdrop-blur-sm"
      zIndex={100}
      setHide={closeModal}
      animationName="zoom"
      isOpen={isReviewModalOpen}
      aria-label="Avis client sur le produit"
    >
      <div
        className={clsx(
          "relative bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-[95vw] sm:max-w-2xl",
          "flex flex-col max-h-[90vh] overflow-hidden",
          "transition-all duration-500 ease-out transform",
          "border border-gray-100"
        )}
      >
        {/* Header avec gradient subtil */}
        <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
          <div className="relative px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <BsStar className="text-white text-lg" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                Avis client
              </h2>
            </div>
            <button
              onClick={closeModal}
              className="p-2 hover:bg-white/80 rounded-full transition-all duration-200 group"
              aria-label="Fermer"
            >
              <BsX className="text-2xl text-gray-500 group-hover:text-gray-700 transition-colors" />
            </button>
          </div>
        </div>

        {/* Contenu principal avec scroll personnalisé */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {comment ? (
            <CommentDisplay comment={comment} />
          ) : (
            <div className="p-12 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <BsStar className="text-2xl text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium mb-2">
                Aucun avis disponible
              </p>
              <p className="text-gray-400 text-sm">
                Ce produit n'a pas encore reçu d'avis client.
              </p>
            </div>
          )}
        </div>

        {/* Footer avec action */}
        {comment && (
          <div className="border-t border-gray-100 px-4 py-2 bg-gray-50/50 backdrop-blur-sm">
            <button
              onClick={() => removeCommentMutation.mutate()}
              disabled={isDeleting}
              className={clsx(
                "group relative overflow-hidden px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 transform",
                "flex items-center gap-2 min-w-[180px] justify-center",
                isDeleting
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 hover:scale-105 hover:shadow-lg focus:ring-4 focus:ring-red-200"
              )}
            >
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              <BsTrash3
                className={clsx(
                  "relative z-10 transition-transform duration-200",
                  isDeleting ? "animate-pulse" : "group-hover:scale-110"
                )}
              />
              <span className="relative z-10">
                {isDeleting ? "Suppression..." : "Supprimer l'avis"}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Styles CSS pour le scroll personnalisé */}
      {/* <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #cbd5e1, #94a3b8);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #94a3b8, #64748b);
        }
      `}</style> */}
    </Modal>
  );
};

const CommentDisplay = ({ comment }: { comment: Partial<CommentType> }) => {
  const [imageError, setImageError] = useState<Set<number>>(new Set());

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const renderImages = () => {
    if (!comment.views || comment.views.length === 0) return null;

    return (
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <BsImages className="text-gray-600 text-lg" />
          <p className="text-base font-semibold text-gray-800">
            Photos du client
          </p>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
            {comment.views.length}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {comment.views.map((image, index) => (
            <div
              key={index}
              className="group relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <ProductMedia
                showFullscreen={true}
                mediaList={[...new Set([image, ...(comment?.views || [])])]}
                productName={`${comment.title || "Image"} ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 space-y-6">
      {/* En-tête de l'avis */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <h3 className="text-2xl font-bold text-gray-900 leading-tight line-clamp-2 flex-1">
            {comment?.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500 shrink-0 bg-gray-50 px-3 py-2 rounded-lg">
            <BsCalendar3 className="text-gray-400" />
            <span>{formatDate(comment?.created_at || "")}</span>
          </div>
        </div>

        {/* Note avec étoiles améliorées */}
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-100">
          <div className="flex items-center gap-2">
            <ReviewsStars
              note={comment?.rating || 0}
              style="text-orange-500 text-lg"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-orange-600 text-lg">
              {comment?.rating ? `${comment.rating}/5` : "Non noté"}
            </span>
            <span className="text-xs text-orange-600/70">
              {comment?.rating !== undefined && comment?.rating !== null && comment?.rating >= 4
                ? "Excellent"
                : comment?.rating !== undefined && comment?.rating !== null && comment?.rating >= 3
                ? "Bien"
                : comment?.rating !== undefined && comment?.rating !== null && comment?.rating >= 2
                ? "Moyen"
                : "À améliorer"}
            </span>
          </div>
        </div>

        {/* Tags avec design amélioré */}
        <div className="bg-white border border-gray-100 rounded-xl px-4 py-2">
          <BindTags tags={comment.bind_name || {}} />
        </div>
      </div>

      {/* Description avec meilleure typographie */}
      <div className="space-y-3">
        <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
          Commentaire détaillé
        </h4>
        <div className="bg-gray-50 rounded-xl px-4 py-2 border border-gray-100">
          <p className="text-gray-700 text-base leading-relaxed max-h-[30vh] overflow-y-auto custom-scrollbar whitespace-pre-wrap">
            {comment?.description || "Aucun commentaire détaillé fourni."}
          </p>
        </div>
      </div>

      {/* Images avec design amélioré */}
      {renderImages()}
    </div>
  );
};

export default ReviewProduct;
