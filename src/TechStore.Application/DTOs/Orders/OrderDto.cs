using TechStore.Core.Enums;

namespace TechStore.Application.DTOs.Orders;

public class OrderDto
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public OrderStatus Status { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public PaymentStatus PaymentStatus { get; set; }
    public decimal SubTotal { get; set; }
    public decimal ShippingCost { get; set; }
    public decimal Tax { get; set; }
    public decimal Discount { get; set; }
    public decimal Total { get; set; }
    public string? TrackingNumber { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<OrderItemDto> OrderItems { get; set; } = new();
}

public class OrderItemDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
}

public class CreateOrderDto
{
    public int ShippingAddressId { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public int? CouponId { get; set; }
    public string? Notes { get; set; }
}
