import clsx from "clsx";
import Modal from "./Modal";
import { useState, useEffect, useRef, useCallback, memo, ChangeEvent } from "react";
import { useModalCommentStore } from "../../store/modal";
import { useCreateComment } from "../../hook/query/comment/useCreateComment";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/user";
import { usePageContext } from "vike-react/usePageContext";

interface ModalCommentStore {
  isModalOpen: boolean;
  product: { product_id: string; name: string; order_item_id: string } | null;
  setModalOpen: (open: boolean) => void;
}

interface StarRatingProps {
  rating: number;
  hoverRating: number;
  onStarHover: (value: number) => void;
  onStarClick: (value: number) => void;
  error: string;
  feedback: string;
}

const StarRating = memo(({
  rating,
  hoverRating,
  onStarHover,
  onStarClick,
  error,
  feedback
}: StarRatingProps) => (
  <div className="flex flex-col items-center gap-4 py-6">
    <div className="flex gap-1 p-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onStarClick(star)}
          onMouseEnter={() => onStarHover(star)}
          onMouseLeave={() => onStarHover(0)}
          aria-label={`Noter ${star} sur 5`}
          className={clsx(
            "text-4xl focus:outline-none transition-all duration-300 transform",
            "hover:scale-125 focus:scale-125 active:scale-110",
            "relative group",
            (hoverRating >= star || rating >= star) 
              ? "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" 
              : "text-slate-300 hover:text-amber-300"
          )}
        >
          <span className="relative z-10">★</span>
          <div className={clsx(
            "absolute inset-0 rounded-full blur-sm transition-all duration-300",
            (hoverRating >= star || rating >= star) 
              ? "bg-amber-400/30 scale-150" 
              : "bg-transparent"
          )} />
        </button>
      ))}
    </div>
    <input type="hidden" name="rating" value={rating} />
    <div className="text-center space-y-2">
      <p className={clsx(
        "text-base font-semibold transition-all duration-300",
        rating === 0 ? "text-slate-500" : "text-amber-600"
      )}>
        {feedback}
      </p>
      {rating > 0 && (
        <div className="flex items-center justify-center gap-1 text-sm text-amber-600">
          <span>{rating}</span>
          <span>/</span>
          <span>5</span>
        </div>
      )}
    </div>
    {error && (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-in slide-in-from-top-2">
        <p className="text-red-600 text-sm font-medium flex items-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      </div>
    )}
  </div>
));

interface ImageUploaderProps {
  imagePreviews: string[];
  onImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onTriggerFileInput: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  maxImages: number;
  maxImageSize: number;
}

const ImageUploader = memo(({
  imagePreviews,
  onImageUpload,
  onRemoveImage,
  onTriggerFileInput,
  fileInputRef,
  maxImages,
  maxImageSize
}: ImageUploaderProps) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
        <svg className="w-4 h-4 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
        Photos de votre expérience
      </label>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
          {imagePreviews.length}/{maxImages}
        </span>
      </div>
    </div>
    
    <input
      type="file"
      name="views"
      multiple
      max={3}
      ref={fileInputRef}
      onChange={onImageUpload}
      accept="image/*"
      className="hidden"
      aria-label="Ajouter des photos"
    />

    <div className="grid grid-cols-3 gap-3">
      {imagePreviews.map((preview, index) => (
        <div key={index} className="relative group aspect-square">
          <img
            src={preview}
            alt={`Aperçu ${index + 1}`}
            className="object-cover w-full h-full rounded-xl border-2 border-slate-200 transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 rounded-xl" />
          <button
            type="button"
            onClick={() => onRemoveImage(index)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
            aria-label="Supprimer cette image"
          >
            <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      ))}
      
      {imagePreviews.length < maxImages && (
        <button
          type="button"
          onClick={onTriggerFileInput}
          className="border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-4 aspect-square transition-all duration-200 hover:border-amber-400 hover:bg-amber-50 focus:outline-none focus:border-amber-500 focus:bg-amber-50 group"
          aria-label="Ajouter des photos"
        >
          <div className="bg-slate-100 group-hover:bg-amber-100 p-3 rounded-full transition-colors duration-200">
            <svg className="w-6 h-6 text-slate-400 group-hover:text-amber-500 transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xs text-slate-500 group-hover:text-amber-600 mt-2 font-medium transition-colors duration-200">
            Ajouter
          </span>
        </button>
      )}
    </div>
    
    <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
      <span className="font-medium">Formats acceptés:</span> JPG, PNG, WEBP • <span className="font-medium">Taille max:</span> {maxImageSize}MB par image
    </p>
  </div>
));

