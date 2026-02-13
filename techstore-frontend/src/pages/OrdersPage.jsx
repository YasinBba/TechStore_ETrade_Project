import React, { useEffect, useState } from 'react';
import { orderService } from '../services/orderService';
import { Package, Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const result = await orderService.getAll();
            if (result.success) {
                setOrders(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch orders', error);
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

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 font-orbitron">Sipariş Geçmişim</h1>

            {orders.length === 0 ? (
                <div className="min-h-[50vh] flex flex-col items-center justify-center text-center bg-gray-50 rounded-xl border border-dashed border-gray-300 p-8">
                    <div className="bg-white p-4 rounded-full shadow-sm mb-6">
                        <Package className="h-16 w-16 text-blue-200" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Henüz Siparişiniz Yok</h2>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                        Sipariş verdiğinizde tüm detayları burada görebileceksiniz.
                    </p>
                    <Link
                        to="/products"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg shadow-blue-500/30 transform hover:scale-105"
                    >
                        Alışverişe Başla
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row justify-between md:items-center">
                                <div className="flex flex-col md:flex-row md:space-x-8 space-y-2 md:space-y-0 text-sm text-gray-600">
                                    <div>
                                        <span className="block text-xs uppercase text-gray-500 font-bold">Sipariş Tarihi</span>
                                        <span className="font-medium flex items-center">
                                            <Calendar size={14} className="mr-1" />
                                            {new Date(order.orderDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-xs uppercase text-gray-500 font-bold">Toplam Tutar</span>
                                        <span className="font-medium text-gray-900">{order.totalAmount.toLocaleString('tr-TR')} ₺</span>
                                    </div>
                                    <div>
                                        <span className="block text-xs uppercase text-gray-500 font-bold">Durum</span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                            order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-4 md:mt-0 font-mono text-sm text-gray-500 flex items-center">
                                    #{order.orderNumber}
                                    <Link to={`/orders/${order.id}`} className="ml-4 text-blue-600 hover:text-blue-800 flex items-center font-sans font-semibold">
                                        Detaylar <ChevronRight size={16} />
                                    </Link>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex flex-col space-y-4">
                                    {order.items?.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                    <img
                                                        src={item.productImageUrl || 'https://via.placeholder.com/150'}
                                                        alt={item.productName}
                                                        className="h-full w-full object-cover object-center"
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <h4 className="text-sm font-medium text-gray-900">{item.productName}</h4>
                                                    <p className="mt-1 text-sm text-gray-500">{item.unitPrice} ₺ x {item.quantity}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
