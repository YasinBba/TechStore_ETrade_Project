import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingCart } from 'lucide-react';
import { productService } from '../services/productService';

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                setLoading(true);
                // In a real app, use the actual API. 
                // If API is not ready or returns empty in dev, we might fallback to mock data or handle error
                const result = await productService.getFeatured();
                if (result.success) {
                    setFeaturedProducts(result.data);
                }
            } catch (error) {
                console.error('Failed to fetch featured products', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeatured();
    }, []);

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <section className="relative bg-gray-900 text-white rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 opacity-90"></div>
                <div className="relative container mx-auto px-6 py-20 flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 space-y-6">
                        <h1 className="text-4xl md:text-6xl font-bold font-orbitron leading-tight">
                            Geleceğin Teknolojisi <br />
                            <span className="text-blue-400">Bugün Burada</span>
                        </h1>
                        <p className="text-lg text-gray-300 max-w-lg">
                            En yeni oyun bilgisayarları, konsollar ve ekipmanlar için tek adresiniz.
                            Performansın sınırlarını zorlayın.
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg"
                        >
                            Alışverişe Başla
                            <ArrowRight className="ml-2" size={20} />
                        </Link>
                    </div>
                    <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
                        {/* Placeholder for Hero Image */}
                        <div className="w-80 h-80 bg-blue-500/20 rounded-full blur-3xl absolute animate-pulse"></div>
                        <img
                            src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=80"
                            alt="Gaming Setup"
                            className="relative z-10 rounded-lg shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500 border-4 border-gray-800"
                            style={{ maxWidth: '400px' }}
                        />
                    </div>
                </div>
            </section>

            {/* Categories Grid - Placeholder for now */}
            <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <span className="w-2 h-8 bg-blue-600 mr-3 rounded-full"></span>
                    Popüler Kategoriler
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Bilgisayarlar', 'Telefonlar', 'Konsollar', 'Aksesuarlar'].map((cat, idx) => (
                        <Link
                            to={`/products?category=${cat}`}
                            key={idx}
                            className="group relative h-40 bg-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-gray-900/20 transition-colors"></div>
                            <div className="absolute bottom-4 left-4">
                                <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{cat}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section>
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-2xl font-bold flex items-center">
                        <span className="w-2 h-8 bg-purple-600 mr-3 rounded-full"></span>
                        Öne Çıkan Ürünler
                    </h2>
                    <Link to="/products" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                        Tümünü Gör <ArrowRight size={16} className="ml-1" />
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-500">Henüz öne çıkan ürün bulunamadı.</p>
                    </div>
                )}
            </section>

            {/* Features/Trust Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-t border-gray-100">
                <div className="text-center p-6">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold mb-2">Orijinal Ürün Garantisi</h3>
                    <p className="text-gray-500 text-sm">Tüm ürünlerimiz %100 orijinal ve 2 yıl garantilidir.</p>
                </div>
                <div className="text-center p-6">
                    <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold mb-2">Hızlı Teslimat</h3>
                    <p className="text-gray-500 text-sm">Siparişleriniz aynı gün kargoya verilir.</p>
                </div>
                <div className="text-center p-6">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold mb-2">7/24 Destek</h3>
                    <p className="text-gray-500 text-sm">Uzman ekibimiz her zaman yardımınıza hazır.</p>
                </div>
            </section>
        </div>
    );
};

const ProductCard = ({ product }) => (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 group">
        <div className="relative h-48 bg-gray-50 overflow-hidden">
            {product.imageUrl ? (
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Resim Yok
                </div>
            )}
            {product.discount > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    %{product.discount} İndirim
                </span>
            )}
        </div>
        <div className="p-4">
            <div className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wide">
                {product.brandName || 'Marka'}
            </div>
            <Link to={`/products/${product.slug}`} className="block">
                <h3 className="font-bold text-gray-800 mb-2 truncate group-hover:text-blue-600 transition-colors">
                    {product.name}
                </h3>
            </Link>
            <div className="flex items-center mb-3">
                <div className="flex text-yellow-400 text-xs">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < (product.rating || 4) ? "currentColor" : "none"} />
                    ))}
                </div>
                <span className="text-xs text-gray-400 ml-2">({product.reviewCount || 0})</span>
            </div>
            <div className="flex justify-between items-center">
                <div>
                    <span className="text-lg font-bold text-gray-900">{product.price?.toLocaleString('tr-TR')} ₺</span>
                    {product.oldPrice && (
                        <span className="block text-xs text-gray-400 line-through">
                            {product.oldPrice.toLocaleString('tr-TR')} ₺
                        </span>
                    )}
                </div>
                <button className="bg-blue-100 text-blue-600 p-2 rounded-full hover:bg-blue-600 hover:text-white transition-colors">
                    <ShoppingCart size={18} />
                </button>
            </div>
        </div>
    </div>
);

export default HomePage;
