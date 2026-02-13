import React, { useEffect, useState } from 'react';
import { contentService } from '../../services/contentService';
import { Plus, Edit, Trash2, Eye, EyeOff, Save, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const AdminBannersPage = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [currentBanner, setCurrentBanner] = useState(null);

    const initialFormState = {
        title: '',
        description: '',
        imageUrl: '',
        linkUrl: '',
        isActive: true,
        order: 0
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        setLoading(true);
        const result = await contentService.getBanners(false); // Fetch all including inactive
        if (result.success) {
            setBanners(result.data);
        }
        setLoading(false);
    };

    const handleEdit = (banner) => {
        setCurrentBanner(banner);
        setFormData(banner);
        setIsEditing(true);
    };

    const handleNew = () => {
        setCurrentBanner(null);
        setFormData(initialFormState);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu bannerı silmek istediğinize emin misiniz?')) {
            const result = await contentService.deleteBanner(id);
            if (result.success) {
                showToast('Banner silindi', 'success');
                fetchBanners();
            } else {
                showToast('Silme başarısız', 'error');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let result;
        if (currentBanner) {
            result = await contentService.updateBanner(currentBanner.id, formData);
        } else {
            result = await contentService.createBanner(formData);
        }

        if (result.success) {
            showToast(currentBanner ? 'Banner güncellendi' : 'Banner oluşturuldu', 'success');
            setIsEditing(false);
            fetchBanners();
        } else {
            showToast(result.message || 'İşlem başarısız', 'error');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value // No number conversion for order yet, handle on submit if needed or input type number handles it mostly
        }));
    };

    return (
        <div className="flex gap-6 h-[calc(100vh-100px)]">
            {/* Left: Banner List */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isEditing ? 'w-1/2 hidden lg:flex' : 'w-full'}`}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold font-orbitron text-gray-800">Banner Yönetimi</h2>
                    <button
                        onClick={handleNew}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} className="mr-2" /> Yeni Banner
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 overflow-auto">
                    {loading ? (
                        <div className="p-8 text-center">Yükleniyor...</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-sm uppercase font-semibold sticky top-0">
                                <tr>
                                    <th className="px-6 py-3">Görsel</th>
                                    <th className="px-6 py-3">Başlık</th>
                                    <th className="px-6 py-3 text-center">Sıra</th>
                                    <th className="px-6 py-3 text-center">Durum</th>
                                    <th className="px-6 py-3 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {banners.map((banner) => (
                                    <tr key={banner.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="h-16 w-32 bg-gray-100 rounded overflow-hidden">
                                                <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-800">{banner.title}</td>
                                        <td className="px-6 py-4 text-center">{banner.order}</td>
                                        <td className="px-6 py-4 text-center">
                                            {banner.isActive ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">Aktif</span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">Pasif</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleEdit(banner)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded">
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(banner.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Right: Edit/Create Form */}
            {isEditing && (
                <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
                        <h3 className="font-bold text-lg text-gray-800">
                            {currentBanner ? 'Banner Düzenle' : 'Yeni Banner'}
                        </h3>
                        <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto flex-1">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                                <textarea
                                    name="description"
                                    value={formData.description || ''}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Görsel URL</label>
                                <input
                                    type="text"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                    placeholder="https://example.com/image.jpg"
                                />
                                {formData.imageUrl && (
                                    <div className="mt-2 h-32 w-full rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                        <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                                <input
                                    type="text"
                                    name="linkUrl"
                                    value={formData.linkUrl || ''}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="/products/category/gaming"
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sıralama</label>
                                    <input
                                        type="number"
                                        name="order"
                                        value={formData.order}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="flex items-center pt-6">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="isActive"
                                            checked={formData.isActive}
                                            onChange={handleChange}
                                            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-gray-700 font-medium">Aktif</span>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                                >
                                    <Save size={18} className="mr-2" />
                                    {currentBanner ? 'Güncelle' : 'Kaydet'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBannersPage;
