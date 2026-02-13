namespace TechStore.Core.Entities;

public class Address : BaseEntity
{
    public int UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string Neighborhood { get; set; } = string.Empty;
    public string AddressLine1 { get; set; } = string.Empty;
    public string? AddressLine2 { get; set; }
    public string PostalCode { get; set; } = string.Empty;
    public string AddressType { get; set; } = "Home"; // Home, Work, Other
    public bool IsDefault { get; set; } = false;

    // Navigation Properties
    public User User { get; set; } = null!;
}
