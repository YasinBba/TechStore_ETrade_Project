using Microsoft.EntityFrameworkCore;
using TechStore.Core.Entities;
using TechStore.Infrastructure.Data;
using TechStore.Core.Interfaces.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace TechStore.Infrastructure.Services
{
    public class ContentService : IContentService
    {
        private readonly ApplicationDbContext _context;

        public ContentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Banner>> GetActiveBannersAsync()
        {
            return await _context.Banners
                .Where(b => b.IsActive)
                .OrderBy(b => b.Order)
                .ToListAsync();
        }

        public async Task<List<Banner>> GetAllBannersAsync()
        {
            return await _context.Banners
                .OrderBy(b => b.Order)
                .ToListAsync();
        }

        public async Task<Banner> CreateBannerAsync(Banner banner)
        {
            _context.Banners.Add(banner);
            await _context.SaveChangesAsync();
            return banner;
        }

        public async Task<Banner> UpdateBannerAsync(int id, Banner banner)
        {
            var existing = await _context.Banners.FindAsync(id);
            if (existing == null) return null;

            existing.Title = banner.Title;
            existing.Description = banner.Description;
            existing.ImageUrl = banner.ImageUrl;
            existing.LinkUrl = banner.LinkUrl;
            existing.IsActive = banner.IsActive;
            existing.Order = banner.Order;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteBannerAsync(int id)
        {
            var banner = await _context.Banners.FindAsync(id);
            if (banner == null) return false;

            _context.Banners.Remove(banner);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Banner> GetBannerByIdAsync(int id)
        {
             return await _context.Banners.FindAsync(id);
        }
    }
}
