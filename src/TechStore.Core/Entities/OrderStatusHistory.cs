using TechStore.Core.Enums;

namespace TechStore.Core.Entities;

public class OrderStatusHistory : BaseEntity
{
    public int OrderId { get; set; }
    public OrderStatus Status { get; set; }
    public string? Notes { get; set; }
    public string? ChangedBy { get; set; }

    // Navigation Properties
    public Order Order { get; set; } = null!;
}
