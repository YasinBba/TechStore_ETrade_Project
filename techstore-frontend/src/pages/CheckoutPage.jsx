import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // Although user comes from addressService mostly
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { addressService } from '../services/addressService';
import { CreditCard, MapPin, Truck, CheckCircle, Plus, AlertCircle } from 'lucide-react';
import AddressCard from '../components/AddressCard';
import AddressModal from '../components/AddressModal';

const CheckoutPage = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { showToast } = useToast();
    const navigate = useNavigate();

    // UI State
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Success
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [loadingAddresses, setLoadingAddresses] = useState(false);

    // Order Data State
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('CreditCard');
    const [cardDetails, setCardDetails] = useState({
        cardName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    // Load user addresses on mount
    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        setLoadingAddresses(true);
        try {
            const response = await addressService.getUserAddresses();
            if (response.success) {
                setAddresses(response.data);
                // Select default address if available
                const defaultAddr = response.data.find(a => a.isDefault);
                if (defaultAddr) setSelectedAddress(defaultAddr);
                else if (response.data.length > 0) setSelectedAddress(response.data[0]);
            }
        } catch (error) {
            console.error('Error loading addresses', error);
            showToast('Adresler yüklenirken bir hata oluştu', 'error');
        } finally {
            setLoadingAddresses(false);
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            showToast('Lütfen bir teslimat adresi seçin', 'error');
            return;
        }

        setLoading(true);
        try {
            // Prepare order data suitable for backend API
            const orderData = {
                shippingAddressId: selectedAddress.id,
                billingAddressId: selectedAddress.id, // Using same for now, can be split later
                paymentMethod: paymentMethod,
                couponId: null, // Next phase
                notes: 'Standard Delivery'
            };

            const result = await orderService.create(orderData);

            if (result.success) {
                clearCart();
                setStep(3);
                showToast('Siparişiniz başarıyla oluşturuldu!', 'success');
            } else {
                showToast(result.message || 'Sipariş oluşturulamadı', 'error');
            }
        } catch (error) {
            console.error('Order failed', error);
            showToast('Sipariş oluşturulurken bir beklenmedik hata oluştu.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAddressModalClose = (shouldReload) => {
        setIsAddressModalOpen(false);
        if (shouldReload) {
            loadAddresses();
        }
    };

    if (cartItems.length === 0 && step !== 3) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                    <AlertCircle size={48} />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Sepetiniz Boş</h1>
                <p className="text-gray-600 mb-8">Sepetinizde ürün bulunmamaktadır. Alışverişe başlamak için ürünleri inceleyin.</p>
                <button
                    onClick={() => navigate('/products')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105"
                >
                    Alışverişe Başla
                </button>
            </div>
        );
    }

    if (step === 3) {
        return (
            <div className="container mx-auto px-4 py-20 text-center animate-fade-in-up">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 animate-bounce-short">
                    <CheckCircle size={48} />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Siparişiniz Alındı!</h1>
                <p className="text-gray-600 mb-8">
                    Siparişiniz başarıyla oluşturuldu. Sipariş detayları e-posta adresinize gönderildi.
                    <br />
                    Detayları profilinizden de takip edebilirsiniz.
                </p>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105"
                    >
                        Alışverişe Devam Et
                    </button>
                    <button
                        onClick={() => navigate('/profile?tab=orders')}
                        className="bg-white border-2 border-gray-200 hover:border-blue-500 text-gray-700 font-bold py-3 px-8 rounded-full transition-colors"
                    >
                        Siparişlerime Git
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 font-orbitron">Ödeme ve Sipariş</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Content - Left Column */}
                <div className="lg:w-2/3 space-y-6">

                    {/* Step 1: Address */}
                    <div className={`bg-white rounded-xl p-6 shadow-sm border transition-all ${step === 1 ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 opacity-60'}`}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold flex items-center">
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm ${step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>1</span>
                                Teslimat Adresi
                            </h2>
                            {step > 1 && (
                                <button onClick={() => setStep(1)} className="text-blue-600 text-sm font-semibold hover:underline">Değiştir</button>
                            )}
                        </div>

                        {step === 1 && (
                            <div className="space-y-4 animate-fade-in">
                                {loadingAddresses ? (
                                    <div className="text-center py-8 text-gray-500">Adresler yükleniyor...</div>
                                ) : (
                                    <>
                                        {addresses.length === 0 ? (
                                            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                                                <MapPin className="mx-auto text-gray-400 mb-2" size={32} />
                                                <p className="text-gray-600 mb-4">Kayıtlı adresiniz bulunmamaktadır.</p>
                                                <button
                                                    onClick={() => setIsAddressModalOpen(true)}
                                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                                                >
                                                    + Yeni Adres Ekle
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {addresses.map(addr => (
                                                    <AddressCard
                                                        key={addr.id}
                                                        address={addr}
                                                        selectable={true}
                                                        selected={selectedAddress?.id === addr.id}
                                                        onSelect={setSelectedAddress}
                                                    />
                                                ))}
                                                <button
                                                    onClick={() => setIsAddressModalOpen(true)}
                                                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors group h-full min-h-[160px]"
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-blue-200 flex items-center justify-center mb-2 transition-colors">
                                                        <Plus className="text-gray-500 group-hover:text-blue-600" />
                                                    </div>
                                                    <span className="text-gray-600 font-medium group-hover:text-blue-600">Yeni Adres Ekle</span>
                                                </button>
                                            </div>
                                        )}

                                        <div className="mt-6 flex justify-end">
                                            <button
                                                onClick={() => setStep(2)}
                                                disabled={!selectedAddress}
                                                className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                            >
                                                Devam Et
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {step > 1 && selectedAddress && (
                            <div className="pl-11 text-gray-600 text-sm">
                                <p className="font-semibold text-gray-800">{selectedAddress.title}</p>
                                <p>{selectedAddress.addressLine1}, {selectedAddress.district}/{selectedAddress.city}</p>
                            </div>
                        )}
                    </div>

                    {/* Step 2: Payment */}
                    <div className={`bg-white rounded-xl p-6 shadow-sm border transition-all ${step === 2 ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 opacity-60'}`}>
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm ${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>2</span>
                            Ödeme Yöntemi
                        </h2>

                        {step === 2 && (
                            <div className="space-y-6 animate-fade-in">
                                {/* Payment Method Selection */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div
                                        className={`p-4 border rounded-lg cursor-pointer flex items-center ${paymentMethod === 'CreditCard' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200'}`}
                                        onClick={() => setPaymentMethod('CreditCard')}
                                    >
                                        <CreditCard className={`mr-3 ${paymentMethod === 'CreditCard' ? 'text-blue-600' : 'text-gray-400'}`} />
                                        <div>
                                            <div className="font-semibold">Kredi / Banka Kartı</div>
                                            <div className="text-xs text-gray-500">Güvenli 3D ödeme</div>
                                        </div>
                                    </div>
                                    {/* Additional methods can be added here */}
                                </div>

                                {/* Mock Credit Card Form */}
                                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                    <div className="mb-4 flex space-x-2">
                                        <div className="h-8 w-12 bg-white border rounded flex items-center justify-center"><span className="text-xs font-bold text-blue-800">VISA</span></div>
                                        <div className="h-8 w-12 bg-white border rounded flex items-center justify-center"><span className="text-xs font-bold text-red-600">MC</span></div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Kart Üzerindeki İsim</label>
                                            <input
                                                type="text"
                                                placeholder="Ad Soyad"
                                                className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                value={cardDetails.cardName}
                                                onChange={(e) => setCardDetails({ ...cardDetails, cardName: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Kart Numarası</label>
                                            <input
                                                type="text"
                                                placeholder="0000 0000 0000 0000"
                                                maxLength="19"
                                                className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-mono"
                                                value={cardDetails.cardNumber}
                                                onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Son Kul. Tarihi</label>
                                                <input
                                                    type="text"
                                                    placeholder="AA/YY"
                                                    maxLength="5"
                                                    className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-center"
                                                    value={cardDetails.expiryDate}
                                                    onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">CVC / CVV</label>
                                                <input
                                                    type="text"
                                                    placeholder="123"
                                                    maxLength="3"
                                                    className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-center"
                                                    value={cardDetails.cvv}
                                                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg flex justify-center items-center transition-all hover:scale-[1.01]"
                                >
                                    {loading ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            İşleniyor...
                                        </span>
                                    ) : (
                                        `Siparişi Onayla ve Öde (${cartTotal.toLocaleString('tr-TR')} ₺)`
                                    )}
                                </button>
                                <p className="text-xs text-center text-gray-500 mt-2">
                                    <Truck size={12} className="inline mr-1" />
                                    Siparişiniz kargo şubemize iletildikten sonra SMS ile bilgilendirileceksiniz.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar - Order Summary */}
                <div className="lg:w-1/3">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 sticky top-24">
                        <h3 className="text-lg font-bold mb-4 border-b pb-2">Sipariş Özeti</h3>
                        <div className="space-y-4 max-h-80 overflow-y-auto mb-4 custom-scrollbar pr-1">
                            {cartItems.map(item => (
                                <div key={item.productId} className="flex justify-between items-center text-sm group hover:bg-gray-50 p-2 rounded transition-colors">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0 mr-3 border border-gray-200">
                                            <img
                                                src={item.productImage || 'https://via.placeholder.com/50'}
                                                alt={item.productName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-800 line-clamp-1" title={item.productName}>{item.productName}</div>
                                            <div className="text-gray-500 text-xs">{item.quantity} adet</div>
                                        </div>
                                    </div>
                                    <span className="font-medium">{(item.price * item.quantity).toLocaleString('tr-TR')} ₺</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Ara Toplam</span>
                                <span>{cartTotal.toLocaleString('tr-TR')} ₺</span>
                            </div>
                            <div className="flex justify-between text-green-600 font-medium">
                                <span>Kargo</span>
                                <span className="flex items-center"><Truck size={14} className="mr-1" /> Ücretsiz</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>KDV Included (18%)</span>
                                <span>{(cartTotal * 0.18).toLocaleString('tr-TR')} ₺</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t mt-3">
                                <span>Toplam</span>
                                <span className="text-blue-600">{cartTotal.toLocaleString('tr-TR')} ₺</span>
                            </div>
                        </div>

                        {/* Security Badges */}
                        <div className="mt-6 pt-4 border-t flex justify-center space-x-4 opacity-70 grayscale hover:grayscale-0 transition-all">
                            <div className="flex flex-col items-center">
                                <div className="h-6 w-16 bg-gray-200 rounded mb-1"></div>
                                <span className="text-[10px] text-gray-400">SSL Secrued</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="h-6 w-16 bg-gray-200 rounded mb-1"></div>
                                <span className="text-[10px] text-gray-400">3D Secure</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Address Modal */}
            {isAddressModalOpen && (
                <AddressModal
                    onClose={handleAddressModalClose}
                />
            )}
        </div>
    );
};

export default CheckoutPage;
