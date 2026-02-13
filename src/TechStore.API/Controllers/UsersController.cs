using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using AutoMapper;
using TechStore.Application.DTOs.Users;
using TechStore.Core.Interfaces.Repositories;
using TechStore.Application.DTOs.Common;
using Microsoft.AspNetCore.Identity;
using TechStore.Infrastructure.Data;
using TechStore.Core.Entities;

namespace TechStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;
    private readonly UserManager<ApplicationUser> _userManager;

    public UsersController(
        IUserRepository userRepository,
        IMapper _mapper,
        UserManager<ApplicationUser> userManager)
    {
        _userRepository = userRepository;
        this._mapper = _mapper;
        _userManager = userManager;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim!);
    }

    /// <summary>
    /// Gets the current user's profile
    /// </summary>
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = GetUserId();
        var user = await _userManager.FindByIdAsync(userId.ToString());
        
        if (user == null)
        {
            return NotFound(ApiResponse<UserProfileDto>.FailResult("Kullanıcı bulunamadı"));
        }

        var profileDto = new UserProfileDto
        {
            Id = userId,
            Email = user.Email!,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Phone = user.PhoneNumber
        };

        return Ok(ApiResponse<UserProfileDto>.SuccessResult(profileDto));
    }

    /// <summary>
    /// Updates the current user's profile
    /// </summary>
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserProfileDto dto)
    {
        var userId = GetUserId();
        var user = await _userManager.FindByIdAsync(userId.ToString());
        
        if (user == null)
        {
            return NotFound(ApiResponse<UserProfileDto>.FailResult("Kullanıcı bulunamadı"));
        }

        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.PhoneNumber = dto.Phone;

        var result = await _userManager.UpdateAsync(user);
        
        if (!result.Succeeded)
        {
            return BadRequest(ApiResponse<UserProfileDto>.FailResult("Profil güncellenemedi"));
        }

        var profileDto = new UserProfileDto
        {
            Id = userId,
            Email = user.Email!,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Phone = user.PhoneNumber
        };

        return Ok(ApiResponse<UserProfileDto>.SuccessResult(profileDto, "Profil başarıyla güncellendi"));
    }

    /// <summary>
    /// Changes the current user's password
    /// </summary>
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        var userId = GetUserId();
        var user = await _userManager.FindByIdAsync(userId.ToString());
        
        if (user == null)
        {
            return NotFound(ApiResponse<bool>.FailResult("Kullanıcı bulunamadı"));
        }

        var result = await _userManager.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);
        
        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description).ToList();
            return BadRequest(ApiResponse<bool>.FailResult("Şifre değiştirilemedi", errors));
        }

        return Ok(ApiResponse<bool>.SuccessResult(true, "Şifre başarıyla değiştirildi"));
    }
}
