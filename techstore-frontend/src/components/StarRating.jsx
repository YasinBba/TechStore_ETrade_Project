import { Star } from 'lucide-react';
import { useState } from 'react';

const StarRating = ({ rating = 0, onRatingChange, interactive = false, size = 24, showCount = false, count = 0 }) => {
    const [hoverRating, setHoverRating] = useState(0);

    const handleClick = (value) => {
        if (interactive && onRatingChange) {
            onRatingChange(value);
        }
    };

    const handleMouseEnter = (value) => {
        if (interactive) {
            setHoverRating(value);
        }
    };

    const handleMouseLeave = () => {
        if (interactive) {
            setHoverRating(0);
        }
    };

    const displayRating = interactive ? (hoverRating || rating) : rating;

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => handleClick(star)}
                    onMouseEnter={() => handleMouseEnter(star)}
                    onMouseLeave={handleMouseLeave}
                    disabled={!interactive}
                    className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
                >
                    <Star
                        size={size}
                        className={`${star <= displayRating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-200 text-gray-300'
                            } transition-colors`}
                    />
                </button>
            ))}
            {showCount && count > 0 && (
                <span className="text-sm text-gray-600 ml-2">
                    ({count})
                </span>
            )}
        </div>
    );
};

export default StarRating;
