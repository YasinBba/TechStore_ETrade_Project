import { ThumbsUp, Trash2, Edit2 } from 'lucide-react';
import { useState } from 'react';
import StarRating from './StarRating';
import { useAuth } from '../context/AuthContext';
import { reviewService } from '../services/reviewService';
import { useToast } from '../context/ToastContext';

const ReviewCard = ({ review, onDelete, onEdit, onUpdate }) => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount);
    const [helpfulLoading, setHelpfulLoading] = useState(false);

    const isOwner = user && user.id === review.userId;

    const handleHelpful = async () => {
        if (helpfulLoading) return;

        setHelpfulLoading(true);
        try {
            const response = await reviewService.markAsHelpful(review.id);
            if (response.success) {
                setHelpfulCount(prev => prev + 1);
                showToast('Teşekkürler!', 'success');
            }
        } catch (error) {
            console.error('Helpful error:', error);
            showToast('Bir hata oluştu', 'error');
        } finally {
            setHelpfulLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        {/* User Avatar */}
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-semibold text-sm">
                                {review.userName?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900">{review.userName || 'Anonim'}</h4>
                            <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                        </div>
                    </div>
                    <StarRating rating={review.rating} size={18} />
                </div>

                {/* Owner Actions */}
                {isOwner && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit && onEdit(review)}
                            className="text-gray-400 hover:text-indigo-600 transition-colors"
                            title="Düzenle"
                        >
                            <Edit2 size={18} />
                        </button>
                        <button
                            onClick={() => onDelete && onDelete(review.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            title="Sil"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                )}
            </div>

            {/* Title */}
            {review.title && (
                <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
            )}

            {/* Comment */}
            <p className="text-gray-700 mb-4 whitespace-pre-line">{review.comment}</p>

            {/* Images */}
            {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mb-4 overflow-x-auto">
                    {review.images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Review ${index + 1}`}
                            className="h-24 w-24 object-cover rounded-md border border-gray-200"
                        />
                    ))}
                </div>
            )}

            {/* Footer - Helpful */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <button
                    onClick={handleHelpful}
                    disabled={helpfulLoading}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors disabled:opacity-50"
                >
                    <ThumbsUp size={16} />
                    <span>Faydalı</span>
                    {helpfulCount > 0 && (
                        <span className="text-gray-500">({helpfulCount})</span>
                    )}
                </button>

                {!review.isApproved && isOwner && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Onay Bekliyor
                    </span>
                )}
            </div>
        </div>
    );
};

export default ReviewCard;
