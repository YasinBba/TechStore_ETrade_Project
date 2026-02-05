namespace TechStore.Core.Entities;

public class ProductSpecification : BaseEntity
{
    public int ProductId { get; set; }
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }

    // Navigation Properties
    public Product Product { get; set; } = null!;
}
