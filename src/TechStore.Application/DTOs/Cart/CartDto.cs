namespace TechStore.Application.DTOs.Cart;

public class CartDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public List<CartItemDto> Items { get; set; } = new();
    public decimal TotalAmount => Items.Sum(item => item.TotalPrice);
    public int TotalItems => Items.Sum(item => item.Quantity);
}