const ThankYouMessage = memo(() => (
  <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
    <div className="relative">
      <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-30 animate-pulse" />
      <div className="relative bg-gradient-to-r from-emerald-400 to-emerald-500 text-white text-6xl p-6 rounded-full shadow-2xl animate-in zoom-in-50 duration-500">
        ✓
      </div>
    </div>
    <h3 className="text-2xl font-bold text-slate-800 mt-6 mb-3 animate-in slide-in-from-bottom-4 duration-700">
      Merci pour votre avis !
    </h3>
    <p className="text-slate-600 text-center max-w-sm animate-in slide-in-from-bottom-4 duration-700 delay-100">
      Votre contribution précieuse aide notre communauté à faire de meilleurs choix
    </p>
    <div className="mt-6 flex items-center gap-2 text-sm text-emerald-600 animate-in slide-in-from-bottom-4 duration-700 delay-200">
      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
      <span>Avis publié avec succès</span>
    </div>
  </div>
));

export const ReviewModal = () => {
  const { isModalOpen, product, setModalOpen } = useModalCommentStore();
  const { api } = usePageContext();
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>(""); 
  const [errors, setErrors] = useState<{ title: string; rating: string; description: string }>({ title: "", rating: "", description: "" });
  const [ratingFeedback, setRatingFeedback] = useState<string>("Cliquez sur une étoile pour évaluer");
  const [showThankYou, setShowThankYou] = useState<boolean>(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: createComment, isPending: isCreatingComment } = useCreateComment(api);
  const MAX_IMAGES: number = 3;
  const MAX_IMAGE_SIZE_MB: number = 1;

  useEffect(() => {
    if (isModalOpen) {
      setErrors({ title: "", rating: "", description: "" });
      setShowThankYou(false);
    }
  }, [isModalOpen]);

  useEffect(() => {
    setRatingFeedback(getRatingFeedback(rating));
    
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [rating, imagePreviews]);

  const getRatingFeedback = useCallback((value: number): string => {
    switch (value) {
      case 1: return "Pas du tout satisfait";
      case 2: return "Quelques améliorations nécessaires";
      case 3: return "Globalement satisfait";
      case 4: return "Très satisfait, je recommande";
      case 5: return "Excellent, parfait en tous points !";
      default: return "Cliquez sur une étoile pour évaluer";
    }
  }, []);

  const handleStarHover = useCallback((starValue: number) => {
    setHoverRating(starValue);
  }, []);

  const handleStarClick = useCallback((starValue: number) => {
    setRating(starValue);
    setErrors((prev) => ({ ...prev, rating: "" }));
  }, []);

  const handleDescriptionChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDescription(value);
    setErrors(prev => ({
      ...prev,
      description: value.length > 0 && (value.length < 24 || value.length > 512)
        ? "Description entre 24 et 512 caractères, ou laissez vide"
        : ""
    }));
  }, []);

  const validateForm = useCallback((): boolean => {
    let isValid = true;
    const newErrors = { title: "", rating: "", description: "" };

    if (!title.trim() || title.length > 124) {
      newErrors.title = "Un titre est requis pour résumer votre avis";
      isValid = false;
    }

    if (description.length > 0 && (description.length < 5 || description.length > 512)) {
      newErrors.description = "Description entre 5 et 512 caractères, ou laissez vide";
      isValid = false;
    }
    
    if (!product) {
      newErrors.title = "Produit non sélectionné";
      isValid = false;
    }
    
    if (!rating) {
      newErrors.rating = "Votre évaluation est essentielle pour nous aider";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [title, rating, description, product]);

  const handleImageUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (imagePreviews.length + files.length > MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images autorisées`);
      return;
    }

    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    Array.from(files).forEach(file => {
      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        toast.error(`${file.name} dépasse ${MAX_IMAGE_SIZE_MB}MB`);
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} n'est pas une image valide`);
        return;
      }

      newFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    setSelectedFiles(prev => [...prev, ...newFiles]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  }, [imagePreviews.length]);

  const removeImage = useCallback((index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, [imagePreviews]);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setErrors((prev) => ({ ...prev, title: "" }));
  }, []);
  
  const handleFormAction = useCallback(async () => {
    if (!validateForm() || !product) {
      const firstError = errors.title || errors.rating || errors.description;
      if (firstError) toast.error(firstError);
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('order_item_id', product.order_item_id);
      formData.append('rating', rating.toString());
      formData.append('title', title);
 
      if (description) formData.append('description', description);

      selectedFiles.forEach((file, index) => {
        formData.append(`views_${index}`, file);
      });

      createComment(formData);

      setShowThankYou(true);
      setRating(0);
      setTitle("");
      setDescription("");
      setImagePreviews([]);
      setSelectedFiles([]);
      setTimeout(() => {
        setModalOpen(false);
      }, 2500);
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast.error("Une erreur est survenue");
    }
  }, [product, rating, title, description, selectedFiles, validateForm, setModalOpen, createComment, errors]);

  const closeModal = useCallback(() => setModalOpen(false), [setModalOpen]);

  const isFormValid = title.trim() && rating && product && !errors.description;

  return (
    <Modal
      styleContainer="flex items-end min-[500px]:items-center justify-center select-none size-full transition-all duration-300"
      zIndex={100}
      setHide={closeModal}
      animationName="translateBottom"
      isOpen={isModalOpen}
      aria-label={`Laisser un avis sur ${product?.name}`}
    >
      <div className={clsx(
        "bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-[95vw] sm:max-w-2xl",
        "flex flex-col max-h-[90vh] overflow-y-auto backdrop-blur-sm",
        "transition-all duration-500 ease-out border border-slate-200"
      )}>
        {showThankYou ? (
          <ThankYouMessage />
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handleFormAction(); }} className="flex flex-col">
            {/* Header modernisé */}
            <div className="relative bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 p-6 border-b border-amber-100">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/5 via-orange-400/5 to-amber-400/5" />
              <div className="relative flex items-center space-x-4">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-3 rounded-2xl shadow-lg">
                  <svg className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">
                    Votre avis compte
                  </h2>
                  <p className="text-slate-600">
                    Partagez votre expérience avec{" "}
                    <span className="font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-lg">
                      {product?.name}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Rating Section */}
              <StarRating
                rating={rating}
                hoverRating={hoverRating}
                onStarHover={handleStarHover}
                onStarClick={handleStarClick}
                error={errors.rating}
                feedback={ratingFeedback}
              />

              {/* Title Input */}
              <div className="space-y-3">
                <label htmlFor="review-title" className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                  </svg>
                  Titre de votre avis
                </label>
                <div className="relative">
                  <input
                    id="review-title"
                    name="title"
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Résumez votre expérience en quelques mots..."
                    className={clsx(
                      "w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500",
                      "bg-slate-50 text-slate-700 placeholder-slate-400 transition-all duration-200",
                      "hover:bg-white hover:border-slate-300",
                      errors.title ? "border-red-300 bg-red-50" : "border-slate-200"
                    )}
                    maxLength={124}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 bg-white px-2 py-1 rounded-full">
                    {title.length}/124
                  </div>
                </div>
                {errors.title && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-in slide-in-from-top-2">
                    <p className="text-red-600 text-sm font-medium flex items-center gap-2">
                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.title}
                    </p>
                  </div>
                )}
              </div>

              {/* Description Textarea */}
              <div className="space-y-3">
                <label htmlFor="review-message" className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  Détaillez votre expérience
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full ml-auto">
                    Optionnel
                  </span>
                </label>
                <div className="relative">
                  <textarea
                    id="review-message"
                    name="description"
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder="Partagez les détails de votre expérience pour aider la communauté..."
                    className={clsx(
                      "w-full p-4 border-2 rounded-xl resize-none h-32 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500",
                      "bg-slate-50 text-slate-700 placeholder-slate-400 transition-all duration-200",
                      "hover:bg-white hover:border-slate-300",
                      errors.description ? "border-red-300 bg-red-50" : "border-slate-200"
                    )}
                    maxLength={512}
                  />
                  <div className="absolute right-3 bottom-3 text-xs text-slate-400 bg-white px-2 py-1 rounded-full">
                    {description.length}/512
                  </div>
                </div>
                {errors.description && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-in slide-in-from-top-2">
                    <p className="text-red-600 text-sm font-medium flex items-center gap-2">
                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Image Uploader */}
              <ImageUploader
                imagePreviews={imagePreviews}
                onImageUpload={handleImageUpload}
                onRemoveImage={removeImage}
                onTriggerFileInput={triggerFileInput}
                fileInputRef={fileInputRef}
                maxImages={MAX_IMAGES}
                maxImageSize={MAX_IMAGE_SIZE_MB}
              />
            </div>

            {/* Footer modernisé */}
            <div className="p-6 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-slate-50/50 flex justify-between items-center gap-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-3 text-slate-600 hover:text-slate-800 transition-all duration-200 rounded-xl hover:bg-slate-100 font-medium"
                aria-label="Annuler"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={!isFormValid || isCreatingComment}
                className={clsx(
                  "px-8 py-3 rounded-xl text-white font-semibold transition-all duration-200 flex items-center gap-3 shadow-lg",
                  "relative overflow-hidden group",
                  isFormValid && !isCreatingComment
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 hover:shadow-xl hover:scale-105 active:scale-95"
                    : "bg-slate-300 cursor-not-allowed"
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                {isCreatingComment ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Envoi...</span>
                  </>
                ) : (
                  "Publier mon avis"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};