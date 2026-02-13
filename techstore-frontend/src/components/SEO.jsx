import { useEffect } from 'react';

const SEO = ({
    title = 'TechStore - Modern Teknoloji Mağazası',
    description = 'En son teknoloji ürünlerini keşfedin. Gaming ekipmanları, bilgisayar aksesuarları ve daha fazlası TechStore\'da!',
    keywords = 'teknoloji, gaming, bilgisayar, aksesuar, mouse, klavye, kulaklık',
    image = '/logo.png',
    type = 'website',
    url
}) => {
    useEffect(() => {
        // Title
        document.title = title;

        // Meta tags
        const metaTags = {
            'description': description,
            'keywords': keywords,

            // Open Graph
            'og:title': title,
            'og:description': description,
            'og:image': image,
            'og:type': type,
            'og:site_name': 'TechStore',
            'og:locale': 'tr_TR',

            // Twitter Card
            'twitter:card': 'summary_large_image',
            'twitter:title': title,
            'twitter:description': description,
            'twitter:image': image,

            // Additional SEO
            'robots': 'index, follow',
            'author': 'TechStore',
            'viewport': 'width=device-width, initial-scale=1.0'
        };

        if (url) {
            metaTags['og:url'] = url;
            metaTags['canonical'] = url;
        }

        // Update or create meta tags
        Object.entries(metaTags).forEach(([name, content]) => {
            let meta = document.querySelector(`meta[name="${name}"]`) ||
                document.querySelector(`meta[property="${name}"]`);

            if (!meta) {
                meta = document.createElement('meta');
                if (name.startsWith('og:') || name.startsWith('twitter:')) {
                    meta.setAttribute('property', name);
                } else {
                    meta.setAttribute('name', name);
                }
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        });

        // Canonical link
        if (url) {
            let canonical = document.querySelector('link[rel="canonical"]');
            if (!canonical) {
                canonical = document.createElement('link');
                canonical.setAttribute('rel', 'canonical');
                document.head.appendChild(canonical);
            }
            canonical.setAttribute('href', url);
        }
    }, [title, description, keywords, image, type, url]);

    return null;
};

export default SEO;
