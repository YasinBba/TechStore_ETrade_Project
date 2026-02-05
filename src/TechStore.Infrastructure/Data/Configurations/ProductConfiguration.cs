using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TechStore.Core.Entities;

namespace TechStore.Infrastructure.Data.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Products");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(p => p.Slug)
            .IsRequired()
            .HasMaxLength(250);

        builder.HasIndex(p => p.Slug)
            .IsUnique();

        builder.Property(p => p.Description)
            .HasColumnType("nvarchar(max)");

        builder.Property(p => p.Price)
            .HasColumnType("decimal(18,2)");

        builder.Property(p => p.OldPrice)
            .HasColumnType("decimal(18,2)");

        builder.Property(p => p.SKU)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(p => p.SKU)
            .IsUnique();

        // Relationships
        builder.HasOne(p => p.Category)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(p => p.Brand)
            .WithMany(b => b.Products)
            .HasForeignKey(p => p.BrandId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(p => p.Images)
            .WithOne(i => i.Product)
            .HasForeignKey(i => i.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.Specifications)
            .WithOne(s => s.Product)
            .HasForeignKey(s => s.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.Reviews)
            .WithOne(r => r.Product)
            .HasForeignKey(r => r.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        // Default values
        builder.Property(p => p.IsActive)
            .HasDefaultValue(true);

        builder.Property(p => p.IsFeatured)
            .HasDefaultValue(false);

        builder.Property(p => p.ViewCount)
            .HasDefaultValue(0);

        builder.Property(p => p.AverageRating)
            .HasDefaultValue(0);

        builder.Property(p => p.ReviewCount)
            .HasDefaultValue(0);

        builder.Property(p => p.CreatedAt)
            .HasDefaultValueSql("GETUTCDATE()");
    }
}
