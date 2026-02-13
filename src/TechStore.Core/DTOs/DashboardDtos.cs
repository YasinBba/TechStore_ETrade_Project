using System;
using System.Collections.Generic;

namespace TechStore.Core.DTOs
{
    public class DashboardSummaryDto
    {
        public decimal TotalRevenue { get; set; } = 0;
        public int TotalOrders { get; set; } = 0;
        public int TotalProducts { get; set; } = 0;
        public int TotalUsers { get; set; } = 0;
        public List<RecentOrderDto> RecentOrders { get; set; } = new();
        public List<TopProductDto> TopProducts { get; set; } = new();
    }

    public class RecentOrderDto
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
    }

    public class TopProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int SoldCount { get; set; }
    }
}
