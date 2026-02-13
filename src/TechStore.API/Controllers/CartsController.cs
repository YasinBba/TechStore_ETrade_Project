using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechStore.Application.DTOs.Cart;
using TechStore.Application.Services;
using System.Security.Claims;

namespace TechStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CartsController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartsController(ICartService cartService)
    {
        _cartService = cartService;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim!);
    }

    /// <summary>
    /// Gets the current user's cart
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var userId = GetUserId();
        var result = await _cartService.GetUserCartAsync(userId);
        
        if (!result.Success)
            return BadRequest(result);
            
        return Ok(result);
    }

    /// <summary>
    /// Adds an item to the cart
    /// </summary>
    [HttpPost("items")]
    public async Task<IActionResult> AddItem([FromBody] AddCartItemDto dto)
    {
        var userId = GetUserId();
        var result = await _cartService.AddItemToCartAsync(userId, dto);
        
        if (!result.Success)
            return BadRequest(result);
            
        return Ok(result);
    }

    /// <summary>
    /// Updates cart item quantity
    /// </summary>
    [HttpPut("items/{id}")]
    public async Task<IActionResult> UpdateItemQuantity(int id, [FromBody] UpdateCartItemDto dto)
    {
        var userId = GetUserId();
        var result = await _cartService.UpdateCartItemQuantityAsync(userId, id, dto);
        
        if (!result.Success)
            return BadRequest(result);
            
        return Ok(result);
    }

    /// <summary>
    /// Removes an item from the cart
    /// </summary>
    [HttpDelete("items/{id}")]
    public async Task<IActionResult> RemoveItem(int id)
    {
        var userId = GetUserId();
        var result = await _cartService.RemoveCartItemAsync(userId, id);
        
        if (!result.Success)
            return BadRequest(result);
            
        return Ok(result);
    }

    /// <summary>
    /// Clears the entire cart
    /// </summary>
    [HttpDelete]
    public async Task<IActionResult> ClearCart()
    {
        var userId = GetUserId();
        var result = await _cartService.ClearCartAsync(userId);
        
        if (!result.Success)
            return BadRequest(result);
            
        return Ok(result);
    }
}
