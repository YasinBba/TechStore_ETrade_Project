using Microsoft.EntityFrameworkCore;
using TechStore.Core.Entities;
using TechStore.Core.Interfaces.Repositories;
using TechStore.Infrastructure.Data;

namespace TechStore.Infrastructure.Repositories;

public class ProductRepository : Repository<Product>, IProductRepository
{
    public ProductRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Product?> GetByIdWithDetailsAsync(int id)
    {
        return await _dbSet
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Include(p => p.Images)
            .Include(p => p.Specifications)
            .Include(p => p.Reviews)
                .ThenInclude(r => r.User)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<Product?> GetBySlugAsync(string slug)
    {
        return await _dbSet
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Include(p => p.Images)
            .Include(p => p.Specifications)
            .FirstOrDefaultAsync(p => p.Slug == slug);
    }

    public async Task<IEnumerable<Product>> GetFeaturedProductsAsync(int count)
    {
        return await _dbSet
            .Where(p => p.IsFeatured && p.IsActive)
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Include(p => p.Images)
            .OrderByDescending(p => p.CreatedAt)
            .Take(count)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetByCategoryIdAsync(int categoryId)
    {
        return await _dbSet
            .Where(p => p.CategoryId == categoryId && p.IsActive)
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Include(p => p.Images)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> SearchAsync(string searchTerm)
    {
        return await _dbSet
            .Where(p => p.IsActive &&
                   (p.Name.Contains(searchTerm) ||
                    p.Description!.Contains(searchTerm) ||
                    p.SKU.Contains(searchTerm)))
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Include(p => p.Images)
            .ToListAsync();
    }

    public async Task<bool> ExistsBySkuAsync(string sku)
    {
        return await _dbSet.AnyAsync(p => p.SKU == sku);
    }
}
