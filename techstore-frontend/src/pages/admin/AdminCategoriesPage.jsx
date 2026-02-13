import React, { useEffect, useState } from 'react';
import { categoryService } from '../../services/categoryService';
import { Edit, Trash2, Plus, Search, Save, X } from 'lucide-react';

const AdminCategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', imageUrl: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const result = await categoryService.getAll();
            if (result.success) {
                setCategories(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch categories', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
            try {
                const result = await categoryService.delete(id);
                if (result.success) {
                    setCategories(categories.filter(c => c.id !== id));
                    alert('Kategori silindi.');
                } else {
                    alert('Silme başarısız: ' + result.message);
                }
            } catch (error) {
                console.error('Delete failed', error);
                alert('Silme işlemi başarısız.');
            }
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || '',
            imageUrl: category.imageUrl || ''
        });
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingCategory(null);
        setFormData({ name: '', description: '', imageUrl: '' });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let result;
            if (editingCategory) {
                result = await categoryService.update(editingCategory.id, formData);
            } else {
                result = await categoryService.create(formData);
            }

            if (result.success) {
                alert(`Kategori başarıyla ${editingCategory ? 'güncellendi' : 'oluşturuldu'}.`);
                setIsModalOpen(false);
                fetchCategories();
            } else {
                alert('İşlem başarısız: ' + result.message);
            }
        } catch (error) {
            console.error('Save failed', error);
            alert('Kaydetme başarısız.');
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 font-orbitron">Kategori Yönetimi</h2>
                <button
                    onClick={handleAddNew}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center shadow-lg transition-transform hover:scale-105"
                >
                    <Plus size={20} className="mr-2" />
                    Yeni Kategori
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center">
                    <Search className="text-gray-400 mr-3" size={20} />
                    <input
                        type="text"
                        placeholder="Kategori Ara..."
                        className="bg-transparent border-none focus:ring-0 w-full text-gray-600 placeholder-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-sm uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Kategori</th>
                                <th className="px-6 py-4">Açıklama</th>
                                <th className="px-6 py-4 text-center">Ürün Sayısı</th>
                                <th className="px-6 py-4 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-8">Yükleniyor...</td></tr>
                            ) : filteredCategories.length > 0 ? (
                                filteredCategories.map((category) => (
                                    <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 flex items-center">
                                            {category.imageUrl && (
                                                <img src={category.imageUrl} alt="" className="w-8 h-8 rounded mr-3 object-cover" />
                                            )}
                                            {category.name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{category.description}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                {category.productCount}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleEdit(category)} className="inline-flex items-center justify-center text-blue-500 hover:text-blue-700 p-1.5 rounded transition-colors">
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(category.id)} className="inline-flex items-center justify-center text-red-500 hover:text-red-700 p-1.5 rounded transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" className="text-center py-8 text-gray-500">Kategori bulunamadı.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold font-orbitron">
                                {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Kategori Adı</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Açıklama</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Görsel URL</label>
                                <input
                                    type="text"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="pt-4 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                                >
                                    <Save size={18} className="mr-2" />
                                    Kaydet
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategoriesPage;
