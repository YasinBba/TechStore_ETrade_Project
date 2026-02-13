using TechStore.Core.Entities;

namespace TechStore.Core.Interfaces.Repositories;

public interface IAddressRepository
{
    Task<List<Address>> GetUserAddressesAsync(int userId);
    Task<Address?> GetByIdAsync(int id);
    Task<Address?> GetUserAddressByIdAsync(int userId, int addressId);
    Task<Address> CreateAsync(Address address);
    Task UpdateAsync(Address address);
    Task DeleteAsync(int id);
    Task<bool> SetDefaultAddressAsync(int userId, int addressId);
    Task<int> CountUserAddressesAsync(int userId);
}
