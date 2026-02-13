using TechStore.Core.Entities;

namespace TechStore.Core.Interfaces.Services
{
    public interface IStockService
    {
        Task<bool> UpdateStockAsync(int productId, int newStock, string reason, string userId);
        Task<List<StockHistory>> GetHistoryAsync(int productId);
        Task<List<Product>> GetLowStockProductsAsync(int threshold = 10);
    }
}
