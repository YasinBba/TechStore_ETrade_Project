import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/CartItem';

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
                        <CartItem
                            key={item.productId}
                            item={item}
                            updateQuantity={updateQuantity}
                            removeFromCart={removeFromCart}
                        />
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

            {/* Mobile Sticky Checkout Button */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-2xl z-50">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-500">Toplam</span>
                        <span className="text-xl font-bold text-gray-900">{cartTotal.toLocaleString('tr-TR')} ₺</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex-1"
                    >
                        Siparişi Tamamla
                    </button>
                </div>
            </div>
            {/* Spacer for sticky footer */}
            <div className="h-24 lg:hidden"></div>
        </div>
    );
};

export default CartPage;
