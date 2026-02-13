using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechStore.Core.Entities
{
    public class StockHistory
    {
        [Key]
        public int Id { get; set; }

        public int ProductId { get; set; }
        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; }

        public int OldStock { get; set; }
        public int NewStock { get; set; }
        public int ChangeAmount { get; set; } // + or -
        public string Reason { get; set; } // "Order", "Restock", "Adjustment", "Return"
        
        public string CreatedBy { get; set; } // UserId or "System"
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
