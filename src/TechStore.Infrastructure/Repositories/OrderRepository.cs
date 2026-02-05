using Microsoft.EntityFrameworkCore;
using TechStore.Core.Entities;
using TechStore.Core.Interfaces.Repositories;
using TechStore.Infrastructure.Data;

namespace TechStore.Infrastructure.Repositories;

public class OrderRepository : Repository<Order>, IOrderRepository
{
    public OrderRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Order?> GetByOrderNumberAsync(string orderNumber)
    {
        return await _dbSet
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .Include(o => o.User)
            .Include(o => o.ShippingAddress)
            .Include(o => o.StatusHistories)
            .FirstOrDefaultAsync(o => o.OrderNumber == orderNumber);
    }

    public async Task<IEnumerable<Order>> GetByUserIdAsync(int userId)
    {
        return await _dbSet
            .Where(o => o.UserId == userId)
            .Include(o => o.OrderItems)
            .Include(o => o.ShippingAddress)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task<Order?> GetByIdWithDetailsAsync(int id)
    {
        return await _dbSet
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                    .ThenInclude(p => p.Images)
            .Include(o => o.User)
            .Include(o => o.ShippingAddress)
            .Include(o => o.Coupon)
            .Include(o => o.StatusHistories)
            .FirstOrDefaultAsync(o => o.Id == id);
    }
}
