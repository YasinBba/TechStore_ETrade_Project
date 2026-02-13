import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { getProductImage } from '../utils/imageUtils';

const CartItem = ({ item, updateQuantity, removeFromCart }) => {
    const [imgSrc, setImgSrc] = useState(getProductImage(item.imageUrl, item.categoryName || item.category, item.productName));
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setImgSrc(getProductImage(item.imageUrl, item.categoryName || item.category, item.productName));
    }, [item]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row items-center transition-all hover:shadow-md">
            <Link to={`/products/${item.productId}`} className="shrink-0 mb-4 sm:mb-0">
                {!hasError ? (
                    <img
                        src={imgSrc}
                        alt={item.productName}
                        className="w-24 h-24 object-contain rounded"
                        onError={() => {
                            const fallbackUrl = getProductImage(null, item.categoryName || item.category, item.productName);
                            if (imgSrc === fallbackUrl) {
                                setHasError(true);
                            } else {
                                setImgSrc(fallbackUrl);
                            }
                        }}
                    />
                ) : (
                    <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center text-gray-300">
                        <ImageIcon size={24} />
                    </div>
                )}
            </Link>

            <div className="flex-1 sm:ml-6 text-center sm:text-left w-full">
                <Link to={`/products/${item.productId}`} className="text-lg font-bold text-gray-800 hover:text-blue-600 truncate block">
                    {item.productName}
                </Link>
                <div className="text-blue-600 font-bold mt-1">{item.price.toLocaleString('tr-TR')} ₺</div>
            </div>

            <div className="flex items-center justify-between w-full sm:w-auto mt-4 sm:mt-0 space-x-6">
                {/* Quantity Controls */}
                <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100 text-gray-500 transition-colors"
                        disabled={item.quantity <= 1}
                    >
                        <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                    <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                {/* Remove Button */}
                <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-full hover:bg-red-100 transition-colors"
                    title="Sepetten Sil"
                >
                    <Trash2 size={20} />
                </button>
            </div>
        </div>
    );
};

export default CartItem;
