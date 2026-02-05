using TechStore.Application.DTOs.Common;
using TechStore.Application.DTOs.Orders;

namespace TechStore.Application.Services;

public interface IOrderService
{
    Task<ApiResponse<OrderDto>> GetByIdAsync(int id);
    Task<ApiResponse<OrderDto>> GetByOrderNumberAsync(string orderNumber);
    Task<ApiResponse<List<OrderDto>>> GetUserOrdersAsync(int userId);
    Task<ApiResponse<OrderDto>> CreateOrderAsync(int userId, CreateOrderDto createDto);
    Task<ApiResponse<bool>> CancelOrderAsync(int orderId, int userId);
}
