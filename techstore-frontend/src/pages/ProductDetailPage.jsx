import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getProductImage } from '../utils/imageUtils';
import { formatPrice } from '../utils/currencyUtils';
import { useParams, Link } from 'react-router-dom';
import { Minus, Plus, ShoppingCart, Star, Heart, Share2, Truck, ShieldCheck, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { productService } from '../services/productService';
import Breadcrumb from '../components/common/Breadcrumb';
import SEO from '../components/SEO';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import ReviewSection from '../components/ReviewSection';
import appConfig from '../config/app.config';

const ProductDetailPage = () => {
    const { t } = useTranslation();
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const { addToWishlist, isInWishlist } = useWishlist();
    const { showToast } = useToast();
    const [imgSrc, setImgSrc] = useState('');
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        if (product) {
            setImgSrc(getProductImage(product.imageUrl, product.categoryName, product.name));
            setHasError(false);
        }
    }, [product]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const result = await productService.getBySlug(slug);
                if (result.success) {
                    setProduct(result.data);
                }
            } catch (error) {
                console.error('Failed to fetch product', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 flex justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold mb-4">{t('product.notFound')}</h2>
                <Link to="/products" className="text-blue-600 hover:underline">{t('product.backToProducts')}</Link>
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart(product, quantity);
        showToast(`${product.name} sepete eklendi! (${quantity} adet)`, 'success');
    };

    const breadcrumbItems = [
        { label: t('common.products'), url: '/products' },
        { label: product.categoryName, url: `/products?category=${product.categoryName}` },
        { label: product.name }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <SEO
                title={`${product.name} | TechStore`}
                description={product.description}
                image={product.imageUrl}
            />

            <div className="mb-6">
                <Breadcrumb items={breadcrumbItems} />
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    {/* Image Gallery */}
                    <div className="md:w-1/2 bg-gray-50 p-8 flex items-center justify-center">
                        {!hasError ? (
                            <img
                                src={imgSrc}
                                alt={product.name}
                                className="max-h-[500px] w-auto object-contain hover:scale-105 transition-transform duration-500"
                                onError={() => {
                                    // Try fallback URL once, if it matches current, set error
                                    const fallbackUrl = getProductImage(null, product.categoryName, product.name);
                                    if (imgSrc === fallbackUrl) {
                                        setHasError(true);
                                    } else {
                                        setImgSrc(fallbackUrl);
                                    }
                                }}
                            />
                        ) : (
                            <div className="w-full h-[400px] bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-300">
                                <ImageIcon size={64} />
                                <span className="mt-2 text-sm text-gray-400">Görsel Yok</span>
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="md:w-1/2 p-8 md:p-12">
                        <div className="text-sm text-blue-600 font-bold uppercase tracking-wider mb-2">
                            {product.brandName}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-orbitron">{product.name}</h1>

                        <div className="flex items-center mb-6 space-x-4">
                            <div className="flex text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={20} fill={i < (product.rating || 4) ? "currentColor" : "none"} />
                                ))}
                            </div>
                            <span className="text-gray-500 text-sm">({product.reviewCount || 12} {t('product.reviews')})</span>
                        </div>

                        <div className="text-3xl font-bold text-gray-900 mb-6">{formatPrice(product.price)}</div>

                        <p className="text-gray-600 mb-8 leading-relaxed">
                            {product.description || t('product.noDescription')}
                        </p>

                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="px-4 py-2 font-bold min-w-[3rem] text-center">{quantity}</span>
                                <button
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg flex items-center justify-center transition-all transform hover:scale-105 shadow-md"
                            >
                                <ShoppingCart className="mr-2" size={20} />
                                {t('common.addToCart')}
                            </button>

                            {appConfig.features.wishlist && (
                                <button
                                    onClick={() => addToWishlist(product)}
                                    className={`p-3 rounded-lg border transition-colors ${isInWishlist(product.id)
                                        ? 'border-red-200 bg-red-50 text-red-500'
                                        : 'border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700'
                                        }`}
                                    title={isInWishlist(product.id) ? t('product.removeFromWishlist') : t('product.addToWishlist')}
                                >
                                    <Heart size={24} className={isInWishlist(product.id) ? "fill-current" : ""} />
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-gray-100">
                            <div className="flex items-center text-gray-700">
                                <Truck className="text-blue-500 mr-3" size={24} />
                                <div>
                                    <div className="font-bold text-sm">{t('product.freeShipping')}</div>
                                    <div className="text-xs text-gray-500">{t('product.allOrders')}</div>
                                </div>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <ShieldCheck className="text-green-500 mr-3" size={24} />
                                <div>
                                    <div className="font-bold text-sm">{t('product.warranty')}</div>
                                    <div className="text-xs text-gray-500">{t('product.distributorWarranty')}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="container mx-auto px-4 py-12">
                <ReviewSection productId={product.id} />

            </div>
        </div>
    );
};

export default ProductDetailPage;
