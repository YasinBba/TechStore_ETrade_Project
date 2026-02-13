import { useEffect, useState } from 'react';
import { Check, X, Eye, Loader2 } from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import { useToast } from '../../context/ToastContext';
import StarRating from '../../components/StarRating';

const AdminReviewsPage = () => {
    const { showToast } = useToast();
    const [pendingReviews, setPendingReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        loadPendingReviews();
    }, []);

    const loadPendingReviews = async () => {
        try {
            setLoading(true);
            const response = await reviewService.getPendingReviews();
            if (response.success) {
                setPendingReviews(response.data || []);
            }
        } catch (error) {
            console.error('Load pending reviews error:', error);
            showToast('Yorumlar yüklenemedi', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (reviewId) => {
        if (!confirm('Bu yorumu onaylamak istediğinizden emin misiniz?')) return;

        setProcessingId(reviewId);
        try {
            const response = await reviewService.approveReview(reviewId);
            if (response.success) {
                showToast('Yorum onaylandı', 'success');
                setPendingReviews(prev => prev.filter(r => r.id !== reviewId));
            } else {
                showToast(response.message || 'Onaylama başarısız', 'error');
            }
        } catch (error) {
            console.error('Approve error:', error);
            showToast('Yorum onaylanırken hata oluştu', 'error');
        } finally {
            setProcessingId(null);
        }
    };

    const handleDelete = async (reviewId) => {
        if (!confirm('Bu yorumu silmek istediğinizden emin misiniz?')) return;

        setProcessingId(reviewId);
        try {
            const response = await reviewService.deleteReview(reviewId);
            if (response.success) {
                showToast('Yorum silindi', 'success');
                setPendingReviews(prev => prev.filter(r => r.id !== reviewId));
            } else {
                showToast(response.message || 'Silme başarısız', 'error');
            }
        } catch (error) {
            console.error('Delete error:', error);
            showToast('Yorum silinirken hata oluştu', 'error');
        } finally {
            setProcessingId(null);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin text-indigo-600" size={48} />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Yorum Yönetimi</h1>
                <p className="text-gray-600 mt-2">Onay bekleyen yorumları yönetin</p>
            </div>

            {pendingReviews.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        Tüm yorumlar onaylandı!
                    </h2>
                    <p className="text-gray-600">Onay bekleyen yorum bulunmuyor.</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ürün
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kullanıcı
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Puan
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Yorum
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tarih
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        İşlemler
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {pendingReviews.map((review) => (
                                    <tr key={review.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {review.productName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{review.userName}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StarRating rating={review.rating} size={16} />
                                        </td>
                                        <td className="px-6 py-4 max-w-md">
                                            {review.title && (
                                                <div className="text-sm font-semibold text-gray-900 mb-1">
                                                    {review.title}
                                                </div>
                                            )}
                                            <div className="text-sm text-gray-600 line-clamp-2">
                                                {review.comment}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                                {formatDate(review.createdAt)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleApprove(review.id)}
                                                    disabled={processingId === review.id}
                                                    className="text-green-600 hover:text-green-800 disabled:opacity-50"
                                                    title="Onayla"
                                                >
                                                    <Check size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(review.id)}
                                                    disabled={processingId === review.id}
                                                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                                                    title="Sil"
                                                >
                                                    <X size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                            Toplam <span className="font-semibold">{pendingReviews.length}</span> yorum onay bekliyor
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReviewsPage;
