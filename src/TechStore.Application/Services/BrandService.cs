using AutoMapper;
using TechStore.Application.DTOs.Brands;
using TechStore.Application.DTOs.Common;
using TechStore.Core.Entities;
using TechStore.Core.Interfaces.Repositories;

namespace TechStore.Application.Services;

public class BrandService : IBrandService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IRepository<Brand> _brandRepository;

    public BrandService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _brandRepository = _unitOfWork.Repository<Brand>();
    }

    public async Task<ApiResponse<List<BrandDto>>> GetAllAsync()
    {
        var brands = await _brandRepository.GetAllAsync();
        var brandDtos = _mapper.Map<List<BrandDto>>(brands);
        return ApiResponse<List<BrandDto>>.SuccessResult(brandDtos);
    }

    public async Task<ApiResponse<BrandDto>> GetByIdAsync(int id)
    {
        var brand = await _brandRepository.GetByIdAsync(id);
        if (brand == null)
            return ApiResponse<BrandDto>.FailResult("Brand not found");

        var brandDto = _mapper.Map<BrandDto>(brand);
        return ApiResponse<BrandDto>.SuccessResult(brandDto);
    }

    public async Task<ApiResponse<BrandDto>> CreateAsync(CreateBrandDto createDto)
    {
        var brand = _mapper.Map<Brand>(createDto);
        brand.Slug = GenerateSlug(createDto.Name);

        await _brandRepository.AddAsync(brand);
        await _unitOfWork.SaveChangesAsync();

        var brandDto = _mapper.Map<BrandDto>(brand);
        return ApiResponse<BrandDto>.SuccessResult(brandDto, "Brand created successfully");
    }

    public async Task<ApiResponse<BrandDto>> UpdateAsync(int id, UpdateBrandDto updateDto)
    {
        var brand = await _brandRepository.GetByIdAsync(id);
        if (brand == null)
            return ApiResponse<BrandDto>.FailResult("Brand not found");

        _mapper.Map(updateDto, brand);
        brand.Slug = GenerateSlug(updateDto.Name);

        await _brandRepository.UpdateAsync(brand);
        await _unitOfWork.SaveChangesAsync();

        var brandDto = _mapper.Map<BrandDto>(brand);
        return ApiResponse<BrandDto>.SuccessResult(brandDto, "Brand updated successfully");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(int id)
    {
        if (!await _brandRepository.ExistsAsync(id))
            return ApiResponse<bool>.FailResult("Brand not found");

        await _brandRepository.DeleteAsync(id);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResult(true, "Brand deleted successfully");
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
