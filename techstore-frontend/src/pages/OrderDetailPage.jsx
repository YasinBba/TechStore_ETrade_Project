import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, CreditCard, XCircle } from 'lucide-react';
import AddressCard from '../components/AddressCard';

const OrderDetailPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrderDetail();
    }, [id]);

    const fetchOrderDetail = async () => {
        try {
            setLoading(true);
            const result = await orderService.getById(id);
            if (result.success) {
                setOrder(result.data);
            } else {
                setError(result.message || 'Sipariş detayları alınamadı');
            }
        } catch (err) {
            console.error('Error fetching order details:', err);
            setError('Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block mb-4">
                    {error || 'Sipariş bulunamadı'}
                </div>
                <br />
                <Link to="/profile?tab=orders" className="text-blue-600 hover:underline flex items-center justify-center">
                    <ArrowLeft size={16} className="mr-1" /> Siparişlerime Dön
                </Link>
            </div>
        );
    }

    // Status Timeline Logic
    const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const currentStatusIndex = statuses.indexOf(order.status) === -1 ? 0 : statuses.indexOf(order.status);
    const isCancelled = order.status === 'Cancelled';

    const getStatusLabel = (status) => {
        switch (status) {
            case 'Pending': return 'Sipariş Alındı';
            case 'Processing': return 'Hazırlanıyor';
            case 'Shipped': return 'Kargoya Verildi';
            case 'Delivered': return 'Teslim Edildi';
            case 'Cancelled': return 'İptal Edildi';
            default: return status;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link to="/profile?tab=orders" className="text-gray-500 hover:text-blue-600 flex items-center transition-colors">
                    <ArrowLeft size={18} className="mr-1" /> Sipariş Listesine Dön
                </Link>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-orbitron mb-2">Sipariş Detayı</h1>
                    <p className="text-gray-600">
                        Sipariş No: <span className="font-mono font-medium text-gray-900">#{order.orderNumber}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                        {new Date(order.orderDate).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
                {isCancelled && (
                    <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg font-bold flex items-center mt-4 md:mt-0">
                        <XCircle size={20} className="mr-2" />
                        Sipariş İptal Edildi
                    </div>
                )}
            </div>

            {/* Status Timeline */}
            {!isCancelled && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8 overflow-x-auto">
                    <div className="min-w-[600px]">
                        <div className="relative flex justify-between items-center mb-2">
                            {/* Connector Line */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-0 rounded"></div>
                            <div
                                className="absolute top-1/2 left-0 h-1 bg-green-500 -z-0 rounded transition-all duration-1000"
                                style={{ width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}
                            ></div>

                            {statuses.map((status, index) => {
                                const isCompleted = index <= currentStatusIndex;
                                const isCurrent = index === currentStatusIndex;

                                return (
                                    <div key={status} className="relative z-10 flex flex-col items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-200 text-gray-400'
                                            }`}>
                                            {index === 0 && <Clock size={18} />}
                                            {index === 1 && <Package size={18} />}
                                            {index === 2 && <Truck size={18} />}
                                            {index === 3 && <CheckCircle size={18} />}
                                        </div>
                                        <div className={`mt-3 text-sm font-medium ${isCurrent ? 'text-blue-600 font-bold' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                                            {getStatusLabel(status)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Order Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 font-semibold text-gray-700">
                            Sipariş İçeriği ({order.items?.length || 0} Ürün)
                        </div>
                        <div className="divide-y divide-gray-100">
                            {order.items?.map((item, idx) => (
                                <div key={idx} className="p-6 flex items-center">
                                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white">
                                        <img
                                            src={item.productImageUrl || 'https://via.placeholder.com/150'}
                                            alt={item.productName}
                                            className="h-full w-full object-contain object-center"
                                        />
                                    </div>
                                    <div className="ml-6 flex-1 flex flex-col sm:flex-row sm:justify-between">
                                        <div>
                                            <h3 className="text-base font-medium text-gray-900">
                                                <Link to={`/product/${item.productId}`} className="hover:text-blue-600 transition-colors">
                                                    {item.productName}
                                                </Link>
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500">{item.quantity} Adet</p>
                                        </div>
                                        <div className="mt-2 sm:mt-0 text-right">
                                            <p className="text-base font-medium text-gray-900">{(item.unitPrice * item.quantity).toLocaleString('tr-TR')} ₺</p>
                                            <p className="text-sm text-gray-500">Birim: {item.unitPrice.toLocaleString('tr-TR')} ₺</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Summary */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold mb-4 border-b pb-2">Özet</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Ara Toplam</span>
                                <span>{order.subTotal.toLocaleString('tr-TR')} ₺</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Kargo</span>
                                <span>{order.shippingCost === 0 ? 'Ücretsiz' : `${order.shippingCost.toLocaleString('tr-TR')} ₺`}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Vergi</span>
                                <span>{order.tax.toLocaleString('tr-TR')} ₺</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>İndirim</span>
                                    <span>-{order.discount.toLocaleString('tr-TR')} ₺</span>
                                </div>
                            )}
                            <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t mt-3">
                                <span>Genel Toplam</span>
                                <span className="text-blue-600">{order.totalAmount.toLocaleString('tr-TR')} ₺</span>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold mb-4 border-b pb-2 flex items-center">
                            <MapPin size={18} className="mr-2" />
                            Teslimat Adresi
                        </h3>
                        {order.shippingAddress ? (
                            <div className="text-sm text-gray-600">
                                <p className="font-semibold text-gray-800 mb-1">{order.shippingAddress.title}</p>
                                <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                                <p className="mt-1">{order.shippingAddress.addressLine1}</p>
                                <p>{order.shippingAddress.district}/{order.shippingAddress.city}</p>
                                <p className="mt-2">{order.shippingAddress.phone}</p>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 italic">Adres bilgisi bulunamadı.</p>
                        )}
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold mb-4 border-b pb-2 flex items-center">
                            <CreditCard size={18} className="mr-2" />
                            Ödeme Bilgileri
                        </h3>
                        <div className="text-sm text-gray-600">
                            <p className="mb-1"><span className="font-semibold">Yöntem:</span> {order.paymentMethod === 'CreditCard' ? 'Kredi / Banka Kartı' : order.paymentMethod}</p>
                            <p><span className="font-semibold">Durum:</span> {order.paymentStatus === 'Paid' || order.status !== 'Pending' ? 'Ödendi' : 'Beklemede'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
