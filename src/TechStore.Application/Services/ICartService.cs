using TechStore.Application.DTOs.Cart;
using TechStore.Application.DTOs.Common;

namespace TechStore.Application.Services;

public interface ICartService
{
    Task<ApiResponse<CartDto>> GetUserCartAsync(int userId);
    Task<ApiResponse<CartDto>> AddItemToCartAsync(int userId, AddCartItemDto dto);
    Task<ApiResponse<CartDto>> UpdateCartItemQuantityAsync(int userId, int cartItemId, UpdateCartItemDto dto);
    Task<ApiResponse<bool>> RemoveCartItemAsync(int userId, int cartItemId);
    Task<ApiResponse<bool>> ClearCartAsync(int userId);
}
