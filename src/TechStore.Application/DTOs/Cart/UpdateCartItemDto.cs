using System.ComponentModel.DataAnnotations;

namespace TechStore.Application.DTOs.Cart;

public class UpdateCartItemDto
{
    [Range(1, int.MaxValue, ErrorMessage = "Miktar en az 1 olmalıdır")]
    public int Quantity { get; set; }
}
