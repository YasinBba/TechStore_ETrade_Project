import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
                    <ShoppingBag size={48} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Sepetiniz Boş</h2>
                <p className="text-gray-500 mb-8">Henüz sepetinize hiç ürün eklemediniz.</p>
                <Link
                    to="/products"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all hover:shadow-lg"
                >
                    Alışverişe Başla
                </Link>
            </div>
        );
    }

    const handleCheckout = () => {
        if (!user) {
            navigate('/login');
        } else {
            navigate('/checkout');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 font-orbitron">Alışveriş Sepeti ({cartItems.length} Ürün)</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items List */}
                <div className="lg:w-2/3 space-y-4">
                    {cartItems.map((item) => (
                        <div key={item.productId} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row items-center transition-all hover:shadow-md">
                            <Link to={`/products/${item.productId}`} className="shrink-0 mb-4 sm:mb-0">
                                <img
                                    src={item.imageUrl || 'https://via.placeholder.com/150'}
                                    alt={item.productName}
                                    className="w-24 h-24 object-contain rounded"
                                />
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
                    ))}

                    <button
                        onClick={clearCart}
                        className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center mt-4"
                    >
                        <Trash2 size={16} className="mr-1" /> Sepeti Temizle
                    </button>
                </div>

                {/* Order Summary */}
                <div className="lg:w-1/3">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 sticky top-24">
                        <h2 className="text-xl font-bold mb-6 border-b pb-4">Sipariş Özeti</h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Ara Toplam</span>
                                <span>{cartTotal.toLocaleString('tr-TR')} ₺</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Kargo</span>
                                <span className="text-green-600 font-medium">Ücretsiz</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t">
                                <span>Toplam</span>
                                <span>{cartTotal.toLocaleString('tr-TR')} ₺</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:scale-[1.02]"
                        >
                            Siparişi Tamamla
                        </button>

                        <Link to="/products" className="block text-center text-gray-500 hover:text-blue-600 mt-4 text-sm font-medium">
                            Alışverişe Devam Et
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
