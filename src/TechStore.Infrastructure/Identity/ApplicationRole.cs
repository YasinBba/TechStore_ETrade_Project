using Microsoft.AspNetCore.Identity;

namespace TechStore.Infrastructure.Identity;

public class ApplicationRole : IdentityRole<int>
{
    public string? Description { get; set; }
}
