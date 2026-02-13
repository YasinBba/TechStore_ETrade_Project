import React, { useEffect, useState } from 'react';
import { brandService } from '../../services/brandService';
import { Edit, Trash2, Plus, Search, Save, X } from 'lucide-react';

const AdminBrandsPage = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', website: '' });

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        setLoading(true);
        try {
            const result = await brandService.getAll();
            if (result.success) {
                setBrands(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch brands', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu markayı silmek istediğinize emin misiniz?')) {
            try {
                const result = await brandService.delete(id);
                if (result.success) {
                    setBrands(brands.filter(b => b.id !== id));
                    alert('Marka silindi.');
                } else {
                    alert('Silme başarısız: ' + result.message);
                }
            } catch (error) {
                console.error('Delete failed', error);
                alert('Silme işlemi başarısız.');
            }
        }
    };

    const handleEdit = (brand) => {
        setEditingBrand(brand);
        setFormData({
            name: brand.name,
            description: brand.description || '',
            website: brand.website || ''
        });
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingBrand(null);
        setFormData({ name: '', description: '', website: '' });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let result;
            if (editingBrand) {
                result = await brandService.update(editingBrand.id, formData);
            } else {
                result = await brandService.create(formData);
            }

            if (result.success) {
                alert(`Marka başarıyla ${editingBrand ? 'güncellendi' : 'oluşturuldu'}.`);
                setIsModalOpen(false);
                fetchBrands();
            } else {
                alert('İşlem başarısız: ' + result.message);
            }
        } catch (error) {
            console.error('Save failed', error);
            alert('Kaydetme başarısız.');
        }
    };

    const filteredBrands = brands.filter(b =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 font-orbitron">Marka Yönetimi</h2>
                <button
                    onClick={handleAddNew}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center shadow-lg transition-transform hover:scale-105"
                >
                    <Plus size={20} className="mr-2" />
                    Yeni Marka
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center">
                    <Search className="text-gray-400 mr-3" size={20} />
                    <input
                        type="text"
                        placeholder="Marka Ara..."
                        className="bg-transparent border-none focus:ring-0 w-full text-gray-600 placeholder-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-sm uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Marka</th>
                                <th className="px-6 py-4">Açıklama</th>
                                <th className="px-6 py-4">Web Sitesi</th>
                                <th className="px-6 py-4 text-center">Ürün Sayısı</th>
                                <th className="px-6 py-4 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-8">Yükleniyor...</td></tr>
                            ) : filteredBrands.length > 0 ? (
                                filteredBrands.map((brand) => (
                                    <tr key={brand.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{brand.name}</td>
                                        <td className="px-6 py-4 text-gray-500">{brand.description}</td>
                                        <td className="px-6 py-4 text-blue-600">{brand.website}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                {brand.productCount}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleEdit(brand)} className="inline-flex items-center justify-center text-blue-500 hover:text-blue-700 p-1.5 rounded transition-colors">
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(brand.id)} className="inline-flex items-center justify-center text-red-500 hover:text-red-700 p-1.5 rounded transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" className="text-center py-8 text-gray-500">Marka bulunamadı.</td></tr>
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
                                {editingBrand ? 'Marka Düzenle' : 'Yeni Marka'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Marka Adı</label>
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
                                <label className="block text-gray-700 font-bold mb-2">Web Sitesi</label>
                                <input
                                    type="text"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
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

export default AdminBrandsPage;
