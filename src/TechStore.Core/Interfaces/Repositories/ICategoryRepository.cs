using TechStore.Core.Entities;

namespace TechStore.Core.Interfaces.Repositories;

public interface ICategoryRepository : IRepository<Category>
{
    Task<IEnumerable<Category>> GetMainCategoriesAsync();
    Task<IEnumerable<Category>> GetSubCategoriesAsync(int parentCategoryId);
    Task<Category?> GetBySlugAsync(string slug);
}
