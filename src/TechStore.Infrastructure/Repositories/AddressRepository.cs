using Microsoft.EntityFrameworkCore;
using TechStore.Core.Entities;
using TechStore.Core.Interfaces.Repositories;
using TechStore.Infrastructure.Data;

namespace TechStore.Infrastructure.Repositories;

public class AddressRepository : IAddressRepository
{
    private readonly ApplicationDbContext _context;

    public AddressRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Address>> GetUserAddressesAsync(int userId)
    {
        return await _context.Addresses
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.IsDefault)
            .ThenByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task<Address?> GetByIdAsync(int id)
    {
        return await _context.Addresses.FindAsync(id);
    }

    public async Task<Address?> GetUserAddressByIdAsync(int userId, int addressId)
    {
        return await _context.Addresses
            .FirstOrDefaultAsync(a => a.Id == addressId && a.UserId == userId);
    }

    public async Task<Address> CreateAsync(Address address)
    {
        _context.Addresses.Add(address);
        await _context.SaveChangesAsync();
        return address;
    }

    public async Task UpdateAsync(Address address)
    {
        _context.Addresses.Update(address);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var address = await GetByIdAsync(id);
        if (address != null)
        {
            _context.Addresses.Remove(address);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> SetDefaultAddressAsync(int userId, int addressId)
    {
        // Remove default from all user addresses
        var userAddresses = await GetUserAddressesAsync(userId);
        foreach (var addr in userAddresses)
        {
            addr.IsDefault = false;
        }

        // Set new default
        var targetAddress = userAddresses.FirstOrDefault(a => a.Id == addressId);
        if (targetAddress != null)
        {
            targetAddress.IsDefault = true;
            await _context.SaveChangesAsync();
            return true;
        }

        return false;
    }

    public async Task<int> CountUserAddressesAsync(int userId)
    {
        return await _context.Addresses.CountAsync(a => a.UserId == userId);
    }
}
