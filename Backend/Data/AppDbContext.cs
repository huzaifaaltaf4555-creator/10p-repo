using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TaskManager.API.Models;

namespace TaskManager.API.Data
{
    /// <summary>
    /// Application database context using Identity and EF Core.
    /// </summary>
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<TaskItem> TaskItems { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure TaskItem entity
            builder.Entity<TaskItem>(entity =>
            {
                entity.HasKey(t => t.Id);

                entity.Property(t => t.Title)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(t => t.Description)
                    .HasMaxLength(2000);

                entity.Property(t => t.Category)
                    .HasMaxLength(100);

                // Convert enums to strings in the database for readability
                entity.Property(t => t.Status)
                    .HasConversion<string>();

                entity.Property(t => t.Priority)
                    .HasConversion<string>();

                // Relationship: One User -> Many Tasks
                entity.HasOne(t => t.AssignedUser)
                    .WithMany(u => u.Tasks)
                    .HasForeignKey(t => t.AssignedUserId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Index for faster user-based queries
                entity.HasIndex(t => t.AssignedUserId);
                entity.HasIndex(t => t.Status);
            });
        }
    }
}
