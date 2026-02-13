import React, { useEffect, useState } from 'react';
import { Users, DollarSign, ShoppingBag, Package, TrendingUp } from 'lucide-react';
import { dashboardService } from '../../services/dashboardService';
import { useToast } from '../../context/ToastContext';

const AdminDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        const result = await dashboardService.getSummary();
        if (result.success) {
            setStats(result.data);
        } else {
            showToast('Dashboard verileri yüklenemedi', 'error');
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!stats) return null;

    const statCards = [
        { title: 'Toplam Gelir', value: `${stats.totalRevenue.toLocaleString('tr-TR')} ₺`, icon: DollarSign, color: 'bg-green-500', shadow: 'shadow-green-500/30' },
        { title: 'Toplam Sipariş', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-blue-500', shadow: 'shadow-blue-500/30' },
        { title: 'Toplam Ürün', value: stats.totalProducts, icon: Package, color: 'bg-purple-500', shadow: 'shadow-purple-500/30' },
        { title: 'Kullanıcılar', value: stats.totalUsers, icon: Users, color: 'bg-orange-500', shadow: 'shadow-orange-500/30' },
    ];

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8 font-orbitron">Yönetim Paneli</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center hover:shadow-md transition-shadow">
                        <div className={`${stat.color} p-4 rounded-full text-white mr-4 shadow-lg ${stat.shadow}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Son Siparişler</h3>
                        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">Tümünü Gör</button>
                    </div>
                    <div className="space-y-4">
                        {stats.recentOrders.length > 0 ? (
                            stats.recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-gray-800">#{order.orderNumber}</p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">{order.customerName} • {new Date(order.orderDate).toLocaleDateString()}</p>
                                    </div>
                                    <span className="text-gray-900 font-bold">{order.totalAmount.toLocaleString('tr-TR')} ₺</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">Henüz sipariş yok.</p>
                        )}
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Popüler Ürünler</h3>
                        <TrendingUp size={20} className="text-gray-400" />
                    </div>
                    <div className="space-y-4">
                        {stats.topProducts.length > 0 ? (
                            stats.topProducts.map((product, index) => (
                                <div key={product.id} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3 text-sm">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{product.name}</p>
                                            <p className="text-sm text-gray-500">{product.price.toLocaleString('tr-TR')} ₺</p>
                                        </div>
                                    </div>
                                    {/* <span className="text-blue-600 font-medium">{product.soldCount} satış</span> */}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">Veri yok.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
