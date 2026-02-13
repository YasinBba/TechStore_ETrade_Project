using Microsoft.AspNetCore.Identity;

namespace TechStore.Core.Entities;

public class ApplicationUser : IdentityUser<int>
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;

    // Navigation Properties
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}
