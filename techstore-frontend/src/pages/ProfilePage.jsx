import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { userService } from '../services/userService';
import { addressService } from '../services/addressService';
import AddressModal from '../components/AddressModal';

const ProfilePage = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(false);

    // General info state
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });

    // Password change state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Addresses state
    const [addresses, setAddresses] = useState([]);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    useEffect(() => {
        loadProfileData();
    }, []);

    useEffect(() => {
        if (activeTab === 'addresses') {
            loadAddresses();
        }
    }, [activeTab]);

    const loadProfileData = async () => {
        try {
            const response = await userService.getProfile();
            if (response.success) {
                setProfile(response.data);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    };

    const loadAddresses = async () => {
        try {
            const response = await addressService.getUserAddresses();
            if (response.success) {
                setAddresses(response.data);
            }
        } catch (error) {
            console.error('Error loading addresses:', error);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await userService.updateProfile({
                firstName: profile.firstName,
                lastName: profile.lastName,
                phone: profile.phone
            });
            if (response.success) {
                showToast('Profil başarıyla güncellendi', 'success');
            } else {
                showToast(response.message || 'Bir hata oluştu', 'error');
            }
        } catch (error) {
            showToast('Profil güncellenirken hata oluştu', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showToast('Yeni şifreler eşleşmiyor', 'error');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            showToast('Yeni şifre en az 6 karakter olmalıdır', 'error');
            return;
        }

        setLoading(true);
        try {
            const response = await userService.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            if (response.success) {
                showToast('Şifre başarıyla değiştirildi', 'success');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                showToast(response.message || 'Bir hata oluştu', 'error');
            }
        } catch (error) {
            showToast('Şifre değiştirilirken hata oluştu', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAddress = async (id) => {
        if (!window.confirm('Bu adresi silmek istediğinizden emin misiniz?')) return;

        try {
            const response = await addressService.deleteAddress(id);
            if (response.success) {
                showToast('Adres başarıyla silindi', 'success');
                loadAddresses();
            }
        } catch (error) {
            showToast('Adres silinirken hata oluştu', 'error');
        }
    };

    const handleSetDefaultAddress = async (id) => {
        try {
            const response = await addressService.setDefaultAddress(id);
            if (response.success) {
                showToast('Varsayılan adres güncellendi', 'success');
                loadAddresses();
            }
        } catch (error) {
            showToast('Varsayılan adres güncellenirken hata oluştu', 'error');
        }
    };

    const handleAddressModalClose = (shouldReload) => {
        setIsAddressModalOpen(false);
        setEditingAddress(null);
        if (shouldReload) {
            loadAddresses();
        }
    };

    const tabs = [
        { id: 'general', label: 'Genel Bilgiler', icon: '👤' },
        { id: 'password', label: 'Şifre Değiştir', icon: '🔒' },
        { id: 'addresses', label: 'Adres Defteri', icon: '📍' },
        { id: 'settings', label: 'Hesap Ayarları', icon: '⚙️' }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Hesabım</h1>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-8">
                <nav className="flex space-x-8">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="max-w-2xl">
                {/* General Info Tab */}
                {activeTab === 'general' && (
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Kişisel Bilgiler</h2>
                        <form onSubmit={handleUpdateProfile}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Ad</label>
                                    <input
                                        type="text"
                                        value={profile.firstName}
                                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Soyad</label>
                                    <input
                                        type="text"
                                        value={profile.lastName}
                                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">E-posta</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm cursor-not-allowed"
                                        disabled
                                    />
                                    <p className="mt-1 text-sm text-gray-500">E-posta adresi değiştirilemez</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Telefon</label>
                                    <input
                                        type="tel"
                                        value={profile.phone || ''}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="+90 5XX XXX XX XX"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
                            >
                                {loading ? 'Kaydediliyor...' : 'Bilgileri Güncelle'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Password Change Tab */}
                {activeTab === 'password' && (
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Şifre Değiştir</h2>
                        <form onSubmit={handleChangePassword}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mevcut Şifre</label>
                                    <input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Yeni Şifre</label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                        minLength={6}
                                    />
                                    <p className="mt-1 text-sm text-gray-500">En az 6 karakter olmalıdır</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Yeni Şifre (Tekrar)</label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
                            >
                                {loading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Addresses Tab */}
                {activeTab === 'addresses' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Kayıtlı Adresler</h2>
                            <button
                                onClick={() => setIsAddressModalOpen(true)}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                            >
                                + Yeni Adres Ekle
                            </button>
                        </div>

                        {addresses.length === 0 ? (
                            <div className="bg-white shadow-md rounded-lg p-8 text-center text-gray-500">
                                Henüz kayıtlı adresiniz yok.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {addresses.map(address => (
                                    <div key={address.id} className="bg-white shadow-md rounded-lg p-6 relative">
                                        {address.isDefault && (
                                            <span className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                                Varsayılan
                                            </span>
                                        )}
                                        <h3 className="font-semibold text-lg mb-2">{address.title}</h3>
                                        <p className="text-gray-700">{address.fullName}</p>
                                        <p className="text-gray-600 text-sm">{address.phone}</p>
                                        <p className="text-gray-600 text-sm mt-2">
                                            {address.addressLine1}
                                            {address.addressLine2 && `, ${address.addressLine2}`}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            {address.neighborhood}, {address.district}, {address.city} {address.postalCode}
                                        </p>
                                        <p className="text-gray-500 text-xs mt-2">
                                            {address.addressType === 'Home' ? '🏠 Ev' : address.addressType === 'Work' ? '🏢 İş' : '📍 Diğer'}
                                        </p>
                                        <div className="mt-4 flex space-x-2">
                                            <button
                                                onClick={() => {
                                                    setEditingAddress(address);
                                                    setIsAddressModalOpen(true);
                                                }}
                                                className="text-indigo-600 hover:text-indigo-800 text-sm"
                                            >
                                                Düzenle
                                            </button>
                                            {!address.isDefault && (
                                                <button
                                                    onClick={() => handleSetDefaultAddress(address.id)}
                                                    className="text-green-600 hover:text-green-800 text-sm"
                                                >
                                                    Varsayılan Yap
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteAddress(address.id)}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Sil
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Hesap Ayarları</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-medium mb-2">Bildirim Tercihleri</h3>
                                <label className="flex items-center">
                                    <input type="checkbox" className="mr-2" defaultChecked />
                                    <span className="text-sm">E-posta bildirimleri</span>
                                </label>
                                <label className="flex items-center mt-2">
                                    <input type="checkbox" className="mr-2" />
                                    <span className="text-sm">SMS bildirimleri</span>
                                </label>
                                <label className="flex items-center mt-2">
                                    <input type="checkbox" className="mr-2" />
                                    <span className="text-sm">Pazarlama e-postaları</span>
                                </label>
                            </div>
                            <div className="pt-6 border-t">
                                <h3 className="font-medium text-red-600 mb-2">Tehlikeli Bölge</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Hesabınızı silmek istiyorsanız lütfen dikkatli olun. Bu işlem geri alınamaz.
                                </p>
                                <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                                    Hesabı Sil
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Address Modal */}
            {isAddressModalOpen && (
                <AddressModal
                    address={editingAddress}
                    onClose={handleAddressModalClose}
                />
            )}
        </div>
    );
};

export default ProfilePage;
