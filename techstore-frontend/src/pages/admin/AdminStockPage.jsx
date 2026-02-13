import React, { useEffect, useState } from 'react';
import { stockService } from '../../services/stockService';
import { AlertTriangle, TrendingDown, History, Save } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const AdminStockPage = () => {
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    // Quick update state
    const [updateStockId, setUpdateStockId] = useState(null);
    const [newStockValue, setNewStockValue] = useState('');

    useEffect(() => {
        fetchLowStock();
    }, []);

    const fetchLowStock = async () => {
        setLoading(true);
        const result = await stockService.getLowStock();
        if (result.success) {
            setLowStockProducts(result.data);
        }
        setLoading(false);
    };

    const fetchHistory = async (productId) => {
        setHistoryLoading(true);
        const result = await stockService.getHistory(productId);
        if (result.success) {
            setHistory(result.data);
        }
        setHistoryLoading(false);
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        fetchHistory(product.id);
    };

    const handleUpdateStock = async (productId) => {
        if (!newStockValue) return;

        const result = await stockService.updateStock(productId, parseInt(newStockValue), "Manual Adjustment");
        if (result.success) {
            showToast('Stok güncellendi', 'success');
            setUpdateStockId(null);
            setNewStockValue('');
            fetchLowStock(); // Refresh list
            if (selectedProduct && selectedProduct.id === productId) {
                fetchHistory(productId); // Refresh history if selected
            }
        } else {
            showToast(result.message || 'Hata oluştu', 'error');
        }
    };

    return (
        <div className="flex gap-6 h-[calc(100vh-100px)]">
            {/* Left Panel: Low Stock List */}
            <div className="w-full lg:w-2/3 flex flex-col">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 font-orbitron flex items-center">
                    <AlertTriangle className="text-red-500 mr-2" />
                    Kritik Stok Takibi
                </h2>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
                    <div className="overflow-auto flex-1 p-4">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-sm uppercase font-semibold sticky top-0">
                                <tr>
                                    <th className="px-6 py-3">Ürün</th>
                                    <th className="px-6 py-3 text-center">Mevcut Stok</th>
                                    <th className="px-6 py-3 text-right">Hızlı Güncelle</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan="3" className="text-center py-8">Yükleniyor...</td></tr>
                                ) : lowStockProducts.length > 0 ? (
                                    lowStockProducts.map((product) => (
                                        <tr
                                            key={product.id}
                                            className={`hover:bg-blue-50 cursor-pointer transition-colors ${selectedProduct?.id === product.id ? 'bg-blue-50' : ''}`}
                                            onClick={() => handleProductClick(product)}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{product.name}</div>
                                                <div className="text-xs text-gray-500">ID: {product.id}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-bold ${product.stock === 0 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                {updateStockId === product.id ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <input
                                                            type="number"
                                                            className="w-20 text-sm border rounded p-1"
                                                            value={newStockValue}
                                                            onChange={(e) => setNewStockValue(e.target.value)}
                                                            autoFocus
                                                        />
                                                        <button
                                                            onClick={() => handleUpdateStock(product.id)}
                                                            className="bg-green-600 text-white p-1 rounded hover:bg-green-700"
                                                        >
                                                            <Save size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => setUpdateStockId(null)}
                                                            className="bg-gray-300 text-gray-700 p-1 rounded hover:bg-gray-400"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => { setUpdateStockId(product.id); setNewStockValue(product.stock); }}
                                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                    >
                                                        Stok Ekle
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center py-8 text-gray-500">
                                            Kritik stok seviyesinde ürün yok. Harika! 🎉
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Right Panel: Stock History */}
            <div className="hidden lg:flex w-1/3 flex-col">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 font-orbitron flex items-center">
                    <History className="text-blue-500 mr-2" />
                    Stok Geçmişi
                </h2>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col p-4">
                    {selectedProduct ? (
                        <>
                            <div className="mb-4 border-b border-gray-100 pb-4">
                                <h3 className="font-bold text-lg">{selectedProduct.name}</h3>
                                <p className="text-sm text-gray-500">Stok Hareketleri</p>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                                {historyLoading ? (
                                    <p className="text-center text-gray-500">Geçmiş yükleniyor...</p>
                                ) : history.length > 0 ? (
                                    history.map((record) => (
                                        <div key={record.id} className="flex justify-between items-start text-sm border-l-2 border-gray-200 pl-3 py-1">
                                            <div>
                                                <p className="font-medium text-gray-800">{record.reason}</p>
                                                <p className="text-xs text-gray-400">
                                                    {new Date(record.createdAt).toLocaleString()}
                                                </p>
                                                {/* <p className="text-xs text-gray-400">Yapan: {record.createdBy}</p> */}
                                            </div>
                                            <div className="text-right">
                                                <span className={`font-bold ${record.changeAmount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {record.changeAmount > 0 ? '+' : ''}{record.changeAmount}
                                                </span>
                                                <div className="text-xs text-gray-500">
                                                    {record.oldStock} ➔ {record.newStock}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 text-sm">Henüz kayıt yok.</p>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <TrendingDown size={48} className="mb-4 opacity-50" />
                            <p className="text-center">Geçmişini görüntülemek için<br />listeden bir ürün seçin.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminStockPage;
