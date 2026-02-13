using TechStore.Core.Entities;

namespace TechStore.Core.Interfaces.Repositories;

public interface ICartRepository
{
    Task<Cart?> GetByUserIdAsync(int userId);
    Task<Cart?> GetByIdWithItemsAsync(int id);
    Task<CartItem?> GetCartItemByIdAsync(int id);
    Task<Cart> CreateAsync(Cart cart);
    Task UpdateAsync(Cart cart);
    Task DeleteAsync(int id);
    Task<CartItem> AddItemAsync(CartItem cartItem);
    Task UpdateItemAsync(CartItem cartItem);
    Task DeleteItemAsync(int cartItemId);
}
