using TechStore.Core.Entities;

namespace TechStore.Core.Interfaces.Repositories;

public interface IReviewRepository : IRepository<Review>
{
    Task<IEnumerable<Review>> GetByProductIdAsync(int productId, bool approvedOnly = true);
    Task<IEnumerable<Review>> GetByUserIdAsync(int userId);
    Task<IEnumerable<Review>> GetPendingReviewsAsync();
    Task<Review?> GetByIdWithDetailsAsync(int id);
    Task<bool> ApproveReviewAsync(int id);
    Task<bool> IncrementHelpfulCountAsync(int id);
    Task<bool> UserHasReviewedProductAsync(int userId, int productId);
    Task<(double averageRating, int totalReviews, Dictionary<int, int> distribution)> GetProductReviewSummaryAsync(int productId);
}
