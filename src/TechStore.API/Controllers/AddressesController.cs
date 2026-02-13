using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TechStore.Application.DTOs.Users;
using TechStore.Application.Services;

namespace TechStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AddressesController : ControllerBase
{
    private readonly IAddressService _addressService;

    public AddressesController(IAddressService addressService)
    {
        _addressService = addressService;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim!);
    }

    /// <summary>
    /// Gets all addresses for the current user
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAddresses()
    {
        var userId = GetUserId();
        var result = await _addressService.GetUserAddressesAsync(userId);
        
        if (!result.Success)
            return BadRequest(result);
            
        return Ok(result);
    }

    /// <summary>
    /// Gets a specific address by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetAddress(int id)
    {
        var userId = GetUserId();
        var result = await _addressService.GetAddressAsync(userId, id);
        
        if (!result.Success)
            return NotFound(result);
            
        return Ok(result);
    }

    /// <summary>
    /// Creates a new address
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateAddress([FromBody] CreateAddressDto dto)
    {
        var userId = GetUserId();
        var result = await _addressService.CreateAddressAsync(userId, dto);
        
        if (!result.Success)
            return BadRequest(result);
            
        return CreatedAtAction(nameof(GetAddress), new { id = result.Data!.Id }, result);
    }

    /// <summary>
    /// Updates an existing address
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAddress(int id, [FromBody] UpdateAddressDto dto)
    {
        var userId = GetUserId();
        var result = await _addressService.UpdateAddressAsync(userId, id, dto);
        
        if (!result.Success)
            return BadRequest(result);
            
        return Ok(result);
    }

    /// <summary>
    /// Deletes an address
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAddress(int id)
    {
        var userId = GetUserId();
        var result = await _addressService.DeleteAddressAsync(userId, id);
        
        if (!result.Success)
            return BadRequest(result);
            
        return Ok(result);
    }

    /// <summary>
    /// Sets an address as the default address
    /// </summary>
    [HttpPut("{id}/set-default")]
    public async Task<IActionResult> SetDefaultAddress(int id)
    {
        var userId = GetUserId();
        var result = await _addressService.SetDefaultAddressAsync(userId, id);
        
        if (!result.Success)
            return BadRequest(result);
            
        return Ok(result);
    }
}
