import React, { useEffect, useState } from 'react';
import { orderService } from '../../services/orderService';
import { Eye, CheckCircle, Clock, XCircle } from 'lucide-react';

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real scenario, this would call an admin endpoint to get *all* orders
        // Currently reusing orderService.getAll() which might be user-specific depending on backend implementation
        // For demo purposes, we assume it returns list of orders
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            // Mocking some admin data if backend restriction exists
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

    const handleStatusChange = async (id, newStatus) => {
        try {
            const result = await orderService.updateStatus(id, newStatus);
            if (result.success) {
                setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
                alert('Sipariş durumu güncellendi.');
            } else {
                alert('Güncelleme başarısız: ' + (result.message || 'Hata'));
            }
        } catch (error) {
            console.error('Update failed', error);
            alert('Güncelleme sırasında hata oluştu.');
        }
    };

    const statusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 font-orbitron">Sipariş Yönetimi</h2>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-sm uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Sipariş No</th>
                                <th className="px-6 py-4 hidden md:table-cell">Müşteri</th>
                                <th className="px-6 py-4 hidden lg:table-cell">Tarih</th>
                                <th className="px-6 py-4">Toplam</th>
                                <th className="px-6 py-4 text-center">Durum</th>
                                <th className="px-6 py-4 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-8">Yükleniyor...</td></tr>
                            ) : orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-mono font-medium text-gray-600">
                                            #{order.orderNumber}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-800 hidden md:table-cell">
                                            {order.userName || 'Misafir'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 hidden lg:table-cell">
                                            {new Date(order.orderDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-800">
                                            {order.totalAmount.toLocaleString('tr-TR')} ₺
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className={`text-xs font-medium px-2.5 py-1 rounded-full border-none focus:ring-0 cursor-pointer ${statusColor(order.status)}`}
                                            >
                                                <option value="Pending">Bekliyor</option>
                                                <option value="Completed">Tamamlandı</option>
                                                <option value="Cancelled">İptal Edildi</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-blue-500 hover:text-blue-700 font-medium text-sm flex items-center justify-end">
                                                <Eye size={18} className="mr-1" /> Detay
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-gray-500">Sipariş bulunamadı.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminOrdersPage;
