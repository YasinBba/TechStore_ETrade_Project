using System.Collections.Generic;
using System.Threading.Tasks;
using TechStore.Core.Entities;

namespace TechStore.Core.Interfaces.Services
{
    public interface IContentService
    {
        Task<List<Banner>> GetActiveBannersAsync();
        Task<List<Banner>> GetAllBannersAsync(); // Admin usage
        Task<Banner> GetBannerByIdAsync(int id);
        Task<Banner> CreateBannerAsync(Banner banner);
        Task<Banner> UpdateBannerAsync(int id, Banner banner);
        Task<bool> DeleteBannerAsync(int id);
    }
}
