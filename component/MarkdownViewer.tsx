import { useEffect, useState } from 'react';
import { marked } from 'marked';


export {markdownToPlainText,MarkdownViewer }

function MarkdownViewer({ markdown }: { markdown: string }) {
  const [isClient, setIsClient] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    // Configurer marked (optionnel)
    marked.setOptions({
      gfm: true,
      breaks: true,

    });

    const convertMarkdown = async () => {
      const html = await marked.parse(markdown || 'Aucun contenu', { async: true });
      setHtmlContent(html);
    };

    setIsClient(true);
    convertMarkdown();
  }, [markdown]);

  if (!isClient) {
    return <div>Chargement côté client...</div>;
  }

  return (
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
  );
}

function markdownToPlainText(markdown: string): string {
    const mrk = markdown
    .replaceAll(/[#*_~`>\-+|]/g, '') // Supprime les caractères spéciaux Markdown
    .replaceAll(/\[(.*?)\]\(.*?\)/g, '$1') // Supprime les liens, garde le texte
    .replaceAll(/!\[.*?\]\(.*?\)/g, '') // Supprime les images
    .replaceAll(/```[\s\S]*?```/g, '') // Supprime les blocs de code
    .replaceAll(/`([^`]+)`/g, '$1') // Supprime les inline-code
    .replaceAll(/\n+/g, ' ') // Remplace les retours à la ligne par des espaces
    .replaceAll(/\r+/g, ' ') // Remplace les retours à la ligne par des espaces
    .replaceAll(/\t+/g, ' ') // Remplace les retours à la ligne par des espaces
    .replaceAll(/\s+/g, ' ') // Remplace les retours à la ligne par des espaces
    .trim();
    return mrk;
}

export const client = true;