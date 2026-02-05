import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, ShoppingCart, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const ProductDetailPage = () => {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

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
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold mb-4">Ürün Bulunamadı</h2>
                <Link to="/products" className="text-blue-600 hover:underline">Ürünlere Geri Dön</Link>
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart(product, quantity);
        // Optional: Show toast notification
        alert('Ürün sepete eklendi!');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/products" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors">
                <ArrowLeft size={20} className="mr-2" />
                Ürünlere Dön
            </Link>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    {/* Image Gallery */}
                    <div className="md:w-1/2 bg-gray-50 p-8 flex items-center justify-center">
                        <img
                            src={product.imageUrl || 'https://via.placeholder.com/600'}
                            alt={product.name}
                            className="max-h-[500px] w-auto object-contain hover:scale-105 transition-transform duration-500"
                        />
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
                            <span className="text-gray-500 text-sm">({product.reviewCount || 12} değerlendirme)</span>
                        </div>

                        <div className="text-3xl font-bold text-gray-900 mb-6">{product.price.toLocaleString('tr-TR')} ₺</div>

                        <p className="text-gray-600 mb-8 leading-relaxed">
                            {product.description || 'Bu ürün için henüz açıklama girilmemiş. Ancak TechStore kalitesiyle güvence altındadır.'}
                        </p>

                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                >
                                    -
                                </button>
                                <span className="px-4 py-2 font-bold min-w-[3rem] text-center">{quantity}</span>
                                <button
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    +
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg flex items-center justify-center transition-all transform hover:scale-105 shadow-md"
                            >
                                <ShoppingCart className="mr-2" size={20} />
                                Sepete Ekle
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-gray-100">
                            <div className="flex items-center text-gray-700">
                                <Truck className="text-blue-500 mr-3" size={24} />
                                <div>
                                    <div className="font-bold text-sm">Ücretsiz Kargo</div>
                                    <div className="text-xs text-gray-500">Tüm siparişlerde</div>
                                </div>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <ShieldCheck className="text-green-500 mr-3" size={24} />
                                <div>
                                    <div className="font-bold text-sm">2 Yıl Garanti</div>
                                    <div className="text-xs text-gray-500">Resmi distribütör garantili</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
