import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import SEO from '../components/SEO';
import EmptyState from '../components/common/EmptyState';
import Breadcrumb from '../components/common/Breadcrumb';

const WishlistPage = () => {
    const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
    const { addToCart } = useCart();

    const breadcrumbItems = [
        { label: 'Favorilerim' }
    ];

    if (wishlist.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Breadcrumb items={breadcrumbItems} />
                <EmptyState
                    type="wishlist"
                    message="Favori listeniz henüz boş."
                    action={() => window.location.href = '/products'}
                    actionLabel="Ürünleri Keşfet"
                />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <SEO title="Favorilerim | TechStore" description="Favori ürünleriniz." />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <Breadcrumb items={breadcrumbItems} />
                    <h1 className="text-2xl font-bold font-orbitron mt-2">Favorilerim ({wishlist.length})</h1>
                </div>
                <button
                    onClick={clearWishlist}
                    className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                    <Trash2 size={16} />
                    Listeyi Temizle
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlist.map(product => (
                    <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden group">
                        <div className="relative h-48 bg-gray-50 p-4">
                            <img
                                src={product.imageUrl || 'https://via.placeholder.com/300'}
                                alt={product.name}
                                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                            />
                            <button
                                onClick={() => removeFromWishlist(product.id)}
                                className="absolute top-2 right-2 p-2 bg-white rounded-full text-gray-400 hover:text-red-600 shadow-sm transition-colors z-10"
                                title="Favorilerden Kaldır"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <div className="p-4">
                            <Link to={`/products/${product.slug}`}>
                                <h3 className="font-bold text-gray-800 mb-2 truncate hover:text-blue-600 transition-colors">{product.name}</h3>
                            </Link>
                            <div className="text-lg font-bold text-gray-900 mb-4">{product.price.toLocaleString('tr-TR')} ₺</div>

                            <button
                                onClick={() => addToCart(product)}
                                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <ShoppingCart size={18} />
                                Sepete Ekle
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WishlistPage;
