const SkeletonProductCard = () => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            {/* Image Skeleton */}
            <div className="w-full h-64 bg-gray-200"></div>

            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
                {/* Category */}
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>

                {/* Title */}
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>

                {/* Rating */}
                <div className="flex items-center gap-2 pt-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between pt-2">
                    <div className="h-6 bg-gray-300 rounded w-24"></div>
                    <div className="h-10 bg-gray-200 rounded w-20"></div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonProductCard;
