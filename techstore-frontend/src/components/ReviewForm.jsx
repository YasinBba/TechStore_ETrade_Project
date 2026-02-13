import { useState } from 'react';
import { X } from 'lucide-react';
import StarRating from './StarRating';
import { useToast } from '../context/ToastContext';
import { reviewService } from '../services/reviewService';

const ReviewForm = ({ productId, existingReview = null, onSuccess, onCancel }) => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        rating: existingReview?.rating || 0,
        title: existingReview?.title || '',
        comment: existingReview?.comment || ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.rating === 0) {
            showToast('Lütfen bir puan seçin', 'error');
            return;
        }

        if (!formData.comment.trim()) {
            showToast('Lütfen yorum yazın', 'error');
            return;
        }

        setLoading(true);
        try {
            let response;
            if (existingReview) {
                response = await reviewService.updateReview(existingReview.id, {
                    rating: formData.rating,
                    title: formData.title,
                    comment: formData.comment
                });
            } else {
                response = await reviewService.createReview({
                    productId,
                    rating: formData.rating,
                    title: formData.title,
                    comment: formData.comment,
                    images: []
                });
            }

            if (response.success) {
                showToast(response.message || 'Yorum başarıyla kaydedildi', 'success');
                if (onSuccess) onSuccess();
            } else {
                showToast(response.message || 'Bir hata oluştu', 'error');
            }
        } catch (error) {
            console.error('Review submit error:', error);
            showToast('Yorum gönderilirken hata oluştu', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                    {existingReview ? 'Yorumunuzu Düzenleyin' : 'Ürünü Değerlendirin'}
                </h3>
                {onCancel && (
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={24} />
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Puanınız <span className="text-red-500">*</span>
                        </label>
                        <StarRating
                            rating={formData.rating}
                            onRatingChange={(rating) => setFormData({ ...formData, rating })}
                            interactive
                            size={32}
                        />
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Başlık (Opsiyonel)
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Örn: Harika bir ürün!"
                            maxLength={100}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Comment */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Yorumunuz <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={formData.comment}
                            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                            placeholder="Ürün hakkındaki düşüncelerinizi paylaşın..."
                            rows={5}
                            maxLength={1000}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <div className="text-sm text-gray-500 text-right mt-1">
                            {formData.comment.length}/1000
                        </div>
                    </div>

                    {/* Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800">
                        ℹ️ Yorumunuz admin onayından sonra yayınlanacaktır.
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-3">
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                İptal
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
                        >
                            {loading ? 'Gönderiliyor...' : (existingReview ? 'Güncelle' : 'Gönder')}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;
