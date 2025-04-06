import { useEffect, useState } from 'react';
import clsx from 'clsx';
import Modal from './Modal';
import { BsStar, BsX } from 'react-icons/bs';
import { CommentType } from '../../pages/type';
import { useModalReview } from '../../store/modal';
import { ProductMedia } from '../ProductMedia';
import ReviewsStars from '../comment/ReviewsStars';
import { useMutation } from '@tanstack/react-query';
import { delete_comment } from '../../api/comment.api';
import toast from 'react-hot-toast';
import { createQueryClient } from '../../utils';
import BindTags from '../product/BindTags';

const ReviewProduct = () => {
  const { isModalOpen: isReviewModalOpen, comment, setModalOpen } = useModalReview();

  const closeModal = () => setModalOpen(false);

  const removeCommentMutation = useMutation({
    mutationFn: () =>
      comment?.id ? delete_comment(comment.id) : Promise.resolve(false),
    onError: (error) => {
      console.error("Erreur lors de la suppression du favori :", error);
      toast.error("Erreur lors de la suppression du favori");
    },
    onSuccess: () => {
      toast.success("Avis supprimé");
      createQueryClient.invalidateQueries({
        queryKey: ["comment"],
      });
      closeModal();
    },
  });

  return (
    <Modal
      styleContainer="flex items-end min-[500px]:items-center justify-center select-none size-full transition-all duration-300"
      zIndex={100}
      setHide={closeModal}
      animationName="zoom"
      isOpen={isReviewModalOpen}
      aria-label="Avis client sur le produit"
    >
      <div
        className={clsx(
          "relative bg-white rounded-lg overflow-hidden shadow-xl w-full max-w-[95vw] sm:max-w-lg",
          "flex flex-col max-h-[90vh] overflow-y-auto",
          "transition-all duration-300 ease-in-out"
        )}
      >
        <BsX className="absolute text-2xl top-2 right-2 cursor-pointer" onClick={closeModal}/>
        {/* <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-black/20 to-transparent" /> */}
        <div className="border-b border-gray-300 p-3 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">Avis client </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {comment ? (
            <CommentDisplay comment={comment} />
          ) : (
            <div className="p-8 text-center flex items-center justify-center h-full">
              <p className="text-gray-500 text-base">Aucun avis disponible pour ce produit.</p>
            </div>
          )}
        </div>
        
        <div className="border-t p-3 bg-gray-50">
          <button
            onClick={() => removeCommentMutation.mutate()}
            className="w-full sm:w-auto px-6 py-2 bg-red-200 text-sm hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all duration-200 ease-in-out transform focus:outline-none focus:ring-red-300 focus:ring-opacity-50"
          >
            Supprimer mon avis
          </button>
        </div>
      </div>
    </Modal>
  );
};

const CommentDisplay = ({ comment }: { comment: Partial<CommentType> }) => {

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };
  
  const renderImages = () => {
    if (!comment.views || comment.views.length === 0) return null;
    
    return (
      <div className="mt-6">
        <p className="text-sm font-medium text-gray-700 mb-3">Photos du client :</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {comment.views.map((image, index) => (
            <ProductMedia
              key={index}
              showFullscreen={true}
              mediaList={[...new Set([image, ...(comment?.views || [])])]}
              productName={`${comment.title || 'Image'} ${index + 1}`}
              className="aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 transform"
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{comment?.title}</h3>
        <span className="text-sm text-gray-500 shrink-0">{formatDate(comment?.created_at || '')}</span>
      </div>
      <div className="flex items-center gap-2">
        <ReviewsStars note={comment?.rating || 0}  style='text-orange-600 '/>
        <span className="font-medium text-orange-600 text-xs">
          {comment?.rating ? `${comment.rating}/5` : 'Non noté'}
        </span>
      </div>

      <BindTags tags={comment.bind_name || {}} />

      <p className="text-gray-700 mt-3 max-h-[30dvh] overflow-y-auto text-base leading-relaxed">{comment?.description}</p>
      {renderImages()}
    </div>
  );
};

export default ReviewProduct;


