import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, Star, ShoppingCart } from 'lucide-react';
import { productService } from '../services/productService';
import clsx from 'clsx';

const ProductListPage = () => {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({
        category: searchParams.get('category') || '',
        search: searchParams.get('search') || '',
        minPrice: '',
        maxPrice: '',
        sort: ''
    });

    useEffect(() => {
        fetchProducts();
    }, [searchParams]); // Re-fetch when URL params change

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const query = {
                ...filter,
                search: searchParams.get('search') || filter.search,
                category: searchParams.get('category') || filter.category
            };

            const result = await productService.getAll(query);
            if (result.success) {
                setProducts(result.data.items);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar */}
                <aside className="w-full md:w-64 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="flex items-center text-lg font-bold mb-4 font-orbitron">
                            <Filter className="mr-2" size={20} /> Filtreler
                        </h3>

                        {/* Price Filter */}
                        <div className="mb-6">
                            <h4 className="font-semibold mb-2 text-sm text-gray-600">Fiyat Aralığı</h4>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="number"
                                    name="minPrice"
                                    placeholder="Min"
                                    value={filter.minPrice}
                                    onChange={handleFilterChange}
                                    className="w-full px-3 py-2 border rounded text-sm"
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    name="maxPrice"
                                    placeholder="Max"
                                    value={filter.maxPrice}
                                    onChange={handleFilterChange}
                                    className="w-full px-3 py-2 border rounded text-sm"
                                />
                            </div>
                        </div>

                        {/* Sort */}
                        <div className="mb-6">
                            <h4 className="font-semibold mb-2 text-sm text-gray-600">Sıralama</h4>
                            <select
                                name="sort"
                                value={filter.sort}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border rounded text-sm bg-white"
                            >
                                <option value="">Varsayılan</option>
                                <option value="price_asc">Fiyat (Artan)</option>
                                <option value="price_desc">Fiyat (Azalan)</option>
                                <option value="name_asc">İsim (A-Z)</option>
                            </select>
                        </div>

                        <button
                            onClick={fetchProducts}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Filtrele
                        </button>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    <div className="mb-6 flex justify-between items-center">
                        <h1 className="text-2xl font-bold font-orbitron">
                            {searchParams.get('category') || 'Tüm Ürünler'}
                        </h1>
                        <span className="text-gray-500">{products.length} ürün bulundu</span>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(n => (
                                <div key={n} className="bg-white rounded-xl shadow p-4 animate-pulse h-80">
                                    <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                                    <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                                </div>
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map(product => (
                                <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 group">
                                    <div className="relative h-48 bg-gray-50 overflow-hidden">
                                        <img
                                            src={product.imageUrl || 'https://via.placeholder.com/300'}
                                            alt={product.name}
                                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-4">
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
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold text-gray-900">{product.price} ₺</span>
                                            <button className="bg-blue-100 text-blue-600 p-2 rounded-full hover:bg-blue-600 hover:text-white transition-colors">
                                                <ShoppingCart size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-lg">
                            <p className="text-gray-500 text-lg">Aradığınız kriterlere uygun ürün bulunamadı.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductListPage;
