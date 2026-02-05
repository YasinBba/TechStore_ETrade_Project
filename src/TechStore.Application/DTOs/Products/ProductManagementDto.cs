namespace TechStore.Application.DTOs.Products;

public class CreateProductDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string SKU { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? OldPrice { get; set; }
    public int StockQuantity { get; set; }
    public int CategoryId { get; set; }
    public int? BrandId { get; set; }
    public bool IsFeatured { get; set; }
}

public class UpdateProductDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public decimal? OldPrice { get; set; }
    public int StockQuantity { get; set; }
    public int CategoryId { get; set; }
    public int? BrandId { get; set; }
    public bool IsActive { get; set; }
    public bool IsFeatured { get; set; }
}

public class ProductFilterDto
{
    public int? CategoryId { get; set; }
    public int? BrandId { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public string? Search { get; set; }
    public bool InStock { get; set; } = false;
    public string? SortBy { get; set; }
    public string SortOrder { get; set; } = "asc";
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}
