using AutoMapper;
using TechStore.Application.DTOs.Common;
using TechStore.Application.DTOs.Products;
using TechStore.Core.Entities;
using TechStore.Core.Interfaces.Repositories;

namespace TechStore.Application.Services;

public class ProductService : IProductService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ProductService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<ProductDto>> GetByIdAsync(int id)
    {
        var product = await _unitOfWork.Products.GetByIdWithDetailsAsync(id);
        
        if (product == null)
            return ApiResponse<ProductDto>.FailResult("Product not found");

        var productDto = _mapper.Map<ProductDto>(product);
        return ApiResponse<ProductDto>.SuccessResult(productDto);
    }

    public async Task<ApiResponse<ProductDto>> GetBySlugAsync(string slug)
    {
        var product = await _unitOfWork.Products.GetBySlugAsync(slug);
        
        if (product == null)
            return ApiResponse<ProductDto>.FailResult("Product not found");

        var productDto = _mapper.Map<ProductDto>(product);
        return ApiResponse<ProductDto>.SuccessResult(productDto);
    }

    public async Task<ApiResponse<PagedResult<ProductDto>>> GetAllAsync(ProductFilterDto filter)
    {
        var products = await _unitOfWork.Products.GetAllAsync();
        
        // Apply filters
        var query = products.AsQueryable();

        if (filter.CategoryId.HasValue)
            query = query.Where(p => p.CategoryId == filter.CategoryId.Value);

        if (filter.BrandId.HasValue)
            query = query.Where(p => p.BrandId == filter.BrandId.Value);

        if (filter.MinPrice.HasValue)
            query = query.Where(p => p.Price >= filter.MinPrice.Value);

        if (filter.MaxPrice.HasValue)
            query = query.Where(p => p.Price <= filter.MaxPrice.Value);

        if (!string.IsNullOrWhiteSpace(filter.Search))
            query = query.Where(p => p.Name.Contains(filter.Search) || 
                                    (p.Description ?? "").Contains(filter.Search));

        if (filter.InStock)
            query = query.Where(p => p.StockQuantity > 0);

        // Sorting
        query = filter.SortBy?.ToLower() switch
        {
            "price" => filter.SortOrder == "desc" 
                ? query.OrderByDescending(p => p.Price)
                : query.OrderBy(p => p.Price),
            "name" => filter.SortOrder == "desc"
                ? query.OrderByDescending(p => p.Name)
                : query.OrderBy(p => p.Name),
            _ => query.OrderByDescending(p => p.CreatedAt)
        };

        var totalItems = query.Count();
        var totalPages = (int)Math.Ceiling(totalItems / (double)filter.PageSize);

        var items = query
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToList();

        var productDtos = _mapper.Map<List<ProductDto>>(items);

        var result = new PagedResult<ProductDto>
        {
            Items = productDtos,
            TotalItems = totalItems,
            Page = filter.Page,
            PageSize = filter.PageSize,
            TotalPages = totalPages
        };

        return ApiResponse<PagedResult<ProductDto>>.SuccessResult(result);
    }

    public async Task<ApiResponse<List<ProductDto>>> GetFeaturedAsync(int count = 10)
    {
        var products = await _unitOfWork.Products.GetFeaturedProductsAsync(count);
        var productDtos = _mapper.Map<List<ProductDto>>(products);
        return ApiResponse<List<ProductDto>>.SuccessResult(productDtos);
    }

    public async Task<ApiResponse<ProductDto>> CreateAsync(CreateProductDto createDto)
    {
        // Check if SKU exists
        if (await _unitOfWork.Products.ExistsBySkuAsync(createDto.SKU))
            return ApiResponse<ProductDto>.FailResult("Product with this SKU already exists");

        var product = _mapper.Map<Product>(createDto);
        product.Slug = GenerateSlug(createDto.Name);

        await _unitOfWork.Products.AddAsync(product);
        await _unitOfWork.SaveChangesAsync();

        var productDto = _mapper.Map<ProductDto>(product);
        return ApiResponse<ProductDto>.SuccessResult(productDto, "Product created successfully");
    }

    public async Task<ApiResponse<ProductDto>> UpdateAsync(int id, UpdateProductDto updateDto)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(id);
        
        if (product == null)
            return ApiResponse<ProductDto>.FailResult("Product not found");

        _mapper.Map(updateDto, product);
        product.Slug = GenerateSlug(updateDto.Name);

        await _unitOfWork.Products.UpdateAsync(product);
        await _unitOfWork.SaveChangesAsync();

        var productDto = _mapper.Map<ProductDto>(product);
        return ApiResponse<ProductDto>.SuccessResult(productDto, "Product updated successfully");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(int id)
    {
        if (!await _unitOfWork.Products.ExistsAsync(id))
            return ApiResponse<bool>.FailResult("Product not found");

        await _unitOfWork.Products.DeleteAsync(id);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResult(true, "Product deleted successfully");
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
            .Replace("ç", "c");
    }
}
