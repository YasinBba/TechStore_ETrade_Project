using System.ComponentModel.DataAnnotations;

namespace TechStore.Core.Entities
{
    public class Banner : BaseEntity
    {
        [Required]
        public string Title { get; set; }
        public string Description { get; set; }
        [Required]
        public string ImageUrl { get; set; }
        public string LinkUrl { get; set; }
        public bool IsActive { get; set; } = true;
        public int Order { get; set; }
    }
}
