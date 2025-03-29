import { useState } from "react";
import { toast } from "react-hot-toast";

export function useClipboard() {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      toast.success("Texte copié !");
      setTimeout(() => setIsCopied(false), 2000); // Réinitialiser après 2s
    } catch (error) {
      toast.error("Erreur lors de la copie !");
    }
  };

  return { isCopied, copyToClipboard };
}
