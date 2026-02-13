namespace TechStore.Application.DTOs.Reviews;

public class ReviewDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string? Title { get; set; }
    public string? Comment { get; set; }
    public List<string> Images { get; set; } = new();
    public bool IsApproved { get; set; }
    public int HelpfulCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateReviewDto
{
    public int ProductId { get; set; }
    public int Rating { get; set; }
    public string? Title { get; set; }
    public string Comment { get; set; } = string.Empty;
    public List<string> Images { get; set; } = new();
}

public class UpdateReviewDto
{
    public int Rating { get; set; }
    public string? Title { get; set; }
    public string Comment { get; set; } = string.Empty;
}

public class ProductReviewSummaryDto
{
    public int ProductId { get; set; }
    public double AverageRating { get; set; }
    public int TotalReviews { get; set; }
    public Dictionary<int, int> RatingDistribution { get; set; } = new();
    // RatingDistribution: { 5: 15, 4: 8, 3: 3, 2: 1, 1: 0 }
}
