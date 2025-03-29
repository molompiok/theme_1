import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Viewer } from '@toast-ui/react-editor';

export {markdownToPlainText, MarkdownViewer }

function MarkdownViewer({ markdown }: { markdown: string }) {
    return <Viewer initialValue={markdown || "Aucun contenu"} />;
}

function markdownToPlainText(markdown: string): string {
    return markdown
        .replace(/[#*_~`>\-+|]/g, '') // Supprime les caractères spéciaux Markdown
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Supprime les liens, garde le texte
        .replace(/!\[.*?\]\(.*?\)/g, '') // Supprime les images
        .replace(/```[\s\S]*?```/g, '') // Supprime les blocs de code
        .replace(/`([^`]+)`/g, '$1') // Supprime les inline-code
        .replace(/\n+/g, ' ') // Remplace les retours à la ligne par des espaces
        .trim();
}