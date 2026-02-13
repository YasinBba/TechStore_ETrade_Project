using System.Threading.Tasks;
using TechStore.Core.DTOs; // New location

namespace TechStore.Core.Interfaces.Services
{
    public interface IDashboardService
    {
        Task<DashboardSummaryDto> GetSummaryAsync();
    }
}
