using AutoMapper;
using TechStore.Application.DTOs.Categories;
using TechStore.Application.DTOs.Common;
using TechStore.Core.Entities;
using TechStore.Core.Interfaces.Repositories;

namespace TechStore.Application.Services;

public class CategoryService : ICategoryService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CategoryService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<List<CategoryDto>>> GetAllAsync()
    {
        var categories = await _unitOfWork.Categories.GetAllAsync();
        var categoryDtos = _mapper.Map<List<CategoryDto>>(categories);
        return ApiResponse<List<CategoryDto>>.SuccessResult(categoryDtos);
    }

    public async Task<ApiResponse<CategoryDto>> GetByIdAsync(int id)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(id);
        if (category == null)
            return ApiResponse<CategoryDto>.FailResult("Category not found");

        var categoryDto = _mapper.Map<CategoryDto>(category);
        return ApiResponse<CategoryDto>.SuccessResult(categoryDto);
    }

    public async Task<ApiResponse<CategoryDto>> CreateAsync(CreateCategoryDto createDto)
    {
        var category = _mapper.Map<Category>(createDto);
        category.Slug = GenerateSlug(createDto.Name);

        await _unitOfWork.Categories.AddAsync(category);
        await _unitOfWork.SaveChangesAsync();

        var categoryDto = _mapper.Map<CategoryDto>(category);
        return ApiResponse<CategoryDto>.SuccessResult(categoryDto, "Category created successfully");
    }

    public async Task<ApiResponse<CategoryDto>> UpdateAsync(int id, UpdateCategoryDto updateDto)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(id);
        if (category == null)
            return ApiResponse<CategoryDto>.FailResult("Category not found");

        _mapper.Map(updateDto, category);
        category.Slug = GenerateSlug(updateDto.Name);

        await _unitOfWork.Categories.UpdateAsync(category);
        await _unitOfWork.SaveChangesAsync();

        var categoryDto = _mapper.Map<CategoryDto>(category);
        return ApiResponse<CategoryDto>.SuccessResult(categoryDto, "Category updated successfully");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(int id)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(id);
        if (category == null)
            return ApiResponse<bool>.FailResult("Category not found");

        // Check if category has products
        // Note: This requires loading products or a check method in repo. 
        // For now basics. Ideally specific repo method.
        
        await _unitOfWork.Categories.DeleteAsync(id);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResult(true, "Category deleted successfully");
    }

    private string GenerateSlug(string name)
    {
        return name.ToLower()
            .Replace(" ", "-")
            .Replace("ğ", "g")
            .Replace("ü", "u")
            .Replace("ş", "s")
            .Replace("ı", "i")
            .Replace("ö", "o")
            .Replace("ç", "c")
            .Replace(".", "")
            .Replace("'", "");
    }
}
