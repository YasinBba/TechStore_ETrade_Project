export const appConfig = {
    brand: {
        name: 'TechStore',
        slogan: 'Teknolojinin Adresi',
        logo: {
            text: 'TechStore', // Fallback text if image not available or preferred
            icon: 'Cpu', // Lucide icon name (we will map this dynamically)
        },
    },
    contact: {
        phone: '+90 (212) 555 0123',
        email: 'info@techstore.com',
        address: 'Teknoloji Vadisi, İstanbul',
    },
    social: {
        instagram: 'https://instagram.com/techstore',
        twitter: 'https://twitter.com/techstore',
        facebook: 'https://facebook.com/techstore',
        linkedin: 'https://linkedin.com/company/techstore',
    },
    features: {
        blog: true,
        wishlist: true,
        comparison: false, // Example of feature toggle
    },
    images: {
        defaultFallback: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800', // Generic Tech Workspace
        categoryMappings: [
            {
                keywords: ['telefon', 'phone'],
                imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800'
            },
            {
                keywords: ['laptop', 'bilgisayar', 'notebook', 'macbook'],
                imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800'
            },
            {
                keywords: ['kulaklık', 'headphone', 'airpods', 'audio', 'sound'],
                imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'
            },
            {
                keywords: ['saat', 'watch'],
                imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'
            },
            {
                keywords: ['kamera', 'camera', 'foto', 'video'],
                imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800'
            },
            {
                keywords: ['oyun', 'game', 'gaming', 'konsol', 'oyuncu'],
                imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800'
            },
            {
                keywords: ['tablet', 'ipad'],
                imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800'
            },
            {
                keywords: ['monitör', 'monitor', 'ekran', 'display'],
                imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800'
            },
            {
                keywords: ['fare', 'mouse', 'klavye', 'keyboard'],
                imageUrl: 'https://images.unsplash.com/photo-1587829741301-30856606d2d5?auto=format&fit=crop&q=80&w=800'
            },
            {
                keywords: ['işlemci', 'cpu', 'processor', 'chip', 'intel', 'amd'],
                imageUrl: 'https://images.unsplash.com/photo-1591799264318-7e6e30800c6d?auto=format&fit=crop&q=80&w=800'
            },
            {
                keywords: ['ekran kartı', 'gpu', 'graphic', 'rtx', 'gtx', 'radeon'],
                imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800'
            },
            {
                keywords: ['bileşen', 'component', 'parça', 'anakart', 'ram', 'memory', 'disk', 'ssd'],
                imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800'
            },
            {
                keywords: ['aksesuar', 'accessory', 'kablo', 'cable', 'şarj', 'charge'],
                imageUrl: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=800'
            }
        ]
    },
    layout: {
        footer: {
            showNewsletter: true,
            showSocialLinks: true,
        }
    },
    hero: {
        fallback: {
            titleKey: "home.hero.title",
            highlightKey: "home.hero.highlight",
            descKey: "home.hero.desc",
            buttonTextKey: "home.hero.button",
            imageUrl: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=80"
        }
    },
    ui: {
        trustBadges: [
            { icon: 'ShieldCheck', titleKey: 'home.trust.warranty.title', descKey: 'home.trust.warranty.desc', color: 'blue' },
            { icon: 'Truck', titleKey: 'home.trust.delivery.title', descKey: 'home.trust.delivery.desc', color: 'purple' },
            { icon: 'Headphones', titleKey: 'home.trust.support.title', descKey: 'home.trust.support.desc', color: 'green' }
        ]
    },
    theme: {
        colors: {
            primary: {
                50: '#eff6ff',
                100: '#dbeafe',
                500: '#3b82f6',
                600: '#2563eb',
                700: '#1d4ed8',
            }
        }
    },
    currency: {
        code: 'TRY',
        symbol: '₺',
        format: 'tr-TR'
    }
};

export default appConfig;
