using TechStore.Application.DTOs.Brands;
using TechStore.Application.DTOs.Common;

namespace TechStore.Application.Services;

public interface IBrandService
{
    Task<ApiResponse<List<BrandDto>>> GetAllAsync();
    Task<ApiResponse<BrandDto>> GetByIdAsync(int id);
    Task<ApiResponse<BrandDto>> CreateAsync(CreateBrandDto createDto);
    Task<ApiResponse<BrandDto>> UpdateAsync(int id, UpdateBrandDto updateDto);
    Task<ApiResponse<bool>> DeleteAsync(int id);
}
