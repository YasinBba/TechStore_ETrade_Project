namespace TechStore.Application.DTOs.Brands;

public class CreateBrandDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public string? LogoUrl { get; set; }
    public string? Website { get; set; }
}

public class UpdateBrandDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public string? LogoUrl { get; set; }
    public string? Website { get; set; }
}

public class BrandDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public string? LogoUrl { get; set; }
    public string? Website { get; set; }
    public int ProductCount { get; set; }
}
