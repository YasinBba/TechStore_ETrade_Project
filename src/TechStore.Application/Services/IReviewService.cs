using TechStore.Application.DTOs.Common;
using TechStore.Application.DTOs.Reviews;

namespace TechStore.Application.Services;

public interface IReviewService
{
    Task<ApiResponse<IEnumerable<ReviewDto>>> GetProductReviewsAsync(int productId, bool approvedOnly = true);
    Task<ApiResponse<ProductReviewSummaryDto>> GetProductReviewSummaryAsync(int productId);
    Task<ApiResponse<IEnumerable<ReviewDto>>> GetUserReviewsAsync(int userId);
    Task<ApiResponse<IEnumerable<ReviewDto>>> GetPendingReviewsAsync();
    Task<ApiResponse<ReviewDto>> GetReviewByIdAsync(int id);
    Task<ApiResponse<ReviewDto>> CreateReviewAsync(int userId, CreateReviewDto dto);
    Task<ApiResponse<ReviewDto>> UpdateReviewAsync(int userId, int reviewId, UpdateReviewDto dto);
    Task<ApiResponse<bool>> DeleteReviewAsync(int userId, int reviewId);
    Task<ApiResponse<bool>> ApproveReviewAsync(int reviewId);
    Task<ApiResponse<bool>> MarkAsHelpfulAsync(int reviewId);
}
