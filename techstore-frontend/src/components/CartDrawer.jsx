import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/currencyUtils';

const CartDrawer = ({ isOpen, onClose, cartItems, updateQuantity, removeFromCart, cartTotal }) => {
    const { t } = useTranslation();
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col transform transition-transform">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        {t('cart.title')} ({cartItems.length})
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Cart Items */}
                {cartItems.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
                        <p className="text-gray-500 mb-2">{t('cart.empty')}</p>
                        <p className="text-sm text-gray-400">{t('cart.emptySubtitle')}</p>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.productId} className="flex gap-3 bg-gray-50 rounded-lg p-3">
                                    <Link
                                        to={`/products/${item.productId}`}
                                        onClick={onClose}
                                        className="shrink-0"
                                    >
                                        <img
                                            src={item.imageUrl || 'https://via.placeholder.com/80'}
                                            alt={item.productName}
                                            className="w-20 h-20 object-contain rounded"
                                        />
                                    </Link>

                                    <div className="flex-1 min-w-0">
                                        <Link
                                            to={`/products/${item.productId}`}
                                            onClick={onClose}
                                            className="font-medium text-sm text-gray-800 hover:text-blue-600 line-clamp-2"
                                        >
                                            {item.productName}
                                        </Link>
                                        <div className="text-blue-600 font-bold mt-1">
                                            {formatPrice(item.price)}
                                        </div>

                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center border border-gray-300 rounded">
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    className="p-1 hover:bg-gray-100 disabled:opacity-50"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="px-3 text-sm font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                    className="p-1 hover:bg-gray-100"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item.productId)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="border-t p-4 space-y-3">
                            <div className="flex justify-between text-lg font-bold">
                                <span>{t('cart.total')}</span>
                                <span>{formatPrice(cartTotal)}</span>
                            </div>

                            <Link
                                to="/checkout"
                                onClick={onClose}
                                className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-3 rounded-xl transition-colors"
                            >
                                {t('cart.checkout')}
                            </Link>

                            <Link
                                to="/cart"
                                onClick={onClose}
                                className="block w-full text-center text-gray-600 hover:text-blue-600 text-sm font-medium"
                            >
                                {t('cart.viewCart')}
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default CartDrawer;
