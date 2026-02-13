import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ShoppingCart, Star, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils/currencyUtils';

const QuickViewModal = ({ product, isOpen, onClose }) => {
    const { t } = useTranslation();
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const { showToast } = useToast();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    const handleAddToCart = () => {
        addToCart(product, quantity);
        showToast(`${product.name} ${t('common.addedToCart')}`, 'success');
        onClose();
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all"
                >
                    <X size={24} />
                </button>

                <div className="flex flex-col md:flex-row h-full max-h-[90vh] md:max-h-auto overflow-y-auto md:overflow-hidden">
                    {/* Image Section */}
                    <div className="md:w-1/2 bg-gray-50 p-8 flex items-center justify-center min-h-[300px]">
                        <img
                            src={product.imageUrl || 'https://via.placeholder.com/400'}
                            alt={product.name}
                            className="max-h-[350px] w-auto object-contain mix-blend-multiply hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    {/* Details Section */}
                    <div className="md:w-1/2 p-8 flex flex-col">
                        <div className="mb-auto">
                            <div className="text-sm text-blue-600 font-bold uppercase tracking-wider mb-2">
                                {product.brandName || product.category}
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 font-orbitron leading-tight">
                                {product.name}
                            </h2>

                            <div className="flex items-center mb-4 space-x-3">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={18} fill={i < (product.rating || 4) ? "currentColor" : "none"} />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500 font-medium">({product.reviewCount || 12} {t('product.reviews')})</span>
                            </div>

                            <div className="text-3xl font-bold text-gray-900 mb-6 font-mono">
                                {formatPrice(product.price)}
                            </div>

                            <p className="text-gray-600 mb-8 leading-relaxed line-clamp-3">
                                {product.description || 'Bu ürün için henüz detaylı açıklama girilmemiş. TechStore güvencesiyle hemen sipariş verebilirsiniz.'}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4 mt-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                                    >-</button>
                                    <span className="w-12 text-center font-bold">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                                    >+</button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart size={20} />
                                    {t('common.addToCart')}
                                </button>
                            </div>

                            <Link
                                to={`/products/${product.slug}`}
                                className="block w-full text-center py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-lg hover:border-gray-800 hover:text-gray-900 transition-all"
                                onClick={onClose}
                            >
                                {t('product.viewDetails')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickViewModal;
