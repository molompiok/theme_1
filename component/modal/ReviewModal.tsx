import clsx from "clsx";
import Modal from "./Modal";
import { useState, useEffect, useRef, useCallback, memo, ChangeEvent } from "react";
import { useModalCommentStore } from "../../store/modal";
import { useCreateComment } from "../../hook/query/comment/useCreateComment";
import toast from "react-hot-toast";

interface ModalCommentStore {
  isModalOpen: boolean;
  product: { product_id: string; name: string } | null;
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
  <div className="flex flex-col items-center gap-2">
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onStarClick(star)}
          onMouseEnter={() => onStarHover(star)}
          onMouseLeave={() => onStarHover(0)}
          aria-label={`Noter ${star} sur 5`}
          className={clsx(
            "text-3xl focus:outline-none transition-all duration-200 transform",
            (hoverRating >= star || rating >= star) ? "text-orange-500" : "text-gray-400",
            "hover:text-orange-400 hover:scale-110",
            rating === star && "animate-bounceOnce"
          )}
        >
          ★
        </button>
      ))}
    </div>
    <input type="hidden" name="rating" value={rating} />
    <p
      className={clsx(
        "text-sm font-medium transition-opacity duration-200 animate-fadeIn",
        rating === 0 ? "text-gray-500 text-xs" : "text-orange-500"
      )}
    >
      {feedback}
    </p>
    {error && <p className="text-red-500 text-xs animate-fadeIn">{error}</p>}
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
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="block text-sm font-medium text-gray-700">
        Photos de votre expérience (optionnel)
      </label>
      <span className="text-xs text-gray-500">{imagePreviews.length}/{maxImages}</span>
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

    <div className="grid grid-cols-3 gap-2">
      {imagePreviews.map((preview, index) => (
        <div key={index} className="relative aspect-square">
          <img
            src={preview}
            alt={`Aperçu ${index + 1}`}
            className="object-cover w-full h-full rounded-md border border-gray-200"
          />
          <button
            type="button"
            onClick={() => onRemoveImage(index)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
            aria-label="Supprimer cette image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      ))}
      {imagePreviews.length < maxImages && (
        <button
          type="button"
          onClick={onTriggerFileInput}
          className={clsx(
            "border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center p-4",
            "transition-colors duration-200 hover:border-orange-500 aspect-square",
            "focus:outline-none focus:border-orange-500"
          )}
          aria-label="Ajouter des photos"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <span className="text-xs text-gray-500 mt-2">Ajouter</span>
        </button>
      )}
    </div>
    <p className="text-xs text-gray-500">
      Formats acceptés: * • Max {maxImageSize}MB par image
    </p>
  </div>
));

const ThankYouMessage = memo(() => (
  <div className="flex flex-col items-center justify-center p-8 h-64">
    <div className="text-green-500 text-6xl mb-4 animate-bounceOnce">✓</div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">
      Merci pour votre avis !
    </h3>
    <p className="text-gray-600 text-center">
      Votre contribution aide la communauté
    </p>
  </div>
));

export const ReviewModal = () => {
  const { isModalOpen, product, setModalOpen } = useModalCommentStore();
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>(""); 
  const [errors, setErrors] = useState<{ title: string; rating: string; description: string }>({ title: "", rating: "", description: "" });
  const [ratingFeedback, setRatingFeedback] = useState<string>("Veuillez definir une note");
  const [showThankYou, setShowThankYou] = useState<boolean>(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: createComment, isPending: isCreatingComment } = useCreateComment();
  const MAX_IMAGES: number = 3;
  const MAX_IMAGE_SIZE_MB: number = 1;

  useEffect(() => {
    if (isModalOpen) {
      setErrors({ title: "", rating: "", description: "" });
      setShowThankYou(false);
      // setDescription(""); 
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
      case 1: return "Pas satisfait du tout";
      case 2: return "Quelques points à améliorer";
      case 3: return "Globalement satisfait";
      case 4: return "Très satisfait !";
      case 5: return "Excellent, je recommande !";
      default: return "Veuillez definir une note";
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
        ? "Merci d'ajouter une description valide (entre 24 et 512 caractères, ou laisser vide)"
        : ""
    }));
  }, []);

  const validateForm = useCallback((): boolean => {
    let isValid = true;
    const newErrors = { title: "", rating: "", description: "" };

    if (!title.trim() || title.length > 124) {
      newErrors.title = "Merci d'ajouter un titre pour résumer votre avis";
      isValid = false;
    }

    if (description.length > 0 && (description.length < 5 || description.length > 512)) {
      newErrors.description = "Merci d'ajouter une description valide (entre 5 et 512 caractères, ou laisser vide)";
      isValid = false;
    }
    
    if (!product) {
      newErrors.title = "Merci de selectionner un produit";
      isValid = false;
    }
    
    if (!rating) {
      newErrors.rating = "Votre évaluation est importante pour nous";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [title, rating, description, product]);

  const handleImageUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (imagePreviews.length + files.length > MAX_IMAGES) {
      alert(`Vous pouvez ajouter un maximum de ${MAX_IMAGES} images`);
      return;
    }

    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    Array.from(files).forEach(file => {
      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        alert(`L'image ${file.name} dépasse la taille limite de ${MAX_IMAGE_SIZE_MB}MB`);
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert(`Le fichier ${file.name} n'est pas une image valide`);
        return;
      }

      newFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    setSelectedFiles(prev => [...prev, ...newFiles]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  }, []);

  const removeImage = useCallback((index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, [imagePreviews]);

  const triggerFileInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setErrors((prev) => ({ ...prev, title: "" }));
  }, []);

  const handleFormAction = useCallback(async () => {
    if (!validateForm() || !product) return toast.error(errors.title || errors.rating || errors.description);
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
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    }
  }, [product, rating, title, description, selectedFiles, validateForm, setModalOpen]);

  const closeModal = useCallback(() => setModalOpen(false), [setModalOpen]);

  return (
    <Modal
      styleContainer="flex items-end min-[500px]:items-center justify-center select-none size-full transition-all duration-300"
      zIndex={100}
      setHide={closeModal}
      animationName="translateBottom"
      isOpen={isModalOpen}
      aria-label={`Laisser un avis sur le ${product?.name}`}
    >
      <div
        className={clsx(
          "bg-white rounded-lg overflow-hidden shadow-xl w-full max-w-[95vw] sm:max-w-lg",
          "flex flex-col max-h-[90vh] overflow-y-auto",
          "transition-all duration-300 ease-in-out"
        )}
      >
        {showThankYou ? (
          <ThankYouMessage />
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handleFormAction(); }} className="flex flex-col">
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 border-b border-orange-200">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-500 text-white p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 animate-fadeIn">
                    Votre avis compte
                  </h2>
                  <p className="text-sm text-gray-600">
                    Comment évaluez-vous{" "}
                    <span className="font-medium">{product?.name}</span> ?
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 space-y-3">
              <StarRating
                rating={rating}
                hoverRating={hoverRating}
                onStarHover={handleStarHover}
                onStarClick={handleStarClick}
                error={errors.rating}
                feedback={ratingFeedback}
              />

              <div className="space-y-2">
                <label
                  htmlFor="review-title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Titre de votre avis
                </label>
                <input
                  id="review-title"
                  name="title"
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="En quelques mots, resumez votre avis ?"
                  className={clsx(
                    "w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 text-gray-700",
                    "transition-all duration-200",
                    errors.title ? "border-red-500" : "border-gray-300"
                  )}
                  maxLength={124}
                />
                <div className="flex justify-between items-center">
                  {errors.title && (
                    <p className="text-red-500 text-xs animate-fadeIn">
                      {errors.title}
                    </p>
                  )}
                  <span className="text-xs text-gray-500 ml-auto">
                    {title.length}/52
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="review-message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Votre expérience détaillée (optionnel)
                </label>
                <textarea
                  id="review-message"
                  name="description"
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder="Partagez votre expérience pour aider les autres clients"
                  className={clsx(
                    "w-full p-3 border rounded-md resize-none h-32 bg-gray-50",
                    "focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700",
                    "transition-all duration-200",
                    errors.description ? "border-red-500" : "border-gray-300"
                  )}
                  maxLength={512}
                />
                <div className="flex justify-between items-center">
                  {errors.description && (
                    <p className="text-red-500 text-xs animate-fadeIn">
                      {errors.description}
                    </p>
                  )}
                  <span className="text-xs text-gray-500 ml-auto">
                    {description.length}/512
                  </span>
                </div>
              </div>

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

            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 rounded-md hover:bg-gray-100"
                aria-label="Annuler"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isCreatingComment}
                className={clsx(
                  "px-6 py-2 rounded-md text-white transition-all duration-200 flex items-center gap-2",
                  !title || !rating || !product || errors.description || isCreatingComment
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 hover:shadow-md"
                )}
              >
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