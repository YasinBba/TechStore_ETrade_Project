namespace TechStore.Application.DTOs.Products;

public class ProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string SKU { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? OldPrice { get; set; }
    public int StockQuantity { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public int? BrandId { get; set; }
    public string? BrandName { get; set; }
    public bool IsActive { get; set; }
    public bool IsFeatured { get; set; }
    public decimal AverageRating { get; set; }
    public int ReviewCount { get; set; }
    public List<ProductImageDto> Images { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

public class ProductImageDto
{
    public int Id { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? AltText { get; set; }
    public bool IsPrimary { get; set; }
}
