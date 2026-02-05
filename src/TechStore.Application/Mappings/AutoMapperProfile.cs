using AutoMapper;
using TechStore.Application.DTOs.Auth;
using TechStore.Application.DTOs.Orders;
using TechStore.Application.DTOs.Products;
using TechStore.Core.Entities;

namespace TechStore.Application.Mappings;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        // User mappings
        CreateMap<User, UserDto>();
        CreateMap<RegisterDto, User>();

        // Product mappings
        CreateMap<Product, ProductDto>()
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
            .ForMember(dest => dest.BrandName, opt => opt.MapFrom(src => src.Brand != null ? src.Brand.Name : null));
        
        CreateMap<CreateProductDto, Product>()
            .ForMember(dest => dest.Slug, opt => opt.Ignore()); // Will be generated in service
        
        CreateMap<UpdateProductDto, Product>()
            .ForMember(dest => dest.Slug, opt => opt.Ignore());

        CreateMap<ProductImage, ProductImageDto>();

        // Order mappings
        CreateMap<Order, OrderDto>();
        CreateMap<OrderItem, OrderItemDto>();
        CreateMap<CreateOrderDto, Order>();
    }
}
