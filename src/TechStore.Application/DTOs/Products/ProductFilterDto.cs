namespace TechStore.Application.DTOs.Products;

public class ProductFilterDto
{
    public int? CategoryId { get; set; }
    public int? BrandId { get; set; }
    public List<int>? CategoryIds { get; set; }  // Multiple categories
    public List<int>? BrandIds { get; set; }     // Multiple brands
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public string? Search { get; set; }
    public bool InStock { get; set; } = false;
    public bool? OnSale { get; set; }            // Optional: discounted products
    public string? SortBy { get; set; }          // "price", "name", etc.
    public string? SortOrder { get; set; }       // "asc", "desc"
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}
