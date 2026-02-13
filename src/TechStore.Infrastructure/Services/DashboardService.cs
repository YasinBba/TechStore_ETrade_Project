using Microsoft.EntityFrameworkCore;
using TechStore.Infrastructure.Data;
using TechStore.Infrastructure.Data;
using TechStore.Core.DTOs;
using TechStore.Core.Interfaces.Services;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace TechStore.Infrastructure.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly ApplicationDbContext _context; // Use ApplicationDbContext, not TechStoreDbContext

        public DashboardService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardSummaryDto> GetSummaryAsync()
        {
            var totalRevenue = await _context.Orders
                .Where(o => o.Status != Core.Enums.OrderStatus.Cancelled)
                .SumAsync(o => o.Total); // TotalAmount -> Total

            var totalOrders = await _context.Orders.CountAsync();
            var totalProducts = await _context.Products.CountAsync();
            var totalUsers = await _context.Users.CountAsync();

            var recentOrders = await _context.Orders
                .Include(o => o.User) // Include User
                .OrderByDescending(o => o.CreatedAt) // OrderDate -> CreatedAt
                .Take(5)
                .Select(o => new RecentOrderDto
                {
                    Id = o.Id,
                    OrderNumber = o.OrderNumber,
                    CustomerName = o.User != null ? $"{o.User.FirstName} {o.User.LastName}" : "Misafir",
                    TotalAmount = o.Total,
                    Status = o.Status.ToString(),
                    OrderDate = o.CreatedAt
                })
                .ToListAsync();

            // Mock top products logic
            var topProducts = await _context.Products
                .OrderByDescending(p => p.Price)
                .Take(5)
                .Select(p => new TopProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    SoldCount = 0
                })
                .ToListAsync();

            return new DashboardSummaryDto
            {
                TotalRevenue = totalRevenue,
                TotalOrders = totalOrders,
                TotalProducts = totalProducts,
                TotalUsers = totalUsers,
                RecentOrders = recentOrders,
                TopProducts = topProducts
            };
        }
    }
}
