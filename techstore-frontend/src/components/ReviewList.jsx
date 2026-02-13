import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import ReviewCard from './ReviewCard';
import SkeletonReviewCard from './SkeletonReviewCard';

const ReviewList = ({ reviews, loading, onDelete, onEdit, onUpdate }) => {
    const [filter, setFilter] = useState('all'); // all, 5, 4, 3, 2, 1

    const filteredReviews = filter === 'all'
        ? reviews
        : reviews.filter(r => r.rating === parseInt(filter));

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(n => (
                    <SkeletonReviewCard key={n} />
                ))}
            </div>
        );
    }

    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-lg">Henüz yorum yapılmamış.</p>
                <p className="text-gray-400 text-sm mt-2">İlk yorum yapan siz olun! 🌟</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${filter === 'all'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    Tümü ({reviews.length})
                </button>
                {[5, 4, 3, 2, 1].map((rating) => {
                    const count = reviews.filter(r => r.rating === rating).length;
                    if (count === 0) return null;
                    return (
                        <button
                            key={rating}
                            onClick={() => setFilter(rating.toString())}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${filter === rating.toString()
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {rating} ⭐ ({count})
                        </button>
                    );
                })}
            </div>

            {/* Reviews */}
            <div className="space-y-4">
                {filteredReviews.map((review) => (
                    <ReviewCard
                        key={review.id}
                        review={review}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        onUpdate={onUpdate}
                    />
                ))}
            </div>

            {/* No results after filter */}
            {filteredReviews.length === 0 && reviews.length > 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Bu filtrede yorum bulunamadı.</p>
                </div>
            )}
        </div>
    );
};

export default ReviewList;
