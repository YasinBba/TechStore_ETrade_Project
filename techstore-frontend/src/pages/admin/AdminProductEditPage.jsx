import React, { useState, useEffect } from 'react';
import { getProductImage } from '../../utils/imageUtils';
import { useNavigate, useParams } from 'react-router-dom';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { brandService } from '../../services/brandService';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminProductEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        sku: '',
        stockQuantity: 0,
        brandId: '',
        categoryId: '',
        imageUrl: ''
    });
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            console.log('Fetching initial data...');
            try {
                // Fetch categories
                console.log('Fetching categories...');
                const categoriesRes = await categoryService.getAll();
                console.log('Categories response:', categoriesRes);
                if (categoriesRes.success) setCategories(categoriesRes.data);

                // Fetch brands
                console.log('Fetching brands...');
                const brandsRes = await brandService.getAll();
                console.log('Brands response:', brandsRes);
                if (brandsRes.success) setBrands(brandsRes.data);

                if (isEditMode) {
                    console.log(`Fetching product with ID: ${id}`);
                    const productRes = await productService.getById(id);
                    console.log('Product response:', productRes);

                    if (productRes.success) {
                        const product = productRes.data;
                        console.log('Setting form data with:', product);
                        setFormData({
                            name: product.name,
                            description: product.description || '',
                            price: product.price,
                            sku: product.sku,
                            stockQuantity: product.stockQuantity,
                            brandId: product.brandId || '',
                            categoryId: product.categoryId,
                            imageUrl: product.imageUrl || ''
                        });
                    } else {
                        console.error('Product fetch failed:', productRes);
                    }
                }
            } catch (error) {
                console.error('Error loading data', error);
                if (error.response) {
                    console.error('Error response:', error.response.data);
                    console.error('Error status:', error.response.status);
                }
                alert(`Veriler yüklenirken hata oluştu: ${error.message}`);
            } finally {
                setInitialLoading(false);
            }
        };

        fetchData();
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const val = type === 'number' ? (value === '' ? '' : parseFloat(value)) : value;

        setFormData(prev => ({
            ...prev,
            [name]: val
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dataToSubmit = {
                ...formData,
                brandId: formData.brandId ? parseInt(formData.brandId) : null,
                categoryId: parseInt(formData.categoryId),
                stockQuantity: formData.stockQuantity === '' ? 0 : parseInt(formData.stockQuantity),
                price: formData.price === '' ? 0 : parseFloat(formData.price),
                // Ensure other potential number fields are handled if necessary
            };

            let result;
            if (isEditMode) {
                result = await productService.update(id, dataToSubmit);
            } else {
                result = await productService.create(dataToSubmit);
            }

            if (result.success) {
                alert(`Ürün başarıyla ${isEditMode ? 'güncellendi' : 'oluşturuldu'}.`);
                navigate('/admin/products');
            } else {
                alert('İşlem başarısız: ' + (result.message || 'Bilinmeyen hata'));
            }
        } catch (error) {
            console.error('Save failed', error);
            alert('Kaydetme başarısız: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <div className="text-center py-10">Yükleniyor...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <Link to="/admin/products" className="flex items-center text-gray-500 hover:text-blue-600 mb-6">
                <ArrowLeft size={20} className="mr-2" />
                Ürünlere Dön
            </Link>

            <h2 className="text-3xl font-bold text-gray-800 mb-8 font-orbitron">
                {isEditMode ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
            </h2>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">
                <div>
                    <label className="block text-gray-700 font-bold mb-2">Ürün Adı</label>
                    <input
                        type="text" name="name"
                        value={formData.name} onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Kategori</label>
                        <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Seçiniz</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Marka</label>
                        <select
                            name="brandId"
                            value={formData.brandId}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Seçiniz</option>
                            {brands.map(brand => (
                                <option key={brand.id} value={brand.id}>{brand.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Fiyat (₺)</label>
                        <input
                            type="number" name="price"
                            value={formData.price} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                            min="0" step="0.01"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Stok</label>
                        <input
                            type="number" name="stockQuantity"
                            value={formData.stockQuantity} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">SKU</label>
                        <input
                            type="text" name="sku"
                            value={formData.sku} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 font-bold mb-2">Görsel URL</label>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <input
                                type="text" name="imageUrl"
                                value={formData.imageUrl} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="https://example.com/image.jpg"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Boş bırakırsanız kategoriye uygun varsayılan görsel kullanılacaktır.
                            </p>
                        </div>
                        <div className="w-24 h-24 border border-gray-200 rounded-lg overflow-hidden shrink-0 bg-gray-50 flex items-center justify-center">
                            <img
                                src={getProductImage(formData.imageUrl, categories.find(c => c.id == formData.categoryId)?.name, formData.name)}
                                alt="Önizleme"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = getProductImage(null, categories.find(c => c.id == formData.categoryId)?.name, formData.name);
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 font-bold mb-2">Açıklama</label>
                    <textarea
                        name="description" rows="4"
                        value={formData.description} onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg flex items-center shadow-lg transition-transform hover:scale-105"
                    >
                        <Save size={20} className="mr-2" />
                        {loading ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminProductEditPage;
