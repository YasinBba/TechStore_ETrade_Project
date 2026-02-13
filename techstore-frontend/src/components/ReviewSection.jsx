import { useState, useEffect } from 'react';
import { MessageSquare, Star } from 'lucide-react';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ReviewSection = ({ productId }) => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [reviews, setReviews] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingReview, setEditingReview] = useState(null);

    useEffect(() => {
        loadReviews();
        loadSummary();
    }, [productId]);

    const loadReviews = async () => {
        try {
            const response = await reviewService.getProductReviews(productId);
            if (response.success) {
                setReviews(response.data || []);
            }
        } catch (error) {
            console.error('Load reviews error:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadSummary = async () => {
        try {
            const response = await reviewService.getProductReviewSummary(productId);
            if (response.success) {
                setSummary(response.data);
            }
        } catch (error) {
            console.error('Load summary error:', error);
        }
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        setEditingReview(null);
        loadReviews();
        loadSummary();
    };

    const handleEdit = (review) => {
        setEditingReview(review);
        setShowForm(true);
    };

    const handleDelete = async (reviewId) => {
        if (!confirm('Yorumunuzu silmek istediğinizden emin misiniz?')) return;

        try {
            const response = await reviewService.deleteReview(reviewId);
            if (response.success) {
                showToast('Yorum silindi', 'success');
                loadReviews();
                loadSummary();
            } else {
                showToast(response.message || 'Silme başarısız', 'error');
            }
        } catch (error) {
            console.error('Delete error:', error);
            showToast('Yorum silinirken hata oluştu', 'error');
        }
    };

    const userHasReviewed = user && reviews.some(r => r.userId === user.id);

    return (
        <div className="space-y-6">
            {/* Summary Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <MessageSquare className="text-indigo-600" />
                    Müşteri Yorumları
                </h2>

                {summary && summary.totalReviews > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Average Rating */}
                        <div className="text-center md:text-left">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="text-5xl font-bold text-gray-900">
                                    {summary.averageRating.toFixed(1)}
                                </div>
                                <div>
                                    <StarRating rating={Math.round(summary.averageRating)} size={24} />
                                    <p className="text-sm text-gray-600 mt-1">
                                        {summary.totalReviews} değerlendirme
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Rating Distribution */}
                        <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((rating) => {
                                const count = summary.ratingDistribution?.[rating] || 0;
                                const percentage = summary.totalReviews > 0
                                    ? (count / summary.totalReviews) * 100
                                    : 0;

                                return (
                                    <div key={rating} className="flex items-center gap-2">
                                        <span className="text-sm font-medium w-8">{rating} ⭐</span>
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-yellow-400 h-2 rounded-full transition-all"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-600 w-12 text-right">
                                            {count}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500">Henüz değerlendirme yok.</p>
                )}
            </div>

            {/* Write Review Button */}
            {user && !userHasReviewed && !showForm && (
                <button
                    onClick={() => setShowForm(true)}
                    className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                    ✍️ Yorum Yaz
                </button>
            )}

            {!user && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <p className="text-blue-800">
                        Yorum yapmak için <a href="/login" className="underline font-semibold">giriş yapın</a>
                    </p>
                </div>
            )}

            {/* Review Form */}
            {showForm && (
                <ReviewForm
                    productId={productId}
                    existingReview={editingReview}
                    onSuccess={handleFormSuccess}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingReview(null);
                    }}
                />
            )}

            {/* Reviews List */}
            <ReviewList
                reviews={reviews}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default ReviewSection;
