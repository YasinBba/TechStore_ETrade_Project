namespace TechStore.Core.Entities;

public class Review : BaseEntity
{
    public int ProductId { get; set; }
    public int UserId { get; set; }
    public int Rating { get; set; }
    public string? Title { get; set; }
    public string? Comment { get; set; }
    public List<string> Images { get; set; } = new();
    public bool IsApproved { get; set; } = false;
    public int HelpfulCount { get; set; } = 0;

    // Navigation Properties
    public Product Product { get; set; } = null!;
    public ApplicationUser User { get; set; } = null!;
}
