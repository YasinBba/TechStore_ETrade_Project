import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingCart, Laptop, Smartphone, Headphones, Mouse, Keyboard, Monitor, Cpu, Gamepad2, Speaker, Watch, ShieldCheck, Truck } from 'lucide-react';
import { productService } from '../services/productService';
import { contentService } from '../services/contentService';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import appConfig from '../config/app.config';

const iconMap = {
    ShieldCheck,
    Truck,
    Headphones,
    Laptop,
    Smartphone,
    Mouse,
    Keyboard,
    Monitor,
    Cpu,
    Gamepad2,
    Speaker,
    Watch
};

const HomePage = () => {
    const { t } = useTranslation();
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch banners
                const bannersResult = await contentService.getBanners(true);
                if (bannersResult.success) {
                    setBanners(bannersResult.data);
                }

                // Fetch featured products
                const featuredResult = await productService.getFeatured();
                if (featuredResult.success) {
                    setFeaturedProducts(featuredResult.data);
                }

                // Fetch all products to get unique categories
                const allProductsResult = await productService.getAll({ pageSize: 50 });
                if (allProductsResult.success) {
                    const uniqueCategories = [...new Map(allProductsResult.data.items.map(p =>
                        [p.categoryName, { id: p.categoryId, name: p.categoryName }]
                    )).values()].filter(c => c.name);
                    setCategories(uniqueCategories.slice(0, 8)); // Take first 8 categories
                }
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <SEO
                title={`${appConfig.brand.name} - ${appConfig.brand.slogan}`}
                description={`${appConfig.brand.name} ile en yeni ürünleri keşfedin. Uygun fiyatlar ve güvenli alışveriş.`}
                keywords="alışveriş, e-ticaret, teknoloji, giyim, kozmetik"
                type="website"
            />
            {/* ... other SEO tags if needed ... */}

            {/* Hero Section */}
            <section className="relative bg-gray-900 text-white rounded-2xl overflow-hidden shadow-2xl min-h-[400px] md:h-[500px]">
                {banners.length > 0 ? (
                    // Simple Carousel Logic (showing first active banner for now, can be expaned to slider)
                    <div className="relative h-full">
                        <div className="absolute inset-0">
                            <img
                                src={banners[0].imageUrl}
                                alt={banners[0].title}
                                className="w-full h-full object-cover opacity-60"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
                        </div>
                        <div className="relative container mx-auto px-6 md:px-10 h-full flex flex-col justify-center max-w-4xl">
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-orbitron leading-tight mb-4 md:mb-6 animate-fade-in">
                                {banners[0].title}
                            </h1>
                            <p className="text-lg md:text-xl text-gray-200 mb-6 md:mb-8 max-w-2xl animate-slide-up">
                                {banners[0].description}
                            </p>
                            {banners[0].linkUrl && (
                                <Link
                                    to={banners[0].linkUrl}
                                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg w-max animate-scale-in"
                                >
                                    {t('home.explore')}
                                    <ArrowRight className="ml-2" size={20} />
                                </Link>
                            )}
                        </div>
                    </div>
                ) : (
                    // Fallback Static Hero from Config
                    <div className="relative h-full flex items-center">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 opacity-90"></div>
                        <div className="relative container mx-auto px-6 py-12 md:py-0 flex flex-col md:flex-row items-center h-full justify-center">
                            <div className="md:w-1/2 space-y-6">
                                <h1 className="text-4xl md:text-6xl font-bold font-orbitron leading-tight">
                                    {t(appConfig.hero.fallback.titleKey)} <br />
                                    <span className="text-blue-400">{t(appConfig.hero.fallback.highlightKey)}</span>
                                </h1>
                                <p className="text-lg text-gray-300 max-w-lg">
                                    {t(appConfig.hero.fallback.descKey)}
                                </p>
                                <Link
                                    to="/products"
                                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg"
                                >
                                    {t(appConfig.hero.fallback.buttonTextKey)}
                                    <ArrowRight className="ml-2" size={20} />
                                </Link>
                            </div>
                            <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
                                <img
                                    src={appConfig.hero.fallback.imageUrl}
                                    alt="Hero Image"
                                    className="relative z-10 rounded-lg shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500 border-4 border-gray-800 max-w-sm"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Categories Grid */}
            <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <span className="w-2 h-8 bg-blue-600 mr-3 rounded-full"></span>
                    {t('home.popularCategories')}
                </h2>
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(n => (
                            <div key={n} className="h-40 bg-gray-200 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {categories.map((cat, idx) => {
                            // Simplified icon logic via Config or Mapper if needed, for now kept heuristic but robust
                            const getCategoryIcon = (name) => {
                                const lowerName = name.toLowerCase();
                                if (lowerName.includes('laptop') || lowerName.includes('dizüstü') || lowerName.includes('bilgisayar')) return Laptop;
                                if (lowerName.includes('telefon')) return Smartphone;
                                if (lowerName.includes('kulaklık')) return Headphones;
                                if (lowerName.includes('mouse') || lowerName.includes('fare')) return Mouse;
                                if (lowerName.includes('klavye')) return Keyboard;
                                if (lowerName.includes('monitör') || lowerName.includes('ekran')) return Monitor;
                                if (lowerName.includes('işlemci') || lowerName.includes('cpu') || lowerName.includes('kart')) return Cpu;
                                if (lowerName.includes('oyun') || lowerName.includes('game') || lowerName.includes('konsol') || lowerName.includes('kol')) return Gamepad2;
                                if (lowerName.includes('hoparlör') || lowerName.includes('ses')) return Speaker;
                                if (lowerName.includes('saat') || lowerName.includes('watch')) return Watch;
                                return Cpu;
                            };

                            const Icon = getCategoryIcon(cat.name);

                            return (
                                <Link
                                    to={`/products?categories=${cat.id}`}
                                    key={idx}
                                    className="group relative p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col items-center justify-center h-52"
                                >
                                    {/* Background Decor */}
                                    <div className="absolute right-[-20px] top-[-20px] text-gray-100 opacity-20 group-hover:opacity-30 group-hover:text-blue-100 transition-all duration-500 transform rotate-12 group-hover:rotate-0">
                                        <Icon size={140} strokeWidth={1} />
                                    </div>

                                    {/* Content */}
                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm group-hover:shadow-lg scale-100 group-hover:scale-110">
                                            <Icon size={32} />
                                        </div>
                                        <h3 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors text-center px-2">
                                            {cat.name}
                                        </h3>
                                        <span className="text-xs text-gray-400 mt-2 font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                            {t('product.explore')} &rarr;
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Featured Products */}
            <section>
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-2xl font-bold flex items-center">
                        <span className="w-2 h-8 bg-purple-600 mr-3 rounded-full"></span>
                        {t('home.featuredProducts')}
                    </h2>
                    <Link to="/products" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                        {t('home.viewAll')} <ArrowRight size={16} className="ml-1" />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(n => (
                            <div key={n} className="bg-white rounded-xl shadow p-4 animate-pulse h-80">
                                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                                <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                                <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : featuredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-500">{t('home.noFeatured')}</p>
                    </div>
                )}
            </section>

            {/* Features/Trust Section (Dynamic from Config) */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-t border-gray-100">
                {appConfig.ui.trustBadges.map((badge, index) => {
                    const IconComponent = iconMap[badge.icon] || ShieldCheck;
                    // Dynamic color classes based on config (simple mapping or utility)
                    // For now assuming bg-{color}-100 text-{color}-600 is available
                    return (
                        <div key={index} className="text-center p-6">
                            <div className={`w-16 h-16 bg-${badge.color}-100 text-${badge.color}-600 rounded-full flex items-center justify-center mx-auto mb-4`}>
                                <IconComponent size={32} />
                            </div>
                            <h3 className="text-lg font-bold mb-2">{t(badge.titleKey)}</h3>
                            <p className="text-gray-500 text-sm">{t(badge.descKey)}</p>
                        </div>
                    );
                })}
            </section>
        </div>
    );
};

export default HomePage;
