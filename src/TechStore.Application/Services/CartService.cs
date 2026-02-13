using AutoMapper;
using TechStore.Application.DTOs.Cart;
using TechStore.Application.DTOs.Common;
using TechStore.Core.Entities;
using TechStore.Core.Interfaces.Repositories;

namespace TechStore.Application.Services;

public class CartService : ICartService
{
    private readonly ICartRepository _cartRepository;
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;

    public CartService(ICartRepository cartRepository, IProductRepository productRepository, IMapper mapper)
    {
        _cartRepository = cartRepository;
        _productRepository = productRepository;
        _mapper = mapper;
    }

    public async Task<ApiResponse<CartDto>> GetUserCartAsync(int userId)
    {
        var cart = await _cartRepository.GetByUserIdAsync(userId);
        
        if (cart == null)
        {
            // Create new cart for user
            cart = new Cart { UserId = userId };
            await _cartRepository.CreateAsync(cart);
        }

        var cartDto = MapCartToDto(cart);
        return ApiResponse<CartDto>.SuccessResult(cartDto);
    }

    public async Task<ApiResponse<CartDto>> AddItemToCartAsync(int userId, AddCartItemDto dto)
    {
        // Get or create cart
        var cart = await _cartRepository.GetByUserIdAsync(userId);
        if (cart == null)
        {
            cart = new Cart { UserId = userId };
            await _cartRepository.CreateAsync(cart);
            cart = await _cartRepository.GetByUserIdAsync(userId);
        }

        // Check if product exists
        var product = await _productRepository.GetByIdAsync(dto.ProductId);
        if (product == null)
        {
            return ApiResponse<CartDto>.FailResult("Ürün bulunamadı.");
        }

        // Check if item already in cart
        var existingItem = cart!.CartItems.FirstOrDefault(ci => ci.ProductId == dto.ProductId);
        if (existingItem != null)
        {
            // Update quantity
            existingItem.Quantity += dto.Quantity;
            await _cartRepository.UpdateItemAsync(existingItem);
        }
        else
        {
            // Add new item
            var cartItem = new CartItem
            {
                CartId = cart.Id,
                ProductId = dto.ProductId,
                Quantity = dto.Quantity,
                UnitPrice = product.Price
            };
            await _cartRepository.AddItemAsync(cartItem);
        }

        // Reload cart with items
        cart = await _cartRepository.GetByUserIdAsync(userId);
        var cartDto = MapCartToDto(cart!);
        return ApiResponse<CartDto>.SuccessResult(cartDto);
    }

    public async Task<ApiResponse<CartDto>> UpdateCartItemQuantityAsync(int userId, int cartItemId, UpdateCartItemDto dto)
    {
        var cartItem = await _cartRepository.GetCartItemByIdAsync(cartItemId);
        if (cartItem == null)
        {
            return ApiResponse<CartDto>.FailResult("Sepet ürünü bulunamadı.");
        }

        // Verify ownership
        var cart = await _cartRepository.GetByIdWithItemsAsync(cartItem.CartId);
        if (cart?.UserId != userId)
        {
            return ApiResponse<CartDto>.FailResult("Bu işlem için yetkiniz yok.");
        }

        cartItem.Quantity = dto.Quantity;
        await _cartRepository.UpdateItemAsync(cartItem);

        // Reload cart
        cart = await _cartRepository.GetByUserIdAsync(userId);
        var cartDto = MapCartToDto(cart!);
        return ApiResponse<CartDto>.SuccessResult(cartDto);
    }

    public async Task<ApiResponse<bool>> RemoveCartItemAsync(int userId, int cartItemId)
    {
        var cartItem = await _cartRepository.GetCartItemByIdAsync(cartItemId);
        if (cartItem == null)
        {
            return ApiResponse<bool>.FailResult("Sepet ürünü bulunamadı.");
        }

        // Verify ownership
        var cart = await _cartRepository.GetByIdWithItemsAsync(cartItem.CartId);
        if (cart?.UserId != userId)
        {
            return ApiResponse<bool>.FailResult("Bu işlem için yetkiniz yok.");
        }

        await _cartRepository.DeleteItemAsync(cartItemId);
        return ApiResponse<bool>.SuccessResult(true);
    }

    public async Task<ApiResponse<bool>> ClearCartAsync(int userId)
    {
        var cart = await _cartRepository.GetByUserIdAsync(userId);
        if (cart == null)
        {
            return ApiResponse<bool>.SuccessResult(true);
        }

        foreach (var item in cart.CartItems.ToList())
        {
            await _cartRepository.DeleteItemAsync(item.Id);
        }

        return ApiResponse<bool>.SuccessResult(true);
    }

    private CartDto MapCartToDto(Cart cart)
    {
        return new CartDto
        {
            Id = cart.Id,
            UserId = cart.UserId,
            Items = cart.CartItems.Select(ci => new CartItemDto
            {
                Id = ci.Id,
                ProductId = ci.ProductId,
                ProductName = ci.Product.Name,
                ProductImageUrl = ci.Product.Images?.FirstOrDefault()?.ImageUrl ?? "",
                Quantity = ci.Quantity,
                UnitPrice = ci.UnitPrice
            }).ToList()
        };
    }
}
