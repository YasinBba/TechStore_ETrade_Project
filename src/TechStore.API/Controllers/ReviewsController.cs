using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TechStore.Application.DTOs.Common;
using TechStore.Application.DTOs.Reviews;
using TechStore.Application.Services;

namespace TechStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewsController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim!);
    }

    /// <summary>
    /// Get all reviews for a specific product
    /// </summary>
    [HttpGet("product/{productId}")]
    public async Task<IActionResult> GetProductReviews(int productId, [FromQuery] bool includeUnapproved = false)
    {
        var approvedOnly = !includeUnapproved;
        var response = await _reviewService.GetProductReviewsAsync(productId, approvedOnly);
        return Ok(response);
    }

    /// <summary>
    /// Get review summary for a product (average rating, distribution)
    /// </summary>
    [HttpGet("product/{productId}/summary")]
    public async Task<IActionResult> GetProductReviewSummary(int productId)
    {
        var response = await _reviewService.GetProductReviewSummaryAsync(productId);
        return Ok(response);
    }

    /// <summary>
    /// Get current user's reviews
    /// </summary>
    [HttpGet("my-reviews")]
    [Authorize]
    public async Task<IActionResult> GetMyReviews()
    {
        var userId = GetUserId();
        var response = await _reviewService.GetUserReviewsAsync(userId);
        return Ok(response);
    }

    /// <summary>
    /// Get pending reviews (admin only)
    /// </summary>
    [HttpGet("pending")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetPendingReviews()
    {
        var response = await _reviewService.GetPendingReviewsAsync();
        return Ok(response);
    }

    /// <summary>
    /// Get review by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetReviewById(int id)
    {
        var response = await _reviewService.GetReviewByIdAsync(id);
        if (!response.Success)
        {
            return NotFound(response);
        }
        return Ok(response);
    }

    /// <summary>
    /// Create a new review
    /// </summary>
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateReview([FromBody] CreateReviewDto dto)
    {
        var userId = GetUserId();
        var response = await _reviewService.CreateReviewAsync(userId, dto);
        if (!response.Success)
        {
            return BadRequest(response);
        }
        return CreatedAtAction(nameof(GetReviewById), new { id = response.Data!.Id }, response);
    }

    /// <summary>
    /// Update existing review
    /// </summary>
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateReview(int id, [FromBody] UpdateReviewDto dto)
    {
        var userId = GetUserId();
        var response = await _reviewService.UpdateReviewAsync(userId, id, dto);
        if (!response.Success)
        {
            return BadRequest(response);
        }
        return Ok(response);
    }

    /// <summary>
    /// Delete review
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteReview(int id)
    {
        var userId = GetUserId();
        var response = await _reviewService.DeleteReviewAsync(userId, id);
        if (!response.Success)
        {
            return BadRequest(response);
        }
        return Ok(response);
    }

    /// <summary>
    /// Mark review as helpful
    /// </summary>
    [HttpPost("{id}/helpful")]
    public async Task<IActionResult> MarkAsHelpful(int id)
    {
        var response = await _reviewService.MarkAsHelpfulAsync(id);
        if (!response.Success)
        {
            return NotFound(response);
        }
        return Ok(response);
    }

    /// <summary>
    /// Approve review (admin only)
    /// </summary>
    [HttpPut("{id}/approve")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ApproveReview(int id)
    {
        var response = await _reviewService.ApproveReviewAsync(id);
        if (!response.Success)
        {
            return NotFound(response);
        }
        return Ok(response);
    }
}
