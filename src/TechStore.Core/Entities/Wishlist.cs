namespace TechStore.Core.Entities;

public class Wishlist : BaseEntity
{
    public int UserId { get; set; }
    public int ProductId { get; set; }

    // Navigation Properties
    public User User { get; set; } = null!;
    public Product Product { get; set; } = null!;
}
