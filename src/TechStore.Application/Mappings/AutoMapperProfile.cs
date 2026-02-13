using AutoMapper;
using TechStore.Application.DTOs.Auth;
using TechStore.Application.DTOs.Brands;
using TechStore.Application.DTOs.Cart;
using TechStore.Application.DTOs.Categories;
using TechStore.Application.DTOs.Orders;
using TechStore.Application.DTOs.Products;
using TechStore.Application.DTOs.Users;
using TechStore.Application.DTOs.Reviews;
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

        // Category mappings
        CreateMap<Category, CategoryDto>()
            .ForMember(dest => dest.ProductCount, opt => opt.MapFrom(src => src.Products.Count))
            .ForMember(dest => dest.ParentCategoryName, opt => opt.MapFrom(src => src.ParentCategory != null ? src.ParentCategory.Name : null));
        CreateMap<CreateCategoryDto, Category>()
            .ForMember(dest => dest.Slug, opt => opt.Ignore());
        CreateMap<UpdateCategoryDto, Category>()
            .ForMember(dest => dest.Slug, opt => opt.Ignore());

        // Brand mappings
        CreateMap<Brand, BrandDto>()
            .ForMember(dest => dest.ProductCount, opt => opt.MapFrom(src => src.Products.Count));
        CreateMap<CreateBrandDto, Brand>()
            .ForMember(dest => dest.Slug, opt => opt.Ignore());
        CreateMap<UpdateBrandDto, Brand>()
            .ForMember(dest => dest.Slug, opt => opt.Ignore());

        // Address mappings
        CreateMap<Address, AddressDto>().ReverseMap();
        CreateMap<CreateAddressDto, Address>();
        CreateMap<UpdateAddressDto, Address>();

        // UserProfile mappings
        CreateMap<ApplicationUser, UserProfileDto>();
        CreateMap<UpdateUserProfileDto, ApplicationUser>();

        // Review mappings
        CreateMap<Review, ReviewDto>()
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name))
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.FirstName + " " + src.User.LastName));
        CreateMap<CreateReviewDto, Review>();
        CreateMap<UpdateReviewDto, Review>();
    }
}
