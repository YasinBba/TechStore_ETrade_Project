import React, { useEffect, useState } from 'react';
import { productService } from '../../services/productService';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const result = await productService.getAll();
            if (result.success) {
                setProducts(result.data.items);
            }
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
            try {
                const result = await productService.delete(id);
                if (result.success) {
                    setProducts(products.filter(p => p.id !== id));
                    alert('Ürün başarıyla silindi.');
                } else {
                    alert('Silme işlemi başarısız: ' + (result.message || 'Bilinmeyen hata'));
                }
            } catch (error) {
                console.error('Delete failed', error);
                alert('Silme işlemi sırasında bir hata oluştu.');
            }
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 font-orbitron">Ürün Yönetimi</h2>
                <Link
                    to="/admin/products/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center shadow-lg transition-transform hover:scale-105"
                >
                    <Plus size={20} className="mr-2" />
                    Yeni Ürün
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center">
                    <Search className="text-gray-400 mr-3" size={20} />
                    <input
                        type="text"
                        placeholder="Ürün Ara..."
                        className="bg-transparent border-none focus:ring-0 w-full text-gray-600 placeholder-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-sm uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Ürün</th>
                                <th className="px-6 py-4">Fiyat</th>
                                <th className="px-6 py-4 text-center hidden md:table-cell">Stok</th>
                                <th className="px-6 py-4 text-center hidden lg:table-cell">Değerlendirme</th>
                                <th className="px-6 py-4 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-8">Yükleniyor...</td>
                                </tr>
                            ) : filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0 mr-4 bg-gray-100 rounded-lg overflow-hidden">
                                                <img
                                                    src={product.imageUrl || 'https://via.placeholder.com/40'}
                                                    alt=""
                                                    className="h-full w-full object-contain"
                                                />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{product.name}</div>
                                                <div className="text-sm text-gray-500">{product.brandName}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-700">
                                            {product.price} ₺
                                        </td>
                                        <td className="px-6 py-4 text-center hidden md:table-cell">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${true ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                Stokta (Mock)
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-500 hidden lg:table-cell">
                                            {product.rating} / 5
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    to={`/admin/products/edit/${product.id}`}
                                                    className="inline-flex items-center justify-center text-blue-500 hover:text-blue-700 p-1.5 rounded transition-colors"
                                                >
                                                    <Edit size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="inline-flex items-center justify-center text-red-500 hover:text-red-700 p-1.5 rounded transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-gray-500">Ürün bulunamadı.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminProductsPage;
