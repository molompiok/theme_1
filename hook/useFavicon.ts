import { useEffect } from 'react';

export function useFavicon(iconUrl: string) {
    useEffect(() => {
        const link: HTMLLinkElement =
            document.querySelector("link[rel~='icon']") || document.createElement('link');

        link.rel = 'icon';
        link.href = iconUrl;
        document.getElementsByTagName('head')[0].appendChild(link);
    }, [iconUrl]);
}
