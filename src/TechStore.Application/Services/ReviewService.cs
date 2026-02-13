using AutoMapper;
using TechStore.Application.DTOs.Common;
using TechStore.Application.DTOs.Reviews;
using TechStore.Core.Entities;
using TechStore.Core.Interfaces.Repositories;

namespace TechStore.Application.Services;

public class ReviewService : IReviewService
{
    private readonly IReviewRepository _reviewRepository;
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;

    public ReviewService(
        IReviewRepository reviewRepository,
        IProductRepository productRepository,
        IMapper mapper)
    {
        _reviewRepository = reviewRepository;
        _productRepository = productRepository;
        _mapper = mapper;
    }

    public async Task<ApiResponse<IEnumerable<ReviewDto>>> GetProductReviewsAsync(int productId, bool approvedOnly = true)
    {
        var reviews = await _reviewRepository.GetByProductIdAsync(productId, approvedOnly);
        var reviewDtos = _mapper.Map<IEnumerable<ReviewDto>>(reviews);
        return ApiResponse<IEnumerable<ReviewDto>>.SuccessResult(reviewDtos);
    }

    public async Task<ApiResponse<ProductReviewSummaryDto>> GetProductReviewSummaryAsync(int productId)
    {
        var (averageRating, totalReviews, distribution) = await _reviewRepository.GetProductReviewSummaryAsync(productId);
        
        var summary = new ProductReviewSummaryDto
        {
            ProductId = productId,
            AverageRating = Math.Round(averageRating, 1),
            TotalReviews = totalReviews,
            RatingDistribution = distribution
        };

        return ApiResponse<ProductReviewSummaryDto>.SuccessResult(summary);
    }

    public async Task<ApiResponse<IEnumerable<ReviewDto>>> GetUserReviewsAsync(int userId)
    {
        var reviews = await _reviewRepository.GetByUserIdAsync(userId);
        var reviewDtos = _mapper.Map<IEnumerable<ReviewDto>>(reviews);
        return ApiResponse<IEnumerable<ReviewDto>>.SuccessResult(reviewDtos);
    }

    public async Task<ApiResponse<IEnumerable<ReviewDto>>> GetPendingReviewsAsync()
    {
        var reviews = await _reviewRepository.GetPendingReviewsAsync();
        var reviewDtos = _mapper.Map<IEnumerable<ReviewDto>>(reviews);
        return ApiResponse<IEnumerable<ReviewDto>>.SuccessResult(reviewDtos);
    }

    public async Task<ApiResponse<ReviewDto>> GetReviewByIdAsync(int id)
    {
        var review = await _reviewRepository.GetByIdWithDetailsAsync(id);
        if (review == null)
        {
            return ApiResponse<ReviewDto>.FailResult("Yorum bulunamadı");
        }

        var reviewDto = _mapper.Map<ReviewDto>(review);
        return ApiResponse<ReviewDto>.SuccessResult(reviewDto);
    }

    public async Task<ApiResponse<ReviewDto>> CreateReviewAsync(int userId, CreateReviewDto dto)
    {
        // Check if product exists
        var product = await _productRepository.GetByIdAsync(dto.ProductId);
        if (product == null)
        {
            return ApiResponse<ReviewDto>.FailResult("Ürün bulunamadı");
        }

        // Check if user already reviewed this product
        var hasReviewed = await _reviewRepository.UserHasReviewedProductAsync(userId, dto.ProductId);
        if (hasReviewed)
        {
            return ApiResponse<ReviewDto>.FailResult("Bu ürün için zaten yorum yapmışsınız");
        }

        // Validate rating
        if (dto.Rating < 1 || dto.Rating > 5)
        {
            return ApiResponse<ReviewDto>.FailResult("Puan 1-5 arasında olmalıdır");
        }

        var review = _mapper.Map<Review>(dto);
        review.UserId = userId;
        review.IsApproved = false; // Requires admin approval

        await _reviewRepository.AddAsync(review);

        var createdReview = await _reviewRepository.GetByIdWithDetailsAsync(review.Id);
        var reviewDto = _mapper.Map<ReviewDto>(createdReview);
        
        return ApiResponse<ReviewDto>.SuccessResult(reviewDto, "Yorum başarıyla oluşturuldu. Admin onayından sonra yayınlanacaktır.");
    }

    public async Task<ApiResponse<ReviewDto>> UpdateReviewAsync(int userId, int reviewId, UpdateReviewDto dto)
    {
        var review = await _reviewRepository.GetByIdAsync(reviewId);
        if (review == null)
        {
            return ApiResponse<ReviewDto>.FailResult("Yorum bulunamadı");
        }

        // Check ownership
        if (review.UserId != userId)
        {
            return ApiResponse<ReviewDto>.FailResult("Bu yorumu güncelleme yetkiniz yok");
        }

        // Validate rating
        if (dto.Rating < 1 || dto.Rating > 5)
        {
            return ApiResponse<ReviewDto>.FailResult("Puan 1-5 arasında olmalıdır");
        }

        review.Rating = dto.Rating;
        review.Title = dto.Title;
        review.Comment = dto.Comment;
        review.IsApproved = false; // Requires re-approval after edit

        await _reviewRepository.UpdateAsync(review);

        var updatedReview = await _reviewRepository.GetByIdWithDetailsAsync(reviewId);
        var reviewDto = _mapper.Map<ReviewDto>(updatedReview);
        
        return ApiResponse<ReviewDto>.SuccessResult(reviewDto, "Yorum başarıyla güncellendi");
    }

    public async Task<ApiResponse<bool>> DeleteReviewAsync(int userId, int reviewId)
    {
        var review = await _reviewRepository.GetByIdAsync(reviewId);
        if (review == null)
        {
            return ApiResponse<bool>.FailResult("Yorum bulunamadı");
        }

        // Check ownership
        if (review.UserId != userId)
        {
            return ApiResponse<bool>.FailResult("Bu yorumu silme yetkiniz yok");
        }

        await _reviewRepository.DeleteAsync(reviewId);
        return ApiResponse<bool>.SuccessResult(true, "Yorum başarıyla silindi");
    }

    public async Task<ApiResponse<bool>> ApproveReviewAsync(int reviewId)
    {
        var success = await _reviewRepository.ApproveReviewAsync(reviewId);
        if (!success)
        {
            return ApiResponse<bool>.FailResult("Yorum bulunamadı");
        }

        return ApiResponse<bool>.SuccessResult(true, "Yorum onaylandı");
    }

    public async Task<ApiResponse<bool>> MarkAsHelpfulAsync(int reviewId)
    {
        var success = await _reviewRepository.IncrementHelpfulCountAsync(reviewId);
        if (!success)
        {
            return ApiResponse<bool>.FailResult("Yorum bulunamadı");
        }

        return ApiResponse<bool>.SuccessResult(true, "Teşekkürler!");
    }
}
