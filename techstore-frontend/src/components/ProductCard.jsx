import React from 'react';
import { useTranslation } from 'react-i18next';
import { getProductImage } from '../utils/imageUtils';
import { formatPrice } from '../utils/currencyUtils';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Image as ImageIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const ProductCard = ({ product }) => {
    const { t } = useTranslation();
    const { addToCart } = useCart();
    const { showToast } = useToast();
    const [imgSrc, setImgSrc] = React.useState(getProductImage(product.images && product.images.length > 0 ? product.images[0].imageUrl : product.imageUrl, product.categoryName, product.name));
    const [hasError, setHasError] = React.useState(false);

    React.useEffect(() => {
        setImgSrc(getProductImage(product.images && product.images.length > 0 ? product.images[0].imageUrl : product.imageUrl, product.categoryName, product.name));
    }, [product]);

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product, 1);
        showToast(`${product.name} sepete eklendi!`, 'success');
    };

    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 group animate-fade-in flex flex-col h-full">
            <div className="relative h-40 md:h-48 bg-gray-50 overflow-hidden shrink-0">
                <Link to={`/products/${product.slug}`} className="block h-full w-full">
                    {!hasError ? (
                        <img
                            src={imgSrc}
                            alt={product.images && product.images.length > 0 ? (product.images[0].altText || product.name) : product.name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 p-2"
                            loading="lazy"
                            onError={() => {
                                const fallbackUrl = getProductImage(null, product.categoryName, product.name);
                                if (imgSrc === fallbackUrl) {
                                    setHasError(true);
                                } else {
                                    setImgSrc(fallbackUrl);
                                }
                            }}
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                            <ImageIcon size={32} />
                        </div>
                    )}
                </Link>
                {product.discount > 0 && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] md:text-xs font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded">
                        %{product.discount} {t('product.discount')}
                    </span>
                )}
            </div>
            <div className="p-3 md:p-4 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
                        {product.brandName || t('product.brandLabel')}
                    </span>
                    {product.categoryName && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {product.categoryName}
                        </span>
                    )}
                </div>
                <Link to={`/products/${product.slug}`} className="block mb-2">
                    <h3 className="font-bold text-gray-800 truncate group-hover:text-blue-600 transition-colors" title={product.name}>
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
                <div className="flex justify-between items-center mt-auto">
                    <div>
                        <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
                        {product.oldPrice && (
                            <span className="block text-xs text-gray-400 line-through">
                                {formatPrice(product.oldPrice)}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className="bg-blue-100 text-blue-600 p-2 rounded-full hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        title={t('common.addToCart')}
                        aria-label={`${product.name} ${t('common.addToCart')}`}
                    >
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
