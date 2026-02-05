import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { CreditCard, MapPin, Truck, CheckCircle } from 'lucide-react';

const CheckoutPage = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Success

    const [address, setAddress] = useState({
        title: 'Ev',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phoneNumber: '',
        city: '',
        district: '',
        fullAddress: ''
    });

    const handleAddressChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            // Prepare order data suitable for backend API
            const orderData = {
                items: cartItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.price
                })),
                shippingAddress: address,
                billingAddress: address, // Using same for now
                paymentMethod: 'CreditCard' // Placeholder
            };

            const result = await orderService.create(orderData);

            if (result.success) {
                clearCart();
                setStep(3);
            }
        } catch (error) {
            console.error('Order failed', error);
            alert('Sipariş oluşturulurken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0 && step !== 3) {
        navigate('/cart');
        return null;
    }

    if (step === 3) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <CheckCircle size={48} />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Siparişiniz Alındı!</h1>
                <p className="text-gray-600 mb-8">Siparişiniz başarıyla oluşturuldu. Sipariş detaylarını profilinizden takip edebilirsiniz.</p>
                <button
                    onClick={() => navigate('/products')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg"
                >
                    Alışverişe Devam Et
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 font-orbitron">Ödeme ve Sipariş</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-6">
                    {/* Step 1: Address */}
                    <div className={`bg-white rounded-xl p-6 shadow-sm border ${step === 1 ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'}`}>
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                            <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
                            Teslimat Adresi
                        </h2>

                        {step === 1 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text" name="title" placeholder="Adres Başlığı (Örn: Ev)"
                                    value={address.title} onChange={handleAddressChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                                <input
                                    type="text" name="phoneNumber" placeholder="Telefon Numarası"
                                    value={address.phoneNumber} onChange={handleAddressChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                                <input
                                    type="text" name="city" placeholder="Şehir"
                                    value={address.city} onChange={handleAddressChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                                <input
                                    type="text" name="district" placeholder="İlçe"
                                    value={address.district} onChange={handleAddressChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                                <textarea
                                    name="fullAddress" placeholder="Tam Adres"
                                    value={address.fullAddress} onChange={handleAddressChange}
                                    className="w-full px-4 py-2 border rounded-lg md:col-span-2 h-24"
                                ></textarea>

                                <button
                                    onClick={() => setStep(2)}
                                    className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg md:col-span-2 hover:bg-blue-700 transition"
                                    disabled={!address.fullAddress || !address.city}
                                >
                                    Devam Et
                                </button>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center text-gray-600 pl-11">
                                <p>{address.fullAddress}, {address.district}/{address.city}</p>
                                <button onClick={() => setStep(1)} className="text-blue-600 text-sm font-semibold underline">Düzenle</button>
                            </div>
                        )}
                    </div>

                    {/* Step 2: Payment */}
                    <div className={`bg-white rounded-xl p-6 shadow-sm border ${step === 2 ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'}`}>
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm ${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>2</span>
                            Ödeme Yöntemi
                        </h2>

                        {step === 2 && (
                            <div className="space-y-4">
                                <div className="border border-blue-500 bg-blue-50 p-4 rounded-lg flex items-center cursor-pointer">
                                    <CreditCard className="text-blue-600 mr-4" size={24} />
                                    <div>
                                        <h3 className="font-bold text-gray-800">Kredi / Banka Kartı</h3>
                                        <p className="text-sm text-gray-500">Güvenli ödeme altyapısı ile öde</p>
                                    </div>
                                    <div className="ml-auto w-4 h-4 rounded-full border-4 border-blue-600"></div>
                                </div>

                                <div className="bg-gray-100 p-6 rounded-lg text-center text-gray-500 text-sm border border-dashed border-gray-300">
                                    Kart bilgileri formu burada yer alacak (Örn: Iyzico / Stripe Frame)
                                </div>

                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg flex justify-center items-center"
                                >
                                    {loading ? 'İşleniyor...' : `Siparişi Tamamla (${cartTotal.toLocaleString('tr-TR')} ₺)`}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:w-1/3">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 sticky top-24">
                        <h3 className="text-lg font-bold mb-4 border-b pb-2">Sipariş Özeti</h3>
                        <div className="space-y-4 max-h-60 overflow-y-auto mb-4">
                            {cartItems.map(item => (
                                <div key={item.productId} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center">
                                        <span className="font-bold w-6">{item.quantity}x</span>
                                        <span className="truncate max-w-[150px]">{item.productName}</span>
                                    </div>
                                    <span className="font-medium">{(item.price * item.quantity).toLocaleString('tr-TR')} ₺</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Ara Toplam</span>
                                <span>{cartTotal.toLocaleString('tr-TR')} ₺</span>
                            </div>
                            <div className="flex justify-between text-green-600 font-medium">
                                <span>Kargo</span>
                                <span>Bedava</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-gray-900 pt-2">
                                <span>Toplam</span>
                                <span>{cartTotal.toLocaleString('tr-TR')} ₺</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
