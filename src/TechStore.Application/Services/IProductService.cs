using TechStore.Application.DTOs.Common;
using TechStore.Application.DTOs.Products;

namespace TechStore.Application.Services;

public interface IProductService
{
    Task<ApiResponse<ProductDto>> GetByIdAsync(int id);
    Task<ApiResponse<ProductDto>> GetBySlugAsync(string slug);
    Task<ApiResponse<PagedResult<ProductDto>>> GetAllAsync(ProductFilterDto filter);
    Task<ApiResponse<List<ProductDto>>> GetFeaturedAsync(int count = 10);
    Task<ApiResponse<ProductDto>> CreateAsync(CreateProductDto createDto);
    Task<ApiResponse<ProductDto>> UpdateAsync(int id, UpdateProductDto updateDto);
    Task<ApiResponse<bool>> DeleteAsync(int id);
}
