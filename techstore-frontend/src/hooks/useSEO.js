import { useEffect } from 'react';

export const useSEO = ({ title, description, keywords, image, url }) => {
    useEffect(() => {
        // Update Title
        document.title = title ? `${title} | TechStore` : 'TechStore - Geleceğin Teknolojisi';

        // Update Meta Tags
        const setMetaTag = (name, content) => {
            if (!content) return;
            let element = document.querySelector(`meta[name="${name}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute('name', name);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        const setOgTag = (property, content) => {
            if (!content) return;
            let element = document.querySelector(`meta[property="${property}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute('property', property);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        setMetaTag('description', description);
        setMetaTag('keywords', keywords);

        // Open Graph
        setOgTag('og:title', title);
        setOgTag('og:description', description);
        setOgTag('og:image', image);
        setOgTag('og:url', url || window.location.href);

        return () => {
            // Cleanup logic if needed, but usually we just overwrite on next page load
        };
    }, [title, description, keywords, image, url]);
};
