using TechStore.Core.Enums;

namespace TechStore.Core.Entities;

public class Coupon : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public DiscountType DiscountType { get; set; }
    public decimal DiscountValue { get; set; }
    public decimal? MinimumOrderAmount { get; set; }
    public int? UsageLimit { get; set; }
    public int UsageCount { get; set; } = 0;
    public DateTime ValidFrom { get; set; }
    public DateTime ValidTo { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation Properties
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}
