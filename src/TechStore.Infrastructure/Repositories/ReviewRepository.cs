using Microsoft.EntityFrameworkCore;
using TechStore.Core.Entities;
using TechStore.Core.Interfaces.Repositories;
using TechStore.Infrastructure.Data;

namespace TechStore.Infrastructure.Repositories;

public class ReviewRepository : Repository<Review>, IReviewRepository
{
    public ReviewRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Review>> GetByProductIdAsync(int productId, bool approvedOnly = true)
    {
        var query = _context.Reviews
            .Include(r => r.User)
            .Where(r => r.ProductId == productId);

        if (approvedOnly)
        {
            query = query.Where(r => r.IsApproved);
        }

        return await query
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Review>> GetByUserIdAsync(int userId)
    {
        return await _context.Reviews
            .Include(r => r.Product)
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Review>> GetPendingReviewsAsync()
    {
        return await _context.Reviews
            .Include(r => r.User)
            .Include(r => r.Product)
            .Where(r => !r.IsApproved)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<Review?> GetByIdWithDetailsAsync(int id)
    {
        return await _context.Reviews
            .Include(r => r.User)
            .Include(r => r.Product)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<bool> ApproveReviewAsync(int id)
    {
        var review = await _context.Reviews.FindAsync(id);
        if (review == null) return false;

        review.IsApproved = true;
        review.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> IncrementHelpfulCountAsync(int id)
    {
        var review = await _context.Reviews.FindAsync(id);
        if (review == null) return false;

        review.HelpfulCount++;
        review.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UserHasReviewedProductAsync(int userId, int productId)
    {
        return await _context.Reviews
            .AnyAsync(r => r.UserId == userId && r.ProductId == productId);
    }

    public async Task<(double averageRating, int totalReviews, Dictionary<int, int> distribution)> GetProductReviewSummaryAsync(int productId)
    {
        var reviews = await _context.Reviews
            .Where(r => r.ProductId == productId && r.IsApproved)
            .ToListAsync();

        if (!reviews.Any())
        {
            return (0, 0, new Dictionary<int, int>());
        }

        var averageRating = reviews.Average(r => r.Rating);
        var totalReviews = reviews.Count;
        
        var distribution = new Dictionary<int, int>
        {
            { 5, reviews.Count(r => r.Rating == 5) },
            { 4, reviews.Count(r => r.Rating == 4) },
            { 3, reviews.Count(r => r.Rating == 3) },
            { 2, reviews.Count(r => r.Rating == 2) },
            { 1, reviews.Count(r => r.Rating == 1) }
        };

        return (averageRating, totalReviews, distribution);
    }
}
