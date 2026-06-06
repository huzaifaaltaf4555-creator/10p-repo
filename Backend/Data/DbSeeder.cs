using Microsoft.AspNetCore.Identity;
using TaskManager.API.Models;

namespace TaskManager.API.Data
{
    /// <summary>
    /// Seeds default roles, admin user, and sample tasks into the database.
    /// </summary>
    public static class DbSeeder
    {
        public static async Task SeedAsync(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var context = serviceProvider.GetRequiredService<AppDbContext>();

            // Seed roles
            string[] roles = { "Admin", "User" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            // Seed admin user
            var adminEmail = "admin@taskmanager.com";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);

            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    FullName = "System Admin",
                    EmailConfirmed = true,
                    CreatedAt = DateTime.UtcNow
                };

                var result = await userManager.CreateAsync(adminUser, "Admin@123");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }

            // Seed a regular user
            var userEmail = "user@taskmanager.com";
            var regularUser = await userManager.FindByEmailAsync(userEmail);

            if (regularUser == null)
            {
                regularUser = new ApplicationUser
                {
                    UserName = userEmail,
                    Email = userEmail,
                    FullName = "Ayesha Khan",
                    EmailConfirmed = true,
                    CreatedAt = DateTime.UtcNow
                };

                var result = await userManager.CreateAsync(regularUser, "User@123");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(regularUser, "User");
                }
            }

            // Re-fetch users to ensure IDs are available before seeding tasks
            adminUser = await userManager.FindByEmailAsync(adminEmail);
            regularUser = await userManager.FindByEmailAsync(userEmail);

            // Seed sample tasks if none exist
            if (!context.TaskItems.Any() && adminUser != null && regularUser != null)
            {
                var tasks = new List<TaskItem>
                {
                    new TaskItem
                    {
                        Title = "Finalize onboarding flow",
                        Description = "Align fields and copy with the updated requirements from Product.",
                        Status = TaskStatusEnum.InProgress,
                        Priority = TaskPriorityEnum.High,
                        Category = "UX",
                        DueDate = DateTime.UtcNow.AddDays(5),
                        AssignedUserId = regularUser!.Id,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new TaskItem
                    {
                        Title = "QA checklist for release",
                        Description = "Prepare and share regression checklist before the release.",
                        Status = TaskStatusEnum.Pending,
                        Priority = TaskPriorityEnum.Medium,
                        Category = "QA",
                        DueDate = DateTime.UtcNow.AddDays(7),
                        AssignedUserId = regularUser.Id,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new TaskItem
                    {
                        Title = "Update role permissions",
                        Description = "Review role scopes and update access to reporting modules.",
                        Status = TaskStatusEnum.Completed,
                        Priority = TaskPriorityEnum.Low,
                        Category = "Security",
                        DueDate = DateTime.UtcNow.AddDays(-2),
                        AssignedUserId = adminUser!.Id,
                        CreatedAt = DateTime.UtcNow.AddDays(-5),
                        UpdatedAt = DateTime.UtcNow
                    },
                    new TaskItem
                    {
                        Title = "Design system documentation",
                        Description = "Document the design tokens, component library, and usage guidelines.",
                        Status = TaskStatusEnum.InProgress,
                        Priority = TaskPriorityEnum.High,
                        Category = "Design",
                        DueDate = DateTime.UtcNow.AddDays(10),
                        AssignedUserId = adminUser.Id,
                        CreatedAt = DateTime.UtcNow.AddDays(-3),
                        UpdatedAt = DateTime.UtcNow
                    },
                    new TaskItem
                    {
                        Title = "Setup CI/CD pipeline",
                        Description = "Configure GitHub Actions for automated build, test, and deployment.",
                        Status = TaskStatusEnum.Pending,
                        Priority = TaskPriorityEnum.High,
                        Category = "DevOps",
                        DueDate = DateTime.UtcNow.AddDays(3),
                        AssignedUserId = regularUser.Id,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    }
                };

                context.TaskItems.AddRange(tasks);
                await context.SaveChangesAsync();
            }
        }
    }
}
