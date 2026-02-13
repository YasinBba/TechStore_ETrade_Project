using TechStore.Application.DTOs.Common;
using TechStore.Application.DTOs.Users;

namespace TechStore.Application.Services;

public interface IAddressService
{
    Task<ApiResponse<List<AddressDto>>> GetUserAddressesAsync(int userId);
    Task<ApiResponse<AddressDto>> GetAddressAsync(int userId, int addressId);
    Task<ApiResponse<AddressDto>> CreateAddressAsync(int userId, CreateAddressDto dto);
    Task<ApiResponse<AddressDto>> UpdateAddressAsync(int userId, int addressId, UpdateAddressDto dto);
    Task<ApiResponse<bool>> DeleteAddressAsync(int userId, int addressId);
    Task<ApiResponse<bool>> SetDefaultAddressAsync(int userId, int addressId);
}
