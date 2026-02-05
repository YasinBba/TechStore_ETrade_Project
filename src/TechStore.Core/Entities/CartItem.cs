namespace TechStore.Core.Entities;

public class CartItem : BaseEntity
{
    public int CartId { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }

    // Navigation Properties
    public Cart Cart { get; set; } = null!;
    public Product Product { get; set; } = null!;
}
