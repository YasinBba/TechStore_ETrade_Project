using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechStore.Core.Interfaces.Services;
using TechStore.Core.Entities;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace TechStore.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContentController : ControllerBase
    {
        private readonly IContentService _contentService;

        public ContentController(IContentService contentService)
        {
            _contentService = contentService;
        }

        [HttpGet("banners/active")]
        public async Task<IActionResult> GetActiveBanners()
        {
            var banners = await _contentService.GetActiveBannersAsync();
            return Ok(banners);
        }

        [HttpGet("banners")]
        public async Task<IActionResult> GetAllBanners([FromQuery] bool? activeOnly = null)
        {
            List<Banner> banners;
            
            if (activeOnly == true)
            {
                banners = await _contentService.GetActiveBannersAsync();
            }
            else
            {
                banners = await _contentService.GetAllBannersAsync();
            }
            
            return Ok(banners);
        }

        [HttpPost("banners")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateBanner([FromBody] Banner banner)
        {
            var created = await _contentService.CreateBannerAsync(banner);
            return Ok(created);
        }

        [HttpPut("banners/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateBanner(int id, [FromBody] Banner banner)
        {
            var updated = await _contentService.UpdateBannerAsync(id, banner);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("banners/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteBanner(int id)
        {
            var result = await _contentService.DeleteBannerAsync(id);
            if (!result) return NotFound();
            return Ok(result);
        }
    }
}
