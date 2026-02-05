using Microsoft.EntityFrameworkCore;
using TechStore.Core.Entities;
using TechStore.Core.Interfaces.Repositories;
using TechStore.Infrastructure.Data;

namespace TechStore.Infrastructure.Repositories;

public class CategoryRepository : Repository<Category>, ICategoryRepository
{
    public CategoryRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Category>> GetMainCategoriesAsync()
    {
        return await _dbSet
            .Where(c => c.ParentCategoryId == null && c.IsActive)
            .Include(c => c.SubCategories)
            .OrderBy(c => c.DisplayOrder)
            .ToListAsync();
    }

    public async Task<IEnumerable<Category>> GetSubCategoriesAsync(int parentCategoryId)
    {
        return await _dbSet
            .Where(c => c.ParentCategoryId == parentCategoryId && c.IsActive)
            .OrderBy(c => c.DisplayOrder)
            .ToListAsync();
    }

    public async Task<Category?> GetBySlugAsync(string slug)
    {
        return await _dbSet
            .Include(c => c.SubCategories)
            .Include(c => c.ParentCategory)
            .FirstOrDefaultAsync(c => c.Slug == slug);
    }
}
