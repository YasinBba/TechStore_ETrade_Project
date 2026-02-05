using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TechStore.Core.Entities;

namespace TechStore.Infrastructure.Data.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("Orders");

        builder.HasKey(o => o.Id);

        builder.Property(o => o.OrderNumber)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(o => o.OrderNumber)
            .IsUnique();

        builder.Property(o => o.SubTotal)
            .HasColumnType("decimal(18,2)");

        builder.Property(o => o.ShippingCost)
            .HasColumnType("decimal(18,2)");

        builder.Property(o => o.Tax)
            .HasColumnType("decimal(18,2)");

        builder.Property(o => o.Discount)
            .HasColumnType("decimal(18,2)");

        builder.Property(o => o.Total)
            .HasColumnType("decimal(18,2)");

        // Relationships
        builder.HasOne(o => o.User)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(o => o.ShippingAddress)
            .WithMany()
            .HasForeignKey(o => o.ShippingAddressId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(o => o.Coupon)
            .WithMany(c => c.Orders)
            .HasForeignKey(o => o.CouponId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(o => o.OrderItems)
            .WithOne(oi => oi.Order)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(o => o.StatusHistories)
            .WithOne(sh => sh.Order)
            .HasForeignKey(sh => sh.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Property(o => o.CreatedAt)
            .HasDefaultValueSql("GETUTCDATE()");
    }
}
