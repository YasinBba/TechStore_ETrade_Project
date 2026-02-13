using AutoMapper;
using TechStore.Application.DTOs.Common;
using TechStore.Application.DTOs.Orders;
using TechStore.Core.Entities;
using TechStore.Core.Enums;
using TechStore.Core.Interfaces.Repositories;
using TechStore.Core.Interfaces.Services;

namespace TechStore.Application.Services;

public class OrderService : IOrderService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IEmailService _emailService;

    public OrderService(IUnitOfWork unitOfWork, IMapper mapper, IEmailService emailService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _emailService = emailService;
    }

    public async Task<ApiResponse<OrderDto>> GetByIdAsync(int id)
    {
        var order = await _unitOfWork.Orders.GetByIdWithDetailsAsync(id);
        
        if (order == null)
            return ApiResponse<OrderDto>.FailResult("Order not found");

        var orderDto = _mapper.Map<OrderDto>(order);
        return ApiResponse<OrderDto>.SuccessResult(orderDto);
    }

    public async Task<ApiResponse<OrderDto>> GetByOrderNumberAsync(string orderNumber)
    {
        var order = await _unitOfWork.Orders.GetByOrderNumberAsync(orderNumber);
        
        if (order == null)
            return ApiResponse<OrderDto>.FailResult("Order not found");

        var orderDto = _mapper.Map<OrderDto>(order);
        return ApiResponse<OrderDto>.SuccessResult(orderDto);
    }

    public async Task<ApiResponse<List<OrderDto>>> GetUserOrdersAsync(int userId)
    {
        var orders = await _unitOfWork.Orders.GetByUserIdAsync(userId);
        var orderDtos = _mapper.Map<List<OrderDto>>(orders);
        return ApiResponse<List<OrderDto>>.SuccessResult(orderDtos);
    }

    public async Task<ApiResponse<OrderDto>> CreateOrderAsync(int userId, CreateOrderDto createDto)
    {
        try
        {
            await _unitOfWork.BeginTransactionAsync();

            // Get user's cart
            var cart = await _unitOfWork.Repository<Cart>()
                .FindAsync(c => c.UserId == userId);
            
            var userCart = cart.FirstOrDefault();
            if (userCart == null)
                return ApiResponse<OrderDto>.FailResult("Cart is empty");

            var cartItems = await _unitOfWork.Repository<CartItem>()
                .FindAsync(ci => ci.CartId == userCart.Id);

            if (!cartItems.Any())
                return ApiResponse<OrderDto>.FailResult("Cart is empty");

            // Calculate totals
            decimal subTotal = 0;
            var orderItems = new List<OrderItem>();

            foreach (var cartItem in cartItems)
            {
                var product = await _unitOfWork.Products.GetByIdAsync(cartItem.ProductId);
                
                if (product == null || product.StockQuantity < cartItem.Quantity)
                {
                    await _unitOfWork.RollbackTransactionAsync();
                    return ApiResponse<OrderDto>.FailResult($"Product {product?.Name ?? "Unknown"} is not available");
                }

                var orderItem = new OrderItem
                {
                    ProductId = cartItem.ProductId,
                    ProductName = product.Name,
                    ProductSKU = product.SKU,
                    Quantity = cartItem.Quantity,
                    UnitPrice = product.Price,
                    TotalPrice = product.Price * cartItem.Quantity
                };

                orderItems.Add(orderItem);
                subTotal += orderItem.TotalPrice;

                // Update stock
                product.StockQuantity -= cartItem.Quantity;
                await _unitOfWork.Products.UpdateAsync(product);

                // Add StockHistory record
                var stockHistory = new StockHistory
                {
                    ProductId = product.Id,
                    ChangeAmount = -cartItem.Quantity, // Negative for reduction
                    OldStock = product.StockQuantity + cartItem.Quantity,
                    NewStock = product.StockQuantity,
                    Reason = "Sale", // Enum or constant would be better
                    CreatedBy = userId.ToString(), // Assuming userId is int, converting to string
                    CreatedAt = DateTime.UtcNow
                };
                // Note property doesn't exist in entity, removed assignment
                await _unitOfWork.Repository<StockHistory>().AddAsync(stockHistory);
            }

            // Create order
            var order = new Order
            {
                OrderNumber = GenerateOrderNumber(),
                UserId = userId,
                ShippingAddressId = createDto.ShippingAddressId,
                PaymentMethod = createDto.PaymentMethod,
                SubTotal = subTotal,
                ShippingCost = 29.99m, // Fixed shipping cost
                Tax = subTotal * 0.18m, // 18% KDV
                Discount = 0,
                Total = subTotal + 29.99m + (subTotal * 0.18m),
                CouponId = createDto.CouponId,
                Notes = createDto.Notes,
                Status = OrderStatus.Pending,
                PaymentStatus = PaymentStatus.Pending
            };

            await _unitOfWork.Repository<Order>().AddAsync(order);
            await _unitOfWork.SaveChangesAsync();

            // Add order items
            foreach (var item in orderItems)
            {
                item.OrderId = order.Id;
                await _unitOfWork.Repository<OrderItem>().AddAsync(item);
            }

            // Clear cart
            foreach (var cartItem in cartItems)
            {
                await _unitOfWork.Repository<CartItem>().DeleteAsync(cartItem.Id);
            }

            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();

            var orderDto = _mapper.Map<OrderDto>(order);

            // Send confirmation email (Fire and forget or await)
            try 
            {
                await _emailService.SendEmailAsync(
                    "user@example.com", // In real app, get from user
                    $"Sipariş Onayı - #{order.OrderNumber}",
                    $"Siparişiniz başarıyla oluşturuldu. Toplam tutar: {order.Total:C2}"
                );
            }
            catch 
            {
                // Email failure shouldn't fail the order
            }

            return ApiResponse<OrderDto>.SuccessResult(orderDto, "Order created successfully");
        }
        catch (Exception ex)
        {
            await _unitOfWork.RollbackTransactionAsync();
            return ApiResponse<OrderDto>.FailResult($"Failed to create order: {ex.Message}");
        }
    }

    public async Task<ApiResponse<bool>> CancelOrderAsync(int orderId, int userId)
    {
        var order = await _unitOfWork.Orders.GetByIdAsync(orderId);

        if (order == null)
            return ApiResponse<bool>.FailResult("Order not found");

        if (order.UserId != userId)
            return ApiResponse<bool>.FailResult("You are not authorized to cancel this order");

        if (order.Status != OrderStatus.Pending && order.Status != OrderStatus.Confirmed)
            return ApiResponse<bool>.FailResult("Order cannot be cancelled");

        order.Status = OrderStatus.Cancelled;
        await _unitOfWork.Orders.UpdateAsync(order);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResult(true, "Order cancelled successfully");
    }

    private string GenerateOrderNumber()
    {
        return $"ORD-{DateTime.UtcNow:yyyyMMddHHmmss}-{new Random().Next(1000, 9999)}";
    }
}
