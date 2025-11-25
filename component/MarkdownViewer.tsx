import { useEffect, useState, useRef } from "react";

export { markdownToPlainText, MarkdownViewer };

function MarkdownViewer({
  markdown,
  maxLines = 3,
  showMoreButton = true,
}: {
  markdown: string;
  maxLines?: number;
  showMoreButton?: boolean;
}) {
  const [isClient, setIsClient] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsExpansion, setNeedsExpansion] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const convertMarkdown = async () => {
      // Charger marked dynamiquement
      const { marked } = await import("marked");
      
      // Configurer marked (optionnel)
      marked.setOptions({
        gfm: true,
        breaks: true,
      });

      const html = await marked.parse(markdown || "Aucun contenu", {
        async: true,
      });
      setHtmlContent(html);
    };

    setIsClient(true);
    convertMarkdown();
  }, [markdown]);

  useEffect(() => {
    // Vérifier si le contenu nécessite une expansion après le rendu
    if (contentRef.current && htmlContent) {
      const lineHeight =
        parseInt(getComputedStyle(contentRef.current).lineHeight) || 24;
      const maxHeight = lineHeight * maxLines;
      const actualHeight = contentRef.current.scrollHeight;
      setNeedsExpansion(actualHeight > maxHeight);
    }
  }, [htmlContent, maxLines]);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  if (!isClient) {
    return <div>Chargement côté client...</div>;
  }

  return (
    <div className="relative">
      <div
        ref={contentRef}
        className={`prose transition-all duration-300 ease-in-out overflow-hidden ${
          !isExpanded && needsExpansion ? "line-clamp-3" : "max-h-none"
        }`}
        style={{
          maxHeight:
            !isExpanded && needsExpansion ? `${maxLines * 1.5}em` : "none",
        }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* Gradient de fondu pour l'effet de troncature */}
      {!isExpanded && needsExpansion && (
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      )}

      {/* Bouton voir plus/voir moins */}
      {needsExpansion && showMoreButton && (
        <button
          onClick={toggleExpansion}
          className="mt-2 text-slate-600 hover:text-slate-800 font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 rounded px-2 py-1"
        >
          {isExpanded ? "Voir moins" : "Voir plus"}
        </button>
      )}
    </div>
  );
}

function markdownToPlainText(markdown: string): string {
  const mrk = markdown
    .replaceAll(/[#*_~`>\-+|]/g, "") // Supprime les caractères spéciaux Markdown
    .replaceAll(/\[(.*?)\]\(.*?\)/g, "$1") // Supprime les liens, garde le texte
    .replaceAll(/!\[.*?\]\(.*?\)/g, "") // Supprime les images
    .replaceAll(/```[\s\S]*?```/g, "") // Supprime les blocs de code
    .replaceAll(/`([^`]+)`/g, "$1") // Supprime les inline-code
    .replaceAll(/\n+/g, "\n") // Normalise les retours à la ligne
    .replaceAll(/\r+/g, "") // Supprime les retours chariot
    .replaceAll(/\t+/g, " ") // Remplace les tabulations par des espaces
    .replaceAll(/\s+/g, " ") // Remplace les espaces multiples
    .trim();
  return mrk;
}

export const client = true;
