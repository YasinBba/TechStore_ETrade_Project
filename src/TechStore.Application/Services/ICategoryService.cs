using TechStore.Application.DTOs.Categories;
using TechStore.Application.DTOs.Common;

namespace TechStore.Application.Services;

public interface ICategoryService
{
    Task<ApiResponse<List<CategoryDto>>> GetAllAsync();
    Task<ApiResponse<CategoryDto>> GetByIdAsync(int id);
    Task<ApiResponse<CategoryDto>> CreateAsync(CreateCategoryDto createDto);
    Task<ApiResponse<CategoryDto>> UpdateAsync(int id, UpdateCategoryDto updateDto);
    Task<ApiResponse<bool>> DeleteAsync(int id);
}
