using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechStore.Core.Interfaces.Services;
using TechStore.Core.Entities;

namespace TechStore.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class StockController : ControllerBase
    {
        private readonly IStockService _stockService;

        public StockController(IStockService stockService)
        {
            _stockService = stockService;
        }

        [HttpPost("update")]
        public async Task<IActionResult> UpdateStock([FromBody] UpdateStockRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var result = await _stockService.UpdateStockAsync(request.ProductId, request.NewStock, request.Reason, userId);
            
            if (result) return Ok(new { success = true, message = "Stok güncellendi." });
            return BadRequest(new { success = false, message = "Stok güncellenemedi." });
        }

        [HttpGet("history/{productId}")]
        public async Task<IActionResult> GetHistory(int productId)
        {
            var history = await _stockService.GetHistoryAsync(productId);
            return Ok(new { success = true, data = history });
        }

        [HttpGet("low-stock")]
        public async Task<IActionResult> GetLowStock([FromQuery] int threshold = 10)
        {
            var products = await _stockService.GetLowStockProductsAsync(threshold);
            return Ok(new { success = true, data = products });
        }
    }

    public class UpdateStockRequest
    {
        public int ProductId { get; set; }
        public int NewStock { get; set; }
        public string Reason { get; set; }
    }
}
