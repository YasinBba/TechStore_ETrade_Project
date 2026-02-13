using AutoMapper;
using TechStore.Application.DTOs.Common;
using TechStore.Application.DTOs.Users;
using TechStore.Core.Entities;
using TechStore.Core.Interfaces.Repositories;

namespace TechStore.Application.Services;

public class AddressService : IAddressService
{
    private readonly IAddressRepository _addressRepository;
    private readonly IMapper _mapper;

    public AddressService(IAddressRepository addressRepository, IMapper mapper)
    {
        _addressRepository = addressRepository;
        _mapper = mapper;
    }

    public async Task<ApiResponse<List<AddressDto>>> GetUserAddressesAsync(int userId)
    {
        var addresses = await _addressRepository.GetUserAddressesAsync(userId);
        var addressDtos = _mapper.Map<List<AddressDto>>(addresses);
        return ApiResponse<List<AddressDto>>.SuccessResult(addressDtos);
    }

    public async Task<ApiResponse<AddressDto>> GetAddressAsync(int userId, int addressId)
    {
        var address = await _addressRepository.GetUserAddressByIdAsync(userId, addressId);
        if (address == null)
        {
            return ApiResponse<AddressDto>.FailResult("Adres bulunamadı.");
        }

        var addressDto = _mapper.Map<AddressDto>(address);
        return ApiResponse<AddressDto>.SuccessResult(addressDto);
    }

    public async Task<ApiResponse<AddressDto>> CreateAddressAsync(int userId, CreateAddressDto dto)
    {
        var address = _mapper.Map<Address>(dto);
        address.UserId = userId;

        // If this is the first address or marked as default, set it as default
        var addressCount = await _addressRepository.CountUserAddressesAsync(userId);
        if (addressCount == 0 || dto.IsDefault)
        {
            address.IsDefault = true;
            
            // If setting as default, remove default from others
            if (dto.IsDefault && addressCount > 0)
            {
                await _addressRepository.SetDefaultAddressAsync(userId, -1); // Clear all defaults
            }
        }

        var createdAddress = await _addressRepository.CreateAsync(address);
        var addressDto = _mapper.Map<AddressDto>(createdAddress);
        return ApiResponse<AddressDto>.SuccessResult(addressDto, "Adres başarıyla oluşturuldu.");
    }

    public async Task<ApiResponse<AddressDto>> UpdateAddressAsync(int userId, int addressId, UpdateAddressDto dto)
    {
        var address = await _addressRepository.GetUserAddressByIdAsync(userId, addressId);
        if (address == null)
        {
            return ApiResponse<AddressDto>.FailResult("Adres bulunamadı.");
        }

        _mapper.Map(dto, address);

        // If setting as default, remove default from others first
        if (dto.IsDefault && !address.IsDefault)
        {
            await _addressRepository.SetDefaultAddressAsync(userId, addressId);
        }
        else
        {
            await _addressRepository.UpdateAsync(address);
        }

        var addressDto = _mapper.Map<AddressDto>(address);
        return ApiResponse<AddressDto>.SuccessResult(addressDto, "Adres başarıyla güncellendi.");
    }

    public async Task<ApiResponse<bool>> DeleteAddressAsync(int userId, int addressId)
    {
        var address = await _addressRepository.GetUserAddressByIdAsync(userId, addressId);
        if (address == null)
        {
            return ApiResponse<bool>.FailResult("Adres bulunamadı.");
        }

        // If deleting default address, set another as default
        if (address.IsDefault)
        {
            var userAddresses = await _addressRepository.GetUserAddressesAsync(userId);
            var otherAddress = userAddresses.FirstOrDefault(a => a.Id != addressId);
            if (otherAddress != null)
            {
                otherAddress.IsDefault = true;
                await _addressRepository.UpdateAsync(otherAddress);
            }
        }

        await _addressRepository.DeleteAsync(addressId);
        return ApiResponse<bool>.SuccessResult(true, "Adres başarıyla silindi.");
    }

    public async Task<ApiResponse<bool>> SetDefaultAddressAsync(int userId, int addressId)
    {
        var address = await _addressRepository.GetUserAddressByIdAsync(userId, addressId);
        if (address == null)
        {
            return ApiResponse<bool>.FailResult("Adres bulunamadı.");
        }

        var success = await _addressRepository.SetDefaultAddressAsync(userId, addressId);
        if (success)
        {
            return ApiResponse<bool>.SuccessResult(true, "Varsayılan adres güncellendi.");
        }

        return ApiResponse<bool>.FailResult("Varsayılan adres güncellenemedi.");
    }
}
