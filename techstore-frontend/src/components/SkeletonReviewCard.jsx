const SkeletonReviewCard = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
                {/* Avatar */}
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>

                <div className="flex-1 space-y-2">
                    {/* Name */}
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    {/* Date */}
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                    {/* Stars */}
                    <div className="h-4 bg-gray-200 rounded w-28 mt-2"></div>
                </div>
            </div>

            {/* Title */}
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>

            {/* Comment */}
            <div className="space-y-2 mb-4">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
        </div>
    );
};

export default SkeletonReviewCard;
