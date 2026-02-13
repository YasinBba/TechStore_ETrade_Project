using Microsoft.EntityFrameworkCore;
using TechStore.Core.Entities;
using TechStore.Core.Interfaces.Services;
using TechStore.Infrastructure.Data;
using System.Threading.Tasks;
using System;
using System.Linq;

namespace TechStore.Infrastructure.Services
{
    public class StockService : IStockService
    {
        private readonly ApplicationDbContext _context;

        public StockService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> CheckStockAsync(int productId, int quantity)
        {
            var product = await _context.Products.FindAsync(productId);
            return product != null && product.StockQuantity >= quantity;
        }

        public async Task<int> GetStockAsync(int productId)
        {
            var product = await _context.Products.FindAsync(productId);
            return product?.StockQuantity ?? 0;
        }

        public async Task<bool> UpdateStockAsync(int productId, int newStock, string reason, string userId)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null) return false;

            int oldStock = product.StockQuantity;
            int change = newStock - oldStock;

            product.StockQuantity = newStock;
            
            var history = new StockHistory
            {
                ProductId = productId,
                OldStock = oldStock,
                NewStock = newStock,
                ChangeAmount = change,
                Reason = reason, // "Reason" property exists in Entity
                CreatedBy = userId, // "CreatedBy" property exists in Entity
                CreatedAt = DateTime.UtcNow
            };

            _context.StockHistories.Add(history);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<System.Collections.Generic.List<StockHistory>> GetHistoryAsync(int productId)
        {
            return await _context.StockHistories
                .Where(h => h.ProductId == productId)
                .OrderByDescending(h => h.CreatedAt)
                .ToListAsync();
        }

        public async Task<System.Collections.Generic.List<Product>> GetLowStockProductsAsync(int threshold = 10)
        {
            return await _context.Products
                .Where(p => p.StockQuantity <= threshold)
                .OrderBy(p => p.StockQuantity)
                .ToListAsync();
        }
    }
}
